"use client";

import styles from "./page.module.css";
import Button from "@/components/Button";
import { Title } from "@/components/Typography";
import CardSection from "@/components/CardSection/CardSection";
import { useResumeStore } from "@/hooks/use-resumeStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { vacancyLabels } from "@/utils/labels";
import { useEditContent } from "@/hooks/use-edit-content.hook";
export default function Vacancy() {
  const vacancyData = useResumeStore((state) => state.vacancyData);
  const loadVacancyFromStorage = useResumeStore(
    (state) => state.loadVacancyFromStorage
  );
  const clearVacancyData = useResumeStore((state) => state.clearVacancyData);
  const suggestions = useResumeStore((state) => state.suggestions);
  const clearSuggestions = useResumeStore((state) => state.clearSuggestions);
  const loadSuggestionsFromStorage = useResumeStore(
    (state) => state.loadSuggestionsFromStorage
  );
  const { clearEditedContent } = useEditContent();
  const router = useRouter();

  useEffect(() => {
    if (!vacancyData) {
      loadVacancyFromStorage();
    }
  }, []);

  useEffect(() => {
    console.log("vacancyData", vacancyData);
  }, [vacancyData]);

  useEffect(() => {
    if (!suggestions) {
      loadSuggestionsFromStorage();
    }
  }, []);

  const handleReset = () => {
    router.push("/");
    clearVacancyData();
    clearSuggestions();
    clearEditedContent();
  };

  const handleContinue = () => {
    router.push("/resources");
  };

  if (!vacancyData) {
    return (
      <main className={styles.container}>
        <Loader messages={vacancyLabels.loaderMessages} />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Title centered>{vacancyLabels.title}</Title>
      <div>
        <CardSection
          isSuggestion
          title={vacancyLabels.suggestionTitle}
          content={suggestions}
          icon="💡"
        />
        <CardSection
          title={vacancyLabels.vacancyTitle}
          content={vacancyData}
          icon="📝"
          id="vacancy"
        />
      </div>

      <div className={styles.actionContainer}>
        <Button variant="primary" onClick={handleContinue}>
          {vacancyLabels.continueButtonText}
        </Button>
      </div>
      <div className={styles.actionContainer}>
        <Button variant="switch" onClick={handleReset}>
          {vacancyLabels.rejectAndUploadOther}
        </Button>
      </div>
    </main>
  );
}
