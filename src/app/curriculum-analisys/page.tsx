"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Title, Description } from "@/components/Typography";
import { curriculumAnalisysLabels } from "@/utils/labels";
import { useRouter } from "next/navigation";
import { RESUME_DATA_KEY } from "@/utils/constants-all";
import { IResume } from "@/models/resume";
import CardSection from "@/components/CardSection/CardSection";
export default function CurriculumAnalisys() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const resumeData: IResume = useMemo(() => {
    return JSON.parse(localStorage.getItem(RESUME_DATA_KEY) || "{}") as IResume;
  }, []);

  const handleContinue = () => {
    setIsLoading(true);
  };

  const handleReset = () => {
    router.push("/");
    //delete from the local storage the resume data
    localStorage.removeItem(RESUME_DATA_KEY);
  };

  if (isLoading) {
    return (
      <Loader
        messages={[
          "📤 Enviando los recursos 📤",
          "🔍 Extrayendo información de los recursos 🔍",
          "📝 Generando secciones optimas 📝",
          "✨ ¡Algo genial esta por generarse! ✨",
          "⏳ Un poco más para tener lista la abstracción... ⏳",
        ]}
        interval={3000}
      />
    );
  }

  return (
    <main className={styles.container}>
      <Title centered>
        ¡Bien!, hemos terminado de analizar y extraer tu información
      </Title>

      <Description centered>
        Hemos logrado un 95% de precisión en la extracción. Hemos generado las
        siguientes secciones
      </Description>

      <article>
        <CardSection
          title={curriculumAnalisysLabels.professionalTitle}
          content={resumeData.title}
          icon="📝"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.contactInformation}
          content={resumeData.contactInformation}
          icon="📞"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalSummary}
          content={resumeData.professionalSummary}
          icon="📑"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalExperience}
          content={resumeData.workExperience}
          icon="💼"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalProjects}
          content={resumeData.projects}
          icon="🖇️"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalEducation}
          content={resumeData.education}
          icon="🎓"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalSkills}
          content={resumeData.skills}
          icon="💪"
          handleEdit={() => {}}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalCertifications}
          content={resumeData.certifications}
          icon="🏆"
          handleEdit={() => {}}
        />
        <div className={styles.actionContainer}>
          <Button onClick={handleContinue} variant="primary">
            {curriculumAnalisysLabels.continueButtonText}
          </Button>
        </div>

        <div className={styles.actionContainer}>
          <Button onClick={handleReset} variant="switch">
            {curriculumAnalisysLabels.rejectAndUploadOther}
          </Button>
        </div>
      </article>
    </main>
  );
}
