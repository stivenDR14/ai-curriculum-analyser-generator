import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { Step } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { Workflow } from "@mastra/core/workflows";
import {
  CurriculumReportSchema,
  ReportType,
  VacancyReportSchema,
} from "./analyze-report";
import { PROMPT_REPORTE_GENERATOR } from "@/utils/constants-server";
import { z } from "zod";

export const workflowReport = async (
  language: string,
  text: string,
  files: File[],
  reportType: ReportType,
  mainResource: FormDataEntryValue | null
) => {
  const modelIdNova = "amazon.nova-pro-v1:0";
  const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION || "us-east-1",
  });

  // Obtener el prompt del sistema
  const systemPrompt = await PROMPT_REPORTE_GENERATOR(language);

  // Preparar el prompt del usuario según el tipo de reporte
  let userPrompt = "";

  if (reportType === "curriculum") {
    userPrompt = `
      Take the resume, descriptions, resources and all the information below and create the affinity report using the structure and best practices:
      
      ${text ? `*Text resources of the candidate*\n${text}\n-----\n` : ""}

      ${files.length > 0 ? `*Files resources of the candidate*\n${files.map((file) => file.name).join("\n")}\n-----\n` : ""}

      *Resources of the vacancy*\n${mainResource}\n-----\n
      The whole text must be written in ${language}.
    `;
  } else {
    userPrompt = `
      Take the resume, descriptions, resources and all the information below and create the affinity report and the respective cover letter using the structure and best practices:

      ${text ? `There are the resources that you have to take into account:\n\n${text !== "" ? `*Text resources of the vacancy*\n${text}\n-----\n` : ""}\n` : ""}

      ${files.length > 0 ? `*Files resources of the vacancy*\n${files.map((file) => file.name).join("\n")}\n-----\n**Take the added Files into account and use them to create the best cover letter for make me got hired, extracting all the information you can. Also generate the respective affinity report.**\n-----\n` : ""}

      *Resources of the candidate*\n${mainResource}\n-----\n
      Each field must be written in ${language}.
    `;
  }

  const talentAnalyserAgent = new Agent({
    name: "Talent Analyser",
    instructions: `You are an expert talent recruitment analyst. Analyze the candidate's profile and the job vacancy to determine their compatibility. 
    Focus on skills, experience, education, and cultural fit. Use the structure outlined in the system prompt. 
    Your output should be detailed, objective, and highlight both strengths and areas for improvement.
    Write your analysis in ${language}.`,
    model: bedrock.languageModel(modelIdNova),
  });

  const expertVacantAgent = new Agent({
    name: "Expert on the position",
    instructions: `You are a senior hiring manager with extensive experience in this field. 
    Analyze how well the candidate's experience and skills match the specific requirements of this position.
    Provide a detailed assessment based on technical competencies, domain knowledge, and relevant achievements.
    Write your assessment in ${language}.`,
    model: bedrock.languageModel(modelIdNova),
  });

  const redactorAgent = new Agent({
    name: "Redactor",
    instructions: `You are a professional cover letter writer. Based on the candidate's profile and the job vacancy, 
    craft a persuasive and personalized cover letter that highlights the candidate's relevant experience, skills, and motivation.
    Follow the structure in the system prompt and ensure it's written in ${language}.`,
    model: bedrock.languageModel(modelIdNova),
  });

  const integratorAgent = new Agent({
    name: "Integrator",
    instructions: `You are responsible for combining analyses from multiple experts into a cohesive final report.
    Organize the information into a structured JSON format as specified in the system prompt.
    Ensure all required fields are included and the output adheres to the specified schema.
    The final output must be in ${language}.`,
    model: bedrock.languageModel(modelIdNova),
  });

  // Crear el workflow
  const reportWorkflow = new Workflow({
    name: "affinity-report-workflow",
    triggerSchema: z.object({
      language: z.string(),
      text: z.string(),
      files: z.array(z.any()),
      reportType: z.enum(["vacancy", "curriculum"]),
      systemPrompt: z.string(),
      userPrompt: z.string(),
    }),
  });

  // Paso para el análisis de talento
  const talentAnalysisStep = new Step({
    id: "talentAnalysisStep",
    execute: async () => {
      const result = await talentAnalyserAgent.generate([
        {
          role: "system",
          content: `
        
                Analyze the candidate's fit for this position focusing on recruitment aspects. Provide a detailed analysis of strengths, areas for improvement, and key questions to explore.`,
        },
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
      ]);
      return { talentAnalysis: result.text };
    },
  });

  // Paso para el análisis del experto en la posición
  const expertAnalysisStep = new Step({
    id: "expertAnalysisStep",
    execute: async () => {
      const result = await expertVacantAgent.generate([
        {
          role: "system",
          content: `
    
            As an expert in this field, evaluate how well the candidate's technical skills and experience align with the requirements. Focus on domain expertise and specific achievements.`,
        },
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
      ]);
      return { expertAnalysis: result.text };
    },
  });

  // Paso condicional para la carta de presentación (solo si reportType es "vacancy")
  const coverLetterStep = new Step({
    id: "coverLetterStep",
    execute: async ({ context }) => {
      if (context.triggerData.reportType !== "vacancy") {
        return { coverLetter: "" };
      }

      const result = await redactorAgent.generate([
        {
          role: "system",
          content: `
  
          Create a personalized, compelling cover letter for this candidate that highlights their relevant experience, skills, and motivation for the position.`,
        },
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
      ]);
      return { coverLetter: result.text };
    },
  });

  const integrationStep = new Step({
    id: "integrationStep",
    execute: async ({ context }) => {
      const talentAnalysis =
        context.getStepResult<{ talentAnalysis: string }>("talentAnalysisStep")
          ?.talentAnalysis || "";
      const expertAnalysis =
        context.getStepResult<{ expertAnalysis: string }>("expertAnalysisStep")
          ?.expertAnalysis || "";
      const coverLetter =
        context.getStepResult<{ coverLetter: string }>("coverLetterStep")
          ?.coverLetter || "";

      const integrationPrompt = `
        ${context.triggerData.systemPrompt}

        Based on the following analyses, create a final comprehensive report in the required JSON format:

        Talent Analysis:
        ${talentAnalysis}

        Expert Field Analysis:
        ${expertAnalysis}

        ${coverLetter ? `Cover Letter:\n${coverLetter}` : ""}

        Ensure you to make use of your tool of the added tools to generate the final output in the format of the schema and a structured output.
      `;

      const result = await integratorAgent.generate(integrationPrompt, {
        output:
          reportType === "curriculum"
            ? CurriculumReportSchema
            : VacancyReportSchema,
      });

      return { finalReport: result };
    },
  });

  // Configurar el flujo de trabajo
  reportWorkflow
    .step(talentAnalysisStep)
    .step(expertAnalysisStep)
    .step(coverLetterStep)
    .after([talentAnalysisStep, expertAnalysisStep, coverLetterStep])
    .step(integrationStep)
    .commit();

  // Ejecutar el workflow
  const { start } = reportWorkflow.createRun();

  const result = await start({
    triggerData: {
      language,
      text,
      files,
      reportType,
      systemPrompt,
      userPrompt,
    },
  });

  // Obtener el resultado del paso de integración
  const integrationResult = result.results.integrationStep;

  console.log("result.results", result.results);

  // Verificar si el paso de integración fue exitoso y contiene la propiedad finalReport
  if (
    integrationResult &&
    "output" in integrationResult &&
    "finalReport" in integrationResult.output &&
    "object" in integrationResult.output.finalReport &&
    "documents" in integrationResult.output.finalReport.object
  ) {
    return integrationResult.output.finalReport.object;
  } else {
    throw new Error("Workflow execution failed");
  }
};
