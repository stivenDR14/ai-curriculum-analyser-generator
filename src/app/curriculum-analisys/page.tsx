"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Title, Description } from "@/components/Typography";
import { curriculumAnalisysLabels } from "@/utils/labels";
import { useRouter } from "next/navigation";
import CardSection from "@/components/CardSection/CardSection";
import { useResumeStore } from "@/hooks/useResumeStore";

export default function CurriculumAnalisys() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const resumeData = useResumeStore((state) => state.resumeData);
  const loadResumeFromStorage = useResumeStore(
    (state) => state.loadResumeFromStorage
  );
  const clearResumeData = useResumeStore((state) => state.clearResumeData);

  useEffect(() => {
    if (!resumeData) {
      loadResumeFromStorage();
    }
  }, []);

  const handleContinue = () => {
    setIsLoading(true);
  };

  const handleReset = () => {
    router.push("/");
    clearResumeData();
    localStorage.removeItem("resumeData");
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

  if (!resumeData) {
    return (
      <main className={styles.container}>
        <Loader messages={["Cargando"]} />
      </main>
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
