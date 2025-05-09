"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
  frontendErrorsLabels,
  landingPageCurriculumLabels,
  landingPageHiringLabels,
  loaderMessages,
} from "@/utils/labels";
import Loader from "@/components/Loader";
import { MAX_FILES } from "@/utils/constants-all";
import { showToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { useDocuments } from "@/hooks/useDocuments.hook";
import CurriculumUploadExtractor from "@/components/Extractor/CurriculumUploadExtractor";
import VacancyUploadExtractor from "@/components/Extractor/VacancyUploadExtractor";
const MAX_CHARACTERS = 2000;

export default function Home() {
  const router = useRouter();
  const { isRecruiter, setIsRecruiter, saveResumeData } = useDocuments(router);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRecruiter, setShowRecruiter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [disableSelectFile, setDisableSelectFile] = useState(false);
  const [recruiterText, setRecruiterText] = useState("");
  const [cvText, setCvText] = useState("");

  useEffect(() => {
    if (!isAnimating) {
      setShowRecruiter(isRecruiter);
    }
  }, [isAnimating, isRecruiter]);

  useEffect(() => {
    if (uploadedFiles.length < MAX_FILES) {
      setDisableSelectFile(false);
    } else {
      setDisableSelectFile(true);
    }
  }, [uploadedFiles]);

  const toggleView = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsRecruiter(!isRecruiter);

      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }, 800);
  };

  const handleAnalyze = async (type: "curriculum" | "vacancy") => {
    if (
      !uploadedFiles.length &&
      (type === "curriculum" ? cvText === "" : recruiterText === "")
    ) {
      showToast.error(frontendErrorsLabels.noFilesSelected);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("text", type === "curriculum" ? cvText : recruiterText);

    try {
      const response = await fetch(`/api/analyze/${type}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(frontendErrorsLabels.uploadError);
      }

      const data = await response.json();
      saveResumeData(data, isRecruiter);

      router.push(isRecruiter ? "/resources" : "/curriculum-analisys");
    } catch (error: unknown) {
      console.error("Error:", error);
      showToast.error(frontendErrorsLabels.uploadError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    isRecruiter: boolean
  ) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      if (isRecruiter) {
        setRecruiterText(text);
      } else {
        setCvText(text);
      }
    }
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

  const handleSelectFile = () => {
    if (uploadedFiles.length >= MAX_FILES) {
      setDisableSelectFile(true);
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setUploadedFiles((filesaux) => [...filesaux, file]);
      }
    };
    fileInput.click();
  };

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
