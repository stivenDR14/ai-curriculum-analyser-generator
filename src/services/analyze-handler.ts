import { isGreaterThanMaximumSize } from "@/helpers/cases";
import { backendErrorsLabels, backendSuccessLabels } from "@/utils/labels";
import { NextResponse } from "next/server";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateObject } from "ai";
import { z } from "zod";
import {
  PROMPT_RESUME_REWRITE,
  PROMPT_VACANCY_REWRITE,
} from "@/utils/constants-server";
import { CoreSystemMessage, CoreUserMessage } from "@mastra/core";

type AnalysisType = "vacancy" | "curriculum";

interface AnalysisResponse {
  success: boolean;
  message: string;
  data?: unknown;
  error?: string;
}

// Zod schema for IResume
const ResumeSchema = z.object({
  title: z.string(),
  contactInformation: z.string(),
  professionalSummary: z.string(),
  skills: z.string(),
  workExperience: z.string(),
  projects: z.string(),
  education: z.string(),
  certifications: z.string(),
});

// Zod schema for curriculum output
const CurriculumOutputSchema = z.object({
  resume: ResumeSchema,
  suggestions: z.string(),
  error: z.string(),
});

// Zod schema for vacancy output
const VacancyOutputSchema = z.object({
  vacancy: z.string(),
  suggestions: z.string(),
  error: z.string(),
});

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

    // Create the Bedrock provider using Vercel AI SDK
    const bedrock = createAmazonBedrock({
      region: process.env.AWS_REGION || "us-east-1",
      // Credentials are loaded from environment variables by default
    });

    const language = "english";
    const modelId = "amazon.nova-pro-v1:0";

    // Prepare the prompt and input for the model
    let userPrompt = "";
    if (type === "vacancy") {
      userPrompt = `\nNow, take the information that is added below and rewrite it using the structure and best practices above:\n\n${
        text ? `*Text resources*\n${text}\n-----\n` : ""
      }\n${
        files.length > 0
          ? `*Files resources*\n${files.map((file) => file.name).join("\n")}\n-----\n`
          : ""
      }\n\nThe whole text must be written in ${language}.\n`;
    } else {
      userPrompt = `\nNow, take the resume, descriptions, resources and all the information that you have below and rewrite it using the structure and best practices above:\n\n${
        text
          ? `There are the resources that you have to take into account:\n\n${
              text !== "" ? `*Text resources*\n${text}\n-----\n` : ""
            }\n\n`
          : ""
      }\n${
        files.length > 0
          ? `*Files resources*\n${files.map((file) => file.name).join("\n")}\n-----\n**Take the added Files into account and use them to improve the resume, extracting all the information you can and reordering the sections to make it more readable and ATS friendly.**\n-----\n`
          : ""
      }\n\nEach field must be written in ${language}.`;
    }

    // Prepare the system prompt
    const systemPrompt =
      type === "vacancy"
        ? await PROMPT_VACANCY_REWRITE(language)
        : await PROMPT_RESUME_REWRITE(language);

    const messages: [CoreSystemMessage, CoreUserMessage] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: userPrompt,
          },
          ...(await Promise.all(
            files.map(async (file) => ({
              type: "file" as const,
              data: await file.arrayBuffer(),
              mimeType: file.type,
            }))
          )),
        ],
      },
    ];

    const { object } =
      type === "vacancy"
        ? await generateObject({
            model: bedrock.languageModel(modelId),
            schema: VacancyOutputSchema,
            messages,
            maxTokens: 4000,
            temperature: 0.4,
            topP: 0.9,
          })
        : await generateObject({
            model: bedrock.languageModel(modelId),
            schema: CurriculumOutputSchema,
            messages,
            maxTokens: 4000,
            temperature: 0.4,
            topP: 0.9,
          });

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
