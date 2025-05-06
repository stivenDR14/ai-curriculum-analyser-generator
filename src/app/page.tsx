"use client";

import { useState } from "react";
import styles from "./page.module.css";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
} from "@/utils/labels";

export default function Home() {
  const [isRecruiter, setIsRecruiter] = useState(false);

  const toggleView = () => {
    setIsRecruiter(!isRecruiter);
  };

  return (
    <div className={styles.container}>
      <div className={styles.advertisementColumn}>
        <div className={styles.advertisementSpace}></div>
      </div>

      <main className={styles.mainContent}>
        {isRecruiter ? (
          // Recruiter View
          <div className={styles.landingPage}>
            <h1 className={styles.title}>{landingPageHiringLabels.title}</h1>
            <p className={styles.subtitle}>
              {landingPageHiringLabels.subtitle}
            </p>

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
        ) : (
          // Job Seeker View
          <div className={styles.landingPage}>
            <h1 className={styles.title}>
              {landingPageCurriculumLabels.title}
            </h1>
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
        )}
      </main>

      <div className={styles.advertisementColumn}>
        <div className={styles.advertisementSpace}></div>
      </div>
    </div>
  );
}
