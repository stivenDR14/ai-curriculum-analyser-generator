"use client";

import styles from "./page.module.css";
import Button from "@/components/Button";
import VacancyUploadExtractor from "@/components/Extractor/VacancyUploadExtractor";
import { MAX_CHARACTERS } from "@/utils/constants-all";
import {
  landingPageCurriculumLabels,
  landingPageHiringLabels,
  loaderMessages,
  resourcesLabels,
} from "@/utils/labels";
import CurriculumUploadExtractor from "@/components/Extractor/CurriculumUploadExtractor";
import { UseHandleUploadFiles } from "@/hooks/use-handle-upload-files.hook";
import Loader from "@/components/Loader";

export default function Resources() {
  const {
    router,
    isRecruiter,
    uploadedFiles,
    disableSelectFile,
    setUploadedFiles,
    recruiterText,
    cvText,
    isLoading,
    handleAnalyze,
    handleTextChange,
    handleSelectFile,
  } = UseHandleUploadFiles(false);

  const handleReset = () => {
    if (isRecruiter) {
      router.push("/vacancy");
    } else {
      router.push("/curriculum-analisys");
    }
  };

  if (isLoading) {
    return (
      <Loader
        messages={[
          loaderMessages.sendingResources,
          loaderMessages.extractingInformation,
          loaderMessages.abstractingInformation,
          loaderMessages.somethingGreat,
          loaderMessages.moreTime,
        ]}
        interval={isRecruiter ? 3000 : 5000}
      />
    );
  }
  return (
    <main className={styles.container}>
      {!isRecruiter ? (
        <VacancyUploadExtractor
          title={resourcesLabels.titleCandidate}
          subtitle={resourcesLabels.subtitleCandidate}
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
          analyzeButtonText={resourcesLabels.continueButtonTextCandidate}
          switchText={""}
          onSwitch={() => {}}
        />
      ) : (
        <CurriculumUploadExtractor
          title={resourcesLabels.titleRecruiter}
          subtitle={resourcesLabels.subtitleRecruiter}
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
          analyzeButtonText={resourcesLabels.continueButtonTextRecruiter}
          switchText={""}
          onSwitch={() => {}}
        />
      )}

      <div className={styles.actionContainer}>
        <Button variant="switch" onClick={handleReset}>
          {isRecruiter
            ? resourcesLabels.rejectAndUploadOtherRecruiter
            : resourcesLabels.rejectAndUploadOtherCandidate}
        </Button>
      </div>
    </main>
  );
}
