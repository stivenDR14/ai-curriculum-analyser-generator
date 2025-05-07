"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
} from "@/utils/labels";

export default function Home() {
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRecruiter, setShowRecruiter] = useState(false);

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

  return (
    <main className={styles.mainContent}>
      {/* Vista de reclutador - siempre presente pero controlada por CSS */}
      <div className={recruiterClasses}>
        <h1 className={styles.title}>{landingPageHiringLabels.title}</h1>
        <p className={styles.subtitle}>{landingPageHiringLabels.subtitle}</p>

        <div className={styles.uploadArea}>
          <textarea
            className={styles.vacancyTextarea}
            placeholder={landingPageHiringLabels.placeholderText}
          ></textarea>
          <p className={styles.uploadOption}>
            {landingPageHiringLabels.uploadPdfText}
          </p>
        </div>

        <button className={styles.analyzeButton}>
          {landingPageHiringLabels.analyzeButtonText}
        </button>

        <button onClick={toggleView} className={styles.switchButton}>
          {landingPageHiringLabels.switchText}
        </button>
      </div>

      {/* Vista de candidato - siempre presente pero controlada por CSS */}
      <div className={cvClasses}>
        <h1 className={styles.title}>{landingPageCurriculumLabels.title}</h1>
        <p className={styles.subtitle}>
          {landingPageCurriculumLabels.subtitle}
        </p>

        <div className={styles.uploadArea}>
          <p className={styles.dragText}>
            {landingPageCurriculumLabels.dragText}
            <span className={styles.selectText}>
              {landingPageCurriculumLabels.selectText}
            </span>
            {landingPageCurriculumLabels.selectFromText}
          </p>
          <p className={styles.uploadInfo}>
            {landingPageCurriculumLabels.uploadInfo}
          </p>
        </div>

        <button className={styles.analyzeButton}>
          {landingPageCurriculumLabels.analyzeButtonText}
        </button>

        <button onClick={toggleView} className={styles.switchButton}>
          {landingPageCurriculumLabels.switchText}
        </button>
      </div>
    </main>
  );
}
