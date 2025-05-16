import { MAX_FILES, MAX_MG_ALLOWED } from "./constants-all";

export const landingPageCurriculumLabels = {
  title:
    "Transform your resume into your best tool with the help of artificial intelligence.",
  subtitle:
    "Save time customizing your CV, your cover letter, and prepare for each job opportunity.",
  dragText: `You can also drag up to ${MAX_FILES} PDF files or`,
  selectText: " select ",
  selectFromText: "from your files",
  uploadInfo:
    "Upload your resume text or copy and paste the text here. Make sure it's up to date.",
  analyzeButtonText: "Analyze CV",
  switchText: "I'm a recruiter",
};

export const landingPageHiringLabels = {
  title: "Job Vacancy Information",
  subtitle:
    "Load the information of the vacancy for which you are looking for talent. Make sure it's as complete as possible",
  placeholderText:
    "Remember to add company, role, description, salary range, etc.",
  analyzeButtonText: "Analyze Vacancy",
  switchText: "I want to optimize my CV",
};

export const ariaLabels = {
  removeFile: "Remove file",
};

export const loaderMessages = {
  sendingResources: "📤 Sending resources 📤",
  extractingInformation: "🔍 Extracting information from resources 🔍",
  abstractingInformation: "🧠 Abstracting and generating information 🧠",
  generatingSections: "📝 Generating optimal sections 📝",
  somethingGreat: "✨ Something great is about to be generated! ✨",
  moreTime: "⏳ A little more time to prepare the abstraction... ⏳",
};

export const frontendErrorsLabels = {
  errorProcessing: "Error processing request",
  maximumFiles: `You can only upload up to ${MAX_FILES} files`,
  noFilesSelected: "Please select at least one file or enter the resource text",
  uploadError: "Error uploading files",
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
  continueButtonText: "Continue to extract vacancy information",
  rejectAndUploadOther: "Reject and upload another CV",
  professionalTitle: "Suggested professional title",
  contactInformation: "Contact information",
  professionalSummary: "Professional summary",
  professionalExperience: "Professional experience",
  professionalProjects: "Projects and achievements",
  professionalEducation: "Education",
  professionalSkills: "Skills",
  professionalCertifications: "Certifications",
  suggestions: "Suggestions",
  analysisSuccess:
    "Great! We have finished analyzing and extracting your information",
  analysisSuccessDescription:
    "We have achieved 95% accuracy in extraction. We have generated the following sections",
  downloadPDF: "Download PDF",
};

export const vacancyLabels = {
  continueButtonText: "Continue to extract candidate information",
  rejectAndUploadOther: "Reject and upload another vacancy",
  title: "The extracted vacancy is as follows",
  suggestionTitle: "Suggestions",
  vacancyTitle: "Your vacancy",
  loaderMessages: ["Loading"],
};

export const resourcesLabels = {
  titleRecruiter: "Include the candidate's resume",
  subtitleRecruiter:
    "In the field below, you can include the candidate's resume, either by entering the text, or PDF files containing information about the person",
  uploadInfoRecruiter:
    "Upload your resume text or copy and paste the text here. Make sure it's up to date.",
  continueButtonTextRecruiter: "Continue and generate report",
  rejectAndUploadOtherRecruiter: "Go back to review the vacancy",
  titleCandidate: "What do you want to apply for?",
  subtitleCandidate:
    "In the field below, you can include the description of the vacancy, either by entering the text, or PDF files containing information about the company, the job description or even university and degree vacancy",
  continueButtonTextCandidate: "Continue and generate report and documents",
  rejectAndUploadOtherCandidate: "Go back to review the resume",
};

export const stepperLabels = {
  step11: "Resume",
  step12: "Vacancy",
  step13: "Documents",
  step21: "Vacancy",
  step22: "Candidates",
  step23: "Report",
};

export const reportLabels = {
  goodReport: "Great 🔝!",
  regularReport: "There are aspects to improve 🤔",
  badReport: "Well 🚨",
  youHaveReport: ", There is a ",
  compatibilityReport: "% compatibility with the vacancy",
  generateDocuments: "Generate documents and apply",
  compatibility: "Compatible",
  coverLetter: "Cover letter",
  curriculum: "Curriculum",
  downloadDocuments: "Download",
  downloadPDF: "Download PDF",
  backToResources: "Go back and delete this report",
  compatibilityReportTitle: "Compatibility report",
};
