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
import {
  PROMPT_RESUME_REWRITE,
  PROMPT_VACANCY_REWRITE,
} from "@/utils/constants-server";

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

    const language = "spanish";

    const input: ConverseCommandInput = {
      modelId: "amazon.nova-pro-v1:0",
      messages: [
        {
          role: ConversationRole.USER,
          content: [
            {
              text:
                type === "vacancy"
                  ? `
                Now, take the the information that is added below and rewrite it using the structure and best practices above:
                
                ${
                  text
                    ? `
                *Text resources*
                ${text} 
                -----
                `
                    : ""
                }

                ${
                  files.length > 0
                    ? `
                *Files resources*
                ${files.map((file) => file.name).join("\n")}
                -----
                `
                    : ""
                }

                
                please provide the response in the following JSON format:
                {
                  "vacancy": "string",
                  "suggestions": "string",
                  "error": "string"
                }

                the whole text must be written in ${language}.

                `
                  : `
                       
                Now, take the resume, descriptions, resources and all the information that you have below and rewrite it using the structure and best practices above:

                ${
                  text
                    ? `
                There are the resources that you have to take into account:
                
                ${
                  text !== ""
                    ? `*Text resources*
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
                *Files resources*
                **Take the added Files into account and use them to improve the resume, extracting all the information you can and reordering the sections to make it more readable and ATS friendly.**
                -----
                      `
                    : ""
                }

                Please provide the response in the following JSON format:
                {
                  "resume": {
                    "title": "string",
                    "contactInformation": "string",
                    "professionalSummary": "string",
                    "skills": "string",
                    "workExperience": "string",
                    "projects": "string",
                    "education": "string",
                    "certifications": "string"
                  },
                  "suggestions": "string",
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
          text:
            type === "vacancy"
              ? await PROMPT_VACANCY_REWRITE(language)
              : await PROMPT_RESUME_REWRITE(language),
        },
      ],
      inferenceConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxTokens: 3000,
      },
    };

    const command = new ConverseCommand(input);
    const response = await client.send(command);

    console.log(
      "Response:",
      response,
      response.output?.message?.content?.map((block) => block.text)
    );

    // Extraer el texto de la respuesta
    const responseText = response.output?.message?.content?.[0]?.text || "";

    // Intentar extraer el JSON de la respuesta
    let jsonResponse;
    try {
      // Buscar el contenido JSON entre los marcadores de código
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/```\n([\s\S]*?)\n```/) ||
        responseText.match(/{[\s\S]*?}/);
      const jsonMatchAux = (jsonMatch?.[1] || jsonMatch?.[0])
        ?.replace(/[\[\]]/g, "_")
        // Escapa los saltos de línea dentro de los valores de string
        .replace(/:\s*"(.*?)"/g, (match, p1) => {
          // Escapa los saltos de línea y comillas dentro del valor
          const escaped = p1.replace(/\n/g, "\\n").replace(/"/g, '\\"');
          return `: "${escaped}"`;
        });
      console.log("jsonMatchAux", jsonMatchAux);
      if (jsonMatchAux) {
        jsonResponse = JSON.parse(jsonMatchAux);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return NextResponse.json(
        {
          success: false,
          message: backendErrorsLabels.errorProcessingCurriculum,
          error: "Invalid JSON response from model",
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

/* try {
      // Buscar el contenido JSON entre los marcadores de código
      const jsonMatch =
        responseText.match(/```json\n([\s\S]*?)\n```/) ||
        responseText.match(/```\n([\s\S]*?)\n```/) ||
        responseText.match(/{[\s\S]*?}/);

      let jsonString = jsonMatch?.[1] || jsonMatch?.[0];

      if (jsonString) {
        // Limpieza básica: eliminar caracteres problemáticos
        jsonString = jsonString.replace(/[\u0000-\u0019]/g, ""); // Eliminar caracteres de control

        // Intentar parsear el JSON limpio usando múltiples métodos
        try {
          // Método 1: Parseo directo
          jsonResponse = JSON.parse(jsonString);
        } catch (error) {
          console.error("Standard JSON parse failed:", error);

          try {
            // Método 2: Extraer y construir el objeto manualmente
            if (type === "vacancy") {
              // Extraer todo el contenido entre comillas después de "vacancy": hasta la siguiente comilla
              const vacancyMatch = responseText.match(
                /"vacancy"\s*:\s*"([^]*?)"\s*,?\s*"error"/
              );
              if (vacancyMatch && vacancyMatch[1]) {
                jsonResponse = {
                  vacancy: vacancyMatch[1]
                    .replace(/\\n/g, "\n")
                    .replace(/\\"/g, '"'),
                  error: "",
                } as VacancyResponse;
              } else {
                // Fallback: crear un objeto con el texto completo
                jsonResponse = {
                  vacancy: responseText,
                  error: "",
                } as VacancyResponse;
              }
            } else {
              // Para currículum, crear un objeto básico
              const resumeResponse: ResumeResponse = {
                resume: {
                  title: "",
                  contactInformation: "",
                  professionalSummary: "",
                  skills: "",
                  workExperience: "",
                  projects: "",
                  education: "",
                  certifications: "",
                },
                error: "",
              };

              jsonResponse = resumeResponse;

              // Intentar extraer cada sección del texto
              try {
                const resumeText = responseText.substring(
                  responseText.indexOf('"resume"'),
                  responseText.lastIndexOf("}")
                );

                const sectionNames = [
                  "title",
                  "contactInformation",
                  "professionalSummary",
                  "skills",
                  "workExperience",
                  "projects",
                  "education",
                  "certifications",
                ] as const;

                sectionNames.forEach((section) => {
                  const regex = new RegExp(
                    `"${section}"\\s*:\\s*"([^]*?)(?:"\\s*,|"\\s*})`,
                    "i"
                  );
                  const match = resumeText.match(regex);

                  if (match && match[1] && isResumeResponse(jsonResponse)) {
                    jsonResponse.resume[
                      section as keyof typeof jsonResponse.resume
                    ] = match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
                  }
                });
              } catch (extractError) {
                console.error("Section extraction failed:", extractError);
              }
            }
          } catch (fallbackError) {
            console.error("All parsing methods failed:", fallbackError);
            throw new Error(
              "Failed to parse JSON response after multiple attempts"
            );
          }
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      return NextResponse.json(
        {
          success: false,
          message: backendErrorsLabels.errorProcessingCurriculum,
          error: "Invalid JSON response from model",
        },
        { status: 500 }
      );
    } */
