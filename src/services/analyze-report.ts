import { isGreaterThanMaximumSize } from "@/helpers/cases";
import { backendErrorsLabels, backendSuccessLabels } from "@/utils/labels";
import { NextResponse } from "next/server";
import { z } from "zod";
import { workflowReport } from "./workflow-report";

export type ReportType = "vacancy" | "curriculum";

export const CurriculumReportSchema = z.object({
  documents: z.object({
    report: z.string(),
    percentage: z.string(),
    summary: z.string(),
  }),
  error: z.string(),
});

export const VacancyReportSchema = z.object({
  documents: z.object({
    report: z.string(),
    percentage: z.string(),
    summary: z.string(),
    coverLetter: z.string(),
  }),
  error: z.string(),
});

interface ReportResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
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

    if (
      isGreaterThanMaximumSize(files.reduce((acc, file) => acc + file.size, 0))
    ) {
      return NextResponse.json({
        success: false,
        message: backendErrorsLabels.maximumSize,
      });
    }

    /* console.log(
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
    // Create the Bedrock provider using Vercel AI SDK
    const bedrock = createAmazonBedrock({
      region: process.env.AWS_REGION || "us-east-1",
      // Credentials are loaded from environment variables by default
    });

    const language = "spanish";
    const modelId = "amazon.nova-pro-v1:0";

    // Preparar el prompt y los archivos
    let userPrompt = "";
    if (type === "curriculum") {
      userPrompt = `
      Now, take the resume, descriptions, resources and all the information that you have below and create the affinity report using the structure and best practices:
      
      ${text ? `*Text resources of the candidate*\n${text}\n-----\n` : ""}

      ${files.length > 0 ? `*Files resources of the candidate*\n${files.map((file) => file.name).join("\n")}\n-----\n` : ""}

      *Resources of the vacancy*\n${mainResource}\n-----\n
      The whole text must be written in ${language}.
      `;
    } else {
      userPrompt = `
      Now, take the resume, descriptions, resources and all the information that you have below and create the affinity report and the respective cover letter using the structure and best practices:

      ${text ? `There are the resources that you have to take into account:\n\n${text !== "" ? `*Text resources of the vacancy*\n${text}\n-----\n` : ""}\n` : ""}

      ${files.length > 0 ? `*Files resources of the vacancy*\n${files.map((file) => file.name).join("\n")}\n-----\n**Take the added Files into account and use them to create the best cover letter for make me got hired, extracting all the information you can. Also generate the respective affinity report.**\n-----\n` : ""}

      *Resources of the candidate*\n${mainResource}\n-----\n
      Each field must be written in ${language}.
      `;
    }

    const systemPrompt = await PROMPT_REPORTE_GENERATOR(language);

    const messages: [CoreSystemMessage, CoreUserMessage] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          ...(await Promise.all(
            files.map(async (file) => {
              const buffer = await file.arrayBuffer();
              return {
                type: "file" as const,
                data: buffer,
                mimeType: file.type,
              };
            })
          )),
        ],
      },
    ];

    const { object } =
      type === "vacancy"
        ? await generateObject({
            model: bedrock.languageModel(modelId),
            messages,
            schema: VacancyReportSchema,
            maxTokens: 4000,
            temperature: 0.4,
            topP: 0.5,
          })
        : await generateObject({
            model: bedrock.languageModel(modelId),
            messages,
            schema: CurriculumReportSchema,
            maxTokens: 4000,
            temperature: 0.4,
            topP: 0.5,
          }); */

    const object = await workflowReport(
      "spanish",
      text,
      files,
      type,
      mainResource
    );

    if (!object) {
      return NextResponse.json(
        {
          success: false,
          message: backendErrorsLabels.errorProcessingCurriculum,
          error: "No structured answer returned by the model.",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
      message:
        type === "vacancy"
          ? backendSuccessLabels.vacancyAnalyzed
          : backendSuccessLabels.curriculumAnalyzed,
      data: object,
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
