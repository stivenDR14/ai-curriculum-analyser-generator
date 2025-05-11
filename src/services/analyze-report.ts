import { isGreaterThanMaximumSize } from "@/helpers/cases";
import { backendErrorsLabels, backendSuccessLabels } from "@/utils/labels";
import { NextResponse } from "next/server";
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConversationRole,
  ContentBlock,
  Message,
  ConverseCommandInput,
} from "@aws-sdk/client-bedrock-runtime";
import { PROMPT_REPORTE_GENERATOR } from "@/utils/constants-server";

type ReportType = "vacancy" | "curriculum";

interface ReportResponse {
  success: boolean;
  message: string;
  data?: {
    files: Array<{
      name: string;
      type: string;
      size: number;
    }>;
    text: string;
  };
  error?: string;
}

function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9\s\-\(\)\[\]]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export async function handleReport(
  request: Request,
  type: ReportType
): Promise<NextResponse<ReportResponse>> {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const text = formData.get("text") as string;
    const mainResource =
      type === "curriculum" ? formData.get("vacancy") : formData.get("resume");

    console.log(
      `${type.charAt(0).toUpperCase() + type.slice(1)} Analysis Payload:`,
      {
        files: files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
        text,
      }
    );

    if (
      isGreaterThanMaximumSize(files.reduce((acc, file) => acc + file.size, 0))
    ) {
      return NextResponse.json({
        success: false,
        message: backendErrorsLabels.maximumSize,
      });
    }

    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION,
    });

    const language = "spanish";

    const input: ConverseCommandInput = {
      modelId: "amazon.nova-pro-v1:0",
      messages: [
        {
          role: ConversationRole.USER,
          content: [
            {
              text:
                type === "curriculum"
                  ? `
                Now, take the resume, descriptions, resources and all the information that you have below and create the affinity report using the structure and best practices:
                
                ${
                  text
                    ? `
                *Text resources of the candidate*
                ${text} 
                -----
                `
                    : ""
                }

                ${
                  files.length > 0
                    ? `
                *Files resources of the candidate*
                ${files.map((file) => file.name).join("\n")}
                -----
                `
                    : ""
                }

                *Resources of the vacancy*
                ${mainResource}
                -----

                
                please provide the response in the following JSON format:
                {
                  "documents": {
                    "report": "string",
                    "percentage": "string",
                    "summary": "string",
                  },
                  "error": "string"
                }


                the whole text must be written in ${language}.

                `
                  : `
                       
                Now, take the resume, descriptions, resources and all the information that you have below and create the affinity report and the respective cover letter using the structure and best practices:

                ${
                  text
                    ? `
                There are the resources that you have to take into account:
                
                ${
                  text !== ""
                    ? `*Text resources of the vacancy*
                ${text} 
                -----
                `
                    : ""
                }
              
                `
                    : ""
                }

                ${
                  files.length > 0
                    ? `
                *Files resources of the vacancy*
                **Take the added Files into account and use them to create the best cover letter for make me got hired, extracting all the information you can. Also generate the respective affinity report.**
                -----
                      `
                    : ""
                }

                *Resources of the candidate*
                ${mainResource}
                -----

                Please provide the response in the following JSON format:
                {
                  "documents": {
                    "report": "string",
                    "percentage": "string",
                    "coverLetter": "string",
                    "summary": "string"
                  },
                  "error": "string"
                }

                and each field must be written in ${language}.
              `,
            },
            ...(await Promise.all(
              files.map(async (file) => ({
                document: {
                  format: file.type.split("/")[1] || "txt",
                  name: sanitizeFileName(file.name),
                  source: {
                    bytes: Buffer.from(await file.arrayBuffer()),
                  },
                },
              }))
            )),
          ] as ContentBlock[],
        },
      ] as Message[],
      system: [
        {
          text: await PROMPT_REPORTE_GENERATOR(language),
        },
      ],
      inferenceConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 3000,
      },
    };

    const command = new ConverseCommand(input);
    const response = await client.send(command);

    console.log(
      "Response:",
      response,
      response.output?.message?.content?.length,
      response.output?.message?.content?.[0]?.text,
      response.output?.message?.content?.[1]?.text
    );

    // Extraer el texto de la respuesta
    const responseText = response.output?.message?.content?.[0]?.text || "";

    // Intentar extraer el JSON de la respuesta
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch (error) {
      console.error("First error parsing JSON response:", error);
      try {
        //lets try to parse the formmat that could be ````json\n{...}\n`````
        jsonResponse = JSON.parse(
          responseText.replace(/```json\n/, "").replace(/\n```/, "")
        );
      } catch (error) {
        console.error("Second error parsing JSON response:", error);
        return NextResponse.json(
          {
            success: false,
            message: backendErrorsLabels.errorProcessingCurriculum,
            error: "Invalid JSON response from model",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message:
        type === "vacancy"
          ? backendSuccessLabels.vacancyAnalyzed
          : backendSuccessLabels.curriculumAnalyzed,
      data: jsonResponse,
    });
  } catch (error) {
    console.error(`Error processing ${type}:`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          type === "vacancy"
            ? backendErrorsLabels.errorProcessingVacancy
            : backendErrorsLabels.errorProcessingCurriculum,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
