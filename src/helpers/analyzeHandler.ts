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

type AnalysisType = "vacancy" | "curriculum";

interface AnalysisResponse {
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

export async function handleAnalysis(
  request: Request,
  type: AnalysisType
): Promise<NextResponse<AnalysisResponse>> {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const text = formData.get("text") as string;

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

    const input: ConverseCommandInput = {
      modelId: "amazon.nova-pro-v1:0",
      messages: [
        {
          role: ConversationRole.USER,
          content: [
            { text },
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
          text: "Based on the resources provided by the user, extract all the information about each file and page, reorder the information and return it in a structured way.",
        },
      ],
    };

    const command = new ConverseCommand(input);
    const response = await client.send(command);

    console.log(
      "Response:",
      response,
      response.output?.message?.content?.map((block) => block.text)
    );

    return NextResponse.json({
      success: true,
      message:
        type === "vacancy"
          ? backendSuccessLabels.vacancyAnalyzed
          : backendSuccessLabels.curriculumAnalyzed,
      data: {
        files: files.map((file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
        })),
        text,
      },
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
