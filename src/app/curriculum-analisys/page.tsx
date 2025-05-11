"use client";

import { useEffect } from "react";
import styles from "./page.module.css";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Title, Description } from "@/components/Typography";
import { curriculumAnalisysLabels } from "@/utils/labels";
import { useRouter } from "next/navigation";
import CardSection from "@/components/CardSection/CardSection";
import { useResumeStore } from "@/hooks/use-resumeStore";

export default function CurriculumAnalisys() {
  const router = useRouter();
  const resumeData = useResumeStore((state) => state.resumeData);
  const loadResumeFromStorage = useResumeStore(
    (state) => state.loadResumeFromStorage
  );
  const clearResumeData = useResumeStore((state) => state.clearResumeData);
  const suggestions = useResumeStore((state) => state.suggestions);
  const clearSuggestions = useResumeStore((state) => state.clearSuggestions);
  const loadSuggestionsFromStorage = useResumeStore(
    (state) => state.loadSuggestionsFromStorage
  );

  useEffect(() => {
    if (!resumeData) {
      loadResumeFromStorage();
    }
  }, []);

  useEffect(() => {
    if (!suggestions) {
      loadSuggestionsFromStorage();
    }
  }, []);

  const handleContinue = () => {
    router.push("/resources");
  };

  const handleReset = () => {
    router.push("/");
    clearResumeData();
    clearSuggestions();
  };

  if (!resumeData) {
    return (
      <main className={styles.container}>
        <Loader messages={["Cargando"]} />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Title centered>{curriculumAnalisysLabels.analysisSuccess}</Title>

      <Description centered>
        {curriculumAnalisysLabels.analysisSuccessDescription}
      </Description>

      <article>
        <CardSection
          title={curriculumAnalisysLabels.suggestions}
          content={suggestions}
          isSuggestion
          icon="💡"
        />
        <CardSection
          title={curriculumAnalisysLabels.professionalTitle}
          content={resumeData.title}
          icon="📝"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.contactInformation}
          content={resumeData.contactInformation}
          icon="📞"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalSummary}
          content={resumeData.professionalSummary}
          icon="📑"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalExperience}
          content={resumeData.workExperience}
          icon="💼"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalProjects}
          content={resumeData.projects}
          icon="🖇️"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalEducation}
          content={resumeData.education}
          icon="🎓"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalSkills}
          content={resumeData.skills}
          icon="💪"
          showGeneratePDF={false}
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalCertifications}
          content={resumeData.certifications}
          icon="🏆"
          showGeneratePDF={false}
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
