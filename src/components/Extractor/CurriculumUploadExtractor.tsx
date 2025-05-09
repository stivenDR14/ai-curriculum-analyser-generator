import React from "react";
import Button from "@/components/Button";
import UploadArea, { SelectText, UploadInfo } from "@/components/UploadArea";
import { Title, Subtitle } from "@/components/Typography";
import { Dispatch, SetStateAction } from "react";
import styles from "./extractor.module.css";
interface CurriculumUploadExtractorProps {
  title: string;
  subtitle: string;
  uploadedFiles: File[];
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
  cvText: string;
  onCvTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  maxCharacters: number;
  handleAnalyze: () => void;
  handleSelectFile: () => void;
  disableSelectFile: boolean;
  dragText: string;
  selectText: string;
  selectFromText: string;
  uploadInfo: string;
  analyzeButtonText: string;
  switchText: string;
  onSwitch: () => void;
}

const CurriculumUploadExtractor: React.FC<CurriculumUploadExtractorProps> = ({
  title,
  subtitle,
  uploadedFiles,
  setUploadedFiles,
  cvText,
  onCvTextChange,
  maxCharacters,
  handleAnalyze,
  handleSelectFile,
  disableSelectFile,
  dragText,
  selectText,
  selectFromText,
  uploadInfo,
  analyzeButtonText,
  switchText,
  onSwitch,
}) => {
  return (
    <>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <UploadArea
        uploadedFiles={uploadedFiles}
        setUploadedFiles={setUploadedFiles}
      >
        <div className={styles.textAreaContainer}>
          <textarea
            autoFocus
            className={styles.vacancyTextarea}
            placeholder={uploadInfo}
            value={cvText}
            onChange={onCvTextChange}
            maxLength={maxCharacters}
            style={{ width: "100%", minHeight: 150, padding: 8 }}
          ></textarea>
          <div className={styles.characterCount}>
            {cvText.length}/{maxCharacters}
          </div>
        </div>
        <UploadInfo>
          {dragText}
          <SelectText
            onClick={handleSelectFile}
            className={disableSelectFile ? styles.disabled : ""}
          >
            {selectText}
          </SelectText>
          {selectFromText}
        </UploadInfo>
      </UploadArea>
      <Button onClick={handleAnalyze} variant="primary">
        {analyzeButtonText}
      </Button>
      <Button onClick={onSwitch} variant="switch">
        {switchText}
      </Button>
    </>
  );
};

export default CurriculumUploadExtractor;
