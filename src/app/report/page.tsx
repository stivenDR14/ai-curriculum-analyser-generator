"use client";

import Loader from "@/components/Loader";
import { useReportDocuments } from "@/hooks/use-report-documents.hook";
import { Title, Description } from "@/components/Typography";
import CardSection from "@/components/CardSection/CardSection";
import { reportLabels, vacancyLabels } from "@/utils/labels";
import { useMemo } from "react";
import styles from "./page.module.css";
import Button from "@/components/Button";

export default function Report() {
  const { router, resumeData, documents, isRecruiter, clearDocuments } =
    useReportDocuments();

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
    router.push("/resources");
  };

  if (!documents) {
    return <Loader messages={vacancyLabels.loaderMessages} />;
  }

  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <Title centered>
        {level}
        {reportLabels.youHaveReport}
        {documents.percentage}
        {reportLabels.compatibilityReport}
      </Title>
      <Description centered>{documents.summary}</Description>
      {documents.report && (
        <CardSection
          title={""}
          content={documents.report}
          icon=""
          handleEdit={() => {}}
        />
      )}
      {!isRecruiter && documents.coverLetter && (
        <CardSection
          title={reportLabels.coverLetter}
          content={documents.coverLetter}
          icon="🧠"
          handleEdit={() => {}}
        />
      )}

      {!isRecruiter && resumeData && (
        <CardSection
          title={reportLabels.curriculum}
          content={`# ${resumeData.title}\n## Resumen profesional\n${resumeData.professionalSummary}\n## Información de contacto\n${resumeData.contactInformation}\n## Habilidades\n${resumeData.skills}\n## Experiencia laboral\n${resumeData.workExperience}\n## Proyectos\n${resumeData.projects}\n## Educación\n${resumeData.education}\n## Certificaciones\n${resumeData.certifications}`}
          icon="📝"
          handleEdit={() => {}}
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
