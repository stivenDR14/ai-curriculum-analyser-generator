import { MAX_FILES, MAX_MG_ALLOWED } from "./constants-all";

export const landingPageCurriculumLabels = {
  title:
    "Convierte tu hoja de vida en tu mejor herramienta con ayuda de la inteligencia artificial.",
  subtitle:
    "Ahorra tiempo personalizando tu CV, tu carta de presentación y prepárate para cada oferta laboral.",
  dragText: `También puedes arrastrar hasta ${MAX_FILES} archivos en formato PDF o`,
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
  switchText: "Quiero optimizar mi CV",
};

export const ariaLabels = {
  removeFile: "Eliminar archivo",
};

export const loaderMessages = {
  sendingResources: "📤 Enviando los recursos 📤",
  extractingInformation: "🔍 Extrayendo información de los recursos 🔍",
  abstractingInformation: "🧠 Abstrayendo y generando la información 🧠",
  generatingSections: "📝 Generando secciones optimas 📝",
  somethingGreat: "✨ ¡Algo genial esta por generarse! ✨",
  moreTime: "⏳ Un poco más para tener lista la abstracción... ⏳",
};

export const frontendErrorsLabels = {
  errorProcessing: "Error al procesar la solicitud",
  maximumFiles: `Solo puedes subir hasta ${MAX_FILES} archivos`,
  noFilesSelected:
    "Por favor, selecciona al menos un archivo o ingresa el texto del recurso",
  uploadError: "Error al subir los archivos",
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

export const curriculumAnalisysLabels = {
  continueButtonText: "Continuar a extraer la información de la vacante",
  rejectAndUploadOther: "Rechazar y subir otro CV",
  professionalTitle: "Título profesional sugerido",
  contactInformation: "Información de contacto",
  professionalSummary: "Extracto o resumen profesional",
  professionalExperience: "Experiencia profesional",
  professionalProjects: "Proyectos y logros",
  professionalEducation: "Educación",
  professionalSkills: "Habilidades",
  professionalCertifications: "Certificaciones",
  analysisSuccess:
    "¡Bien!, hemos terminado de analizar y extraer tu información",
  analysisSuccessDescription:
    "Hemos logrado un 95% de precisión en la extracción. Hemos generado las siguientes secciones",
};

export const stepperLabels = {
  step11: "Hoja de vida",
  step12: "Vacante",
  step13: "Documentos",
  step21: "Vacante y hoja de vida",
  step22: "Reporte",
};
