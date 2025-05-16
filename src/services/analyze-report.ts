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

    const object = await workflowReport(
      "english",
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
