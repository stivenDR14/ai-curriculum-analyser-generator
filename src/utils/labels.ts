import { MAX_FILES, MAX_MG_ALLOWED } from "./constants";

export const landingPageCurriculumLabels = {
  title:
    "Convierte tu hoja de vida en tu mejor herramienta con ayuda de la inteligencia artificial.",
  subtitle:
    "Ahorra tiempo personalizando tu CV, tu carta de presentación y prepárate para cada oferta laboral.",
  dragText: "También puedes arrastrar un archivo en formato PDF o",
  selectText: " selecciona ",
  selectFromText: "desde tus archivos",
  uploadInfo:
    "Sube el texto de tu hoja de vida o copia y pega el texto aquí. Asegúrate de que esté actualizada.",
  analyzeButtonText: "Analizar CV",
  switchText: "Soy reclutador",
};

export const landingPageHiringLabels = {
  title: "Información de la vacante",
  subtitle:
    "Carga la información de la vacante para la que estás buscando talento. Asegúrate de que esté lo más completa posible",
  placeholderText:
    "Recuerda agregar empresa, rol, descripción, rango salarial, etc",
  analyzeButtonText: "Analizar Vacante",
  switchText: "O, crea tu vacante",
};

export const ariaLabels = {
  removeFile: "Eliminar archivo",
};

export const frontendErrorsLabels = {
  errorProcessing:
    "Error al procesar los datos. Por favor, intente nuevamente.",
  maximumFiles: `Solo puedes subir un máximo de ${MAX_FILES} archivos`,
};

export const backendErrorsLabels = {
  maximumSize: `Total files size is greater than maximum size allowed: ${MAX_MG_ALLOWED}`,
  errorProcessingCurriculum: "Error processing curriculum data",
  errorProcessingVacancy: "Error processing vacancy data",
};

export const backendSuccessLabels = {
  curriculumAnalyzed: "Curriculum data received successfully",
  vacancyAnalyzed: "Vacancy data received successfully",
};
