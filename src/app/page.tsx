"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
  loaderMessages,
} from "@/utils/labels";
import Loader from "@/components/Loader";
import CurriculumUploadExtractor from "@/components/Extractor/CurriculumUploadExtractor";
import VacancyUploadExtractor from "@/components/Extractor/VacancyUploadExtractor";
import { useSettingsStore } from "@/hooks/use-settingsStore";
import { MAX_CHARACTERS } from "@/utils/constants-all";
import { UseHandleUploadFiles } from "@/hooks/use-handle-upload-files.hook";
export default function Home() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRecruiter, setShowRecruiter] = useState(false);
  const setSettingData = useSettingsStore((state) => state.setIsRecruiter);
  const {
    isRecruiter,
    setIsRecruiter,
    uploadedFiles,
    disableSelectFile,
    setUploadedFiles,
    recruiterText,
    cvText,
    isLoading,
    handleAnalyze,
    handleTextChange,
    handleSelectFile,
  } = UseHandleUploadFiles(true);

  useEffect(() => {
    if (!isAnimating) {
      setShowRecruiter(isRecruiter);
    }
  }, [isAnimating, isRecruiter]);

  const toggleView = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsRecruiter(!isRecruiter);
      setSettingData(!isRecruiter);
      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 800);
  };

  const recruiterClasses = `${styles.landingPage} ${
    !isAnimating && showRecruiter
      ? styles.landingPageEnter
      : styles.landingPageExit
  }`;
  const cvClasses = `${styles.landingPage} ${
    !isAnimating && !showRecruiter
      ? styles.landingPageEnter
      : styles.landingPageExit
  }`;

  if (isLoading) {
    return (
      <Loader
        messages={[
          loaderMessages.sendingResources,
          loaderMessages.extractingInformation,
          isRecruiter
            ? loaderMessages.abstractingInformation
            : loaderMessages.generatingSections,
          loaderMessages.somethingGreat,
          loaderMessages.moreTime,
        ]}
        interval={isRecruiter ? 3000 : 5000}
      />
    );
  }

  return (
    <main className={styles.mainContent}>
      <div className={recruiterClasses}>
        <VacancyUploadExtractor
          title={landingPageHiringLabels.title}
          subtitle={landingPageHiringLabels.subtitle}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          recruiterText={recruiterText}
          onRecruiterTextChange={(e) => handleTextChange(e, true)}
          maxCharacters={MAX_CHARACTERS}
          handleAnalyze={() => handleAnalyze("vacancy")}
          handleSelectFile={handleSelectFile}
          disableSelectFile={disableSelectFile}
          dragText={landingPageCurriculumLabels.dragText}
          selectText={landingPageCurriculumLabels.selectText}
          selectFromText={landingPageCurriculumLabels.selectFromText}
          placeholderText={landingPageHiringLabels.placeholderText}
          analyzeButtonText={landingPageHiringLabels.analyzeButtonText}
          switchText={landingPageHiringLabels.switchText}
          onSwitch={toggleView}
        />
      </div>
      <div className={cvClasses}>
        <CurriculumUploadExtractor
          title={landingPageCurriculumLabels.title}
          subtitle={landingPageCurriculumLabels.subtitle}
          uploadedFiles={uploadedFiles}
          setUploadedFiles={setUploadedFiles}
          cvText={cvText}
          onCvTextChange={(e) => handleTextChange(e, false)}
          maxCharacters={MAX_CHARACTERS}
          handleAnalyze={() => handleAnalyze("curriculum")}
          handleSelectFile={handleSelectFile}
          disableSelectFile={disableSelectFile}
          dragText={landingPageCurriculumLabels.dragText}
          selectText={landingPageCurriculumLabels.selectText}
          selectFromText={landingPageCurriculumLabels.selectFromText}
          uploadInfo={landingPageCurriculumLabels.uploadInfo}
          analyzeButtonText={landingPageCurriculumLabels.analyzeButtonText}
          switchText={landingPageCurriculumLabels.switchText}
          onSwitch={toggleView}
        />
      </div>
    </main>
  );
}
