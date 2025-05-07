"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
} from "@/utils/labels";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Title, Subtitle } from "@/components/Typography";
import UploadArea, {
  UploadText,
  SelectText,
  UploadInfo,
} from "@/components/UploadArea";

export default function Home() {
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      setShowRecruiter(isRecruiter);
    }
  }, [isAnimating, isRecruiter]);

  const toggleView = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsRecruiter(!isRecruiter);

      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 800);
  };

  const handleAnalyze = () => {
    setIsLoading(true);
  };

  // Clases para ambas vistas
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
        destination={isRecruiter ? "/resources" : "/curriculum-analisys"}
      />
    );
  }

  return (
    <main className={styles.mainContent}>
      {/* Vista de reclutador - siempre presente pero controlada por CSS */}
      <div className={recruiterClasses}>
        <Title>{landingPageHiringLabels.title}</Title>
        <Subtitle>{landingPageHiringLabels.subtitle}</Subtitle>

        <UploadArea>
          <textarea
            className={styles.vacancyTextarea}
            placeholder={landingPageHiringLabels.placeholderText}
          ></textarea>
          <UploadInfo>{landingPageHiringLabels.uploadPdfText}</UploadInfo>
        </UploadArea>

        <Button onClick={handleAnalyze} variant="primary">
          {landingPageHiringLabels.analyzeButtonText}
        </Button>

        <Button onClick={toggleView} variant="switch">
          {landingPageHiringLabels.switchText}
        </Button>
      </div>

      {/* Vista de candidato - siempre presente pero controlada por CSS */}
      <div className={cvClasses}>
        <Title>{landingPageCurriculumLabels.title}</Title>
        <Subtitle>{landingPageCurriculumLabels.subtitle}</Subtitle>

        <UploadArea>
          <UploadText>
            {landingPageCurriculumLabels.dragText}
            <SelectText>{landingPageCurriculumLabels.selectText}</SelectText>
            {landingPageCurriculumLabels.selectFromText}
          </UploadText>
          <UploadInfo>{landingPageCurriculumLabels.uploadInfo}</UploadInfo>
        </UploadArea>

        <Button onClick={handleAnalyze} variant="primary">
          {landingPageCurriculumLabels.analyzeButtonText}
        </Button>

        <Button onClick={toggleView} variant="switch">
          {landingPageCurriculumLabels.switchText}
        </Button>
      </div>
    </main>
  );
}
