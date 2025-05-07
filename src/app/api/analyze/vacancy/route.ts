import { isGreaterThanMaximumSize } from "@/helpers/cases";
import { backendErrorsLabels, backendSuccessLabels } from "@/utils/labels";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];
    const text = formData.get("text") as string;

    // Por ahora solo imprimimos el payload
    console.log("Vacancy Analysis Payload:", {
      files: files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
      })),
      text,
    });

    if (
      isGreaterThanMaximumSize(files.reduce((acc, file) => acc + file.size, 0))
    ) {
      return NextResponse.json({
        success: false,
        message: backendErrorsLabels.maximumSize,
      });
    }

    return NextResponse.json({
      success: true,
      message: backendSuccessLabels.vacancyAnalyzed,
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
    console.error("Error processing vacancy:", error);
    return NextResponse.json(
      {
        success: false,
        message: backendErrorsLabels.errorProcessingVacancy,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
