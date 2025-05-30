"use client";

import Loader from "@/components/Loader";
import { useReportDocuments } from "@/hooks/use-report-documents.hook";
import { Title, Description } from "@/components/Typography";
import CardSection from "@/components/CardSection/CardSection";
import { reportLabels, vacancyLabels } from "@/utils/labels";
import { useMemo } from "react";
import styles from "./page.module.css";
import Button from "@/components/Button";
import { useEditContent } from "@/hooks/use-edit-content.hook";
export default function Report() {
  const { router, resumeData, documents, isRecruiter, clearDocuments } =
    useReportDocuments();

  const { clearEditedContent } = useEditContent();

  const level = useMemo(() => {
    if (!documents) return 0;
    return parseInt(documents.percentage) > 70
      ? reportLabels.goodReport
      : parseInt(documents.percentage) > 50
      ? reportLabels.regularReport
      : reportLabels.badReport;
  }, [documents]);

  const handleReset = () => {
    clearDocuments();
    clearEditedContent();
    router.push("/resources");
  };

  if (!documents) {
    return <Loader messages={vacancyLabels.loaderMessages} />;
  }

  return (
    <main className={styles.mainContent}>
      <Title centered>
        {level}
        {reportLabels.youHaveReport}
        {documents.percentage}
        {reportLabels.compatibilityReport}
      </Title>
      <Description centered>{documents.summary}</Description>
      {documents.report && (
        <CardSection
          title={reportLabels.compatibilityReportTitle}
          content={documents.report}
          icon="📊"
          id="report"
        />
      )}
      {!isRecruiter && documents.coverLetter && (
        <CardSection
          title={reportLabels.coverLetter}
          content={documents.coverLetter}
          icon="🧠"
          id="coverLetter"
        />
      )}

      {!isRecruiter && resumeData && (
        <CardSection
          title={reportLabels.curriculum}
          content={`# ${resumeData.title}\n## Resumen profesional\n${resumeData.professionalSummary}\n## Información de contacto\n${resumeData.contactInformation}\n## Habilidades\n${resumeData.skills}\n## Experiencia laboral\n${resumeData.workExperience}\n## Proyectos\n${resumeData.projects}\n## Educación\n${resumeData.education}\n## Certificaciones\n${resumeData.certifications}`}
          icon="📝"
          id="curriculum"
          goToRoute="/curriculum-analisys"
        />
      )}
      <div className={styles.actionContainer}>
        <Button onClick={handleReset} variant="switch">
          {reportLabels.backToResources}
        </Button>
      </div>
    </main>
  );
}
