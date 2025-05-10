"use client";

import styles from "./page.module.css";
import Button from "@/components/Button";
import { Title } from "@/components/Typography";
import CardSection from "@/components/CardSection/CardSection";
import { useResumeStore } from "@/hooks/use-resumeStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
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
  const router = useRouter();

  useEffect(() => {
    if (!vacancyData) {
      loadVacancyFromStorage();
    }
  }, []);

  useEffect(() => {
    if (!suggestions) {
      loadSuggestionsFromStorage();
    }
  }, []);

  const handleReset = () => {
    router.push("/");
    clearVacancyData();
    clearSuggestions();
  };

  const handleContinue = () => {
    router.push("/resources");
  };

  if (!vacancyData) {
    return (
      <main className={styles.container}>
        <Loader messages={["Cargando"]} />
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Title centered>{`La vacante extraida es la siguiente`}</Title>(
      <div>
        <CardSection
          isSuggestion
          title={"Sugerencias"}
          content={suggestions}
          icon="💡"
          handleEdit={() => {}}
        />
        <CardSection
          title={"Tu vacante"}
          content={vacancyData}
          icon="📝"
          handleEdit={() => {}}
        />
      </div>
      )
      <div className={styles.actionContainer}>
        <Button variant="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
      <div className={styles.actionContainer}>
        <Button variant="switch" onClick={handleReset}>
          {"Rechazar y subir otra vacante"}
        </Button>
      </div>
    </main>
  );
}
