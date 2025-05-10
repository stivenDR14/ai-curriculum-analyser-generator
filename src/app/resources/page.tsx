"use client";

import styles from "./page.module.css";
import Button from "@/components/Button";
import { Title } from "@/components/Typography";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import CardSection from "@/components/CardSection/CardSection";
import { useResumeStore } from "@/hooks/useResumeStore";
import VacancyUploadExtractor from "@/components/Extractor/VacancyUploadExtractor";
import CurriculumUploadExtractor from "@/components/Extractor/CurriculumUploadExtractor";
import { MAX_CHARACTERS } from "@/utils/constants-all";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
} from "@/utils/labels";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Resources() {
  const vacancyData = useResumeStore((state) => state.vacancyData);
  const isRecruiter = useSettingsStore((state) => state.isRecruiter);
  const loadVacancyFromStorage = useResumeStore(
    (state) => state.loadVacancyFromStorage
  );
  const clearVacancyData = useResumeStore((state) => state.clearVacancyData);
  const router = useRouter();

  useEffect(() => {
    if (!vacancyData) {
      loadVacancyFromStorage();
    }
  }, []);

  const handleReset = () => {
    if (isRecruiter) {
      router.push("/");
      clearVacancyData();
      localStorage.removeItem("vacancyData");
    } else {
      router.push("/curriculum-analisys");
    }
  };

  return (
    <main className={styles.container}>
      {!isRecruiter && (
        <Title centered>{`La vacante extraida es la siguiente`}</Title>
      )}

      {isRecruiter && (
        <CardSection
          title={"Your vacancy"}
          content={vacancyData}
          icon="📝"
          handleEdit={() => {}}
        />
      )}

      {!isRecruiter ? (
        <VacancyUploadExtractor
          title={""}
          subtitle={
            "En el campo a continuación, puedes incluir la descripción de la vacante, ya sea ingresando el texto, o archivos PDF que contengan información de la empresa, la descripcion del trabajo o incluso unviersidad y la vacante de grado"
          }
          uploadedFiles={[]}
          setUploadedFiles={() => {}}
          recruiterText={""}
          onRecruiterTextChange={(e) => {}}
          maxCharacters={MAX_CHARACTERS}
          handleAnalyze={() => {}}
          handleSelectFile={() => {}}
          disableSelectFile={false}
          dragText={landingPageCurriculumLabels.dragText}
          selectText={landingPageCurriculumLabels.selectText}
          selectFromText={landingPageCurriculumLabels.selectFromText}
          placeholderText={landingPageHiringLabels.placeholderText}
          analyzeButtonText={landingPageHiringLabels.analyzeButtonText}
          switchText={""}
          onSwitch={() => {}}
        />
      ) : (
        <CurriculumUploadExtractor
          title={"Incluye la hoja de vida del candidato"}
          subtitle={
            "En el campo a continuación, puedes incluir la hoja de vida del candidato, ya sea ingresando el texto, o archivos PDF que contengan información de la persona"
          }
          uploadedFiles={[]}
          setUploadedFiles={() => {}}
          cvText={""}
          onCvTextChange={(e) => {}}
          maxCharacters={MAX_CHARACTERS}
          handleAnalyze={() => {}}
          handleSelectFile={() => {}}
          disableSelectFile={false}
          dragText={landingPageCurriculumLabels.dragText}
          selectText={landingPageCurriculumLabels.selectText}
          selectFromText={landingPageCurriculumLabels.selectFromText}
          uploadInfo={landingPageCurriculumLabels.uploadInfo}
          analyzeButtonText={landingPageCurriculumLabels.analyzeButtonText}
          switchText={""}
          onSwitch={() => {}}
        />
      )}

      <div className={styles.actionContainer}>
        <Button variant="switch" onClick={handleReset}>
          {isRecruiter
            ? "Rechazar y subir otra vacante"
            : "Volver a revisar el CV"}
        </Button>
      </div>
    </main>
  );
}
