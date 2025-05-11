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
import { useEditContent } from "@/hooks/use-edit-content.hook";

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
  const { clearEditedContent } = useEditContent();

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
    clearEditedContent();
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
          id="title"
        />

        <CardSection
          title={curriculumAnalisysLabels.contactInformation}
          content={resumeData.contactInformation}
          icon="📞"
          id="contactInformation"
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalSummary}
          content={resumeData.professionalSummary}
          icon="📑"
          id="professionalSummary"
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalExperience}
          content={resumeData.workExperience}
          icon="💼"
          id="workExperience"
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalProjects}
          content={resumeData.projects}
          icon="🖇️"
          id="projects"
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalEducation}
          content={resumeData.education}
          icon="🎓"
          id="education"
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalSkills}
          content={resumeData.skills}
          icon="💪"
          id="skills"
        />

        <CardSection
          title={curriculumAnalisysLabels.professionalCertifications}
          content={resumeData.certifications}
          icon="🏆"
          id="certifications"
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
