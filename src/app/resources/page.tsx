"use client";

import styles from "./page.module.css";
import Button from "@/components/Button";
import { useSettingsStore } from "@/hooks/use-settingsStore";
import VacancyUploadExtractor from "@/components/Extractor/VacancyUploadExtractor";
import { MAX_CHARACTERS } from "@/utils/constants-all";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
} from "@/utils/labels";
import { useRouter } from "next/navigation";
import CurriculumUploadExtractor from "@/components/Extractor/CurriculumUploadExtractor";
export default function Resources() {
  const isRecruiter = useSettingsStore((state) => state.isRecruiter);

  const router = useRouter();

  const handleReset = () => {
    if (isRecruiter) {
      router.push("/vacancy");
    } else {
      router.push("/curriculum-analisys");
    }
  };

  return (
    <main className={styles.container}>
      {!isRecruiter ? (
        <VacancyUploadExtractor
          title={"¿A qué te quieres postular?"}
          subtitle={
            "En el campo a continuación, puedes incluir la descripción de la vacante, ya sea ingresando el texto, o archivos PDF que contengan información de la empresa, la descripcion del trabajo o incluso unviersidad y la vacante de grado"
          }
          uploadedFiles={[]}
          setUploadedFiles={() => {}}
          recruiterText={""}
          onRecruiterTextChange={() => {}}
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
          onCvTextChange={() => {}}
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

      {isRecruiter && (
        <div className={styles.actionContainer}>
          <Button variant="primary">Continuar</Button>
        </div>
      )}
      <div className={styles.actionContainer}>
        <Button variant="switch" onClick={handleReset}>
          {isRecruiter
            ? "Volver a revisar la vacante"
            : "Volver a revisar el CV"}
        </Button>
      </div>
    </main>
  );
}
