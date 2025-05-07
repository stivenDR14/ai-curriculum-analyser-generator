import React, {
  useRef,
  useState,
  DragEvent,
  SetStateAction,
  Dispatch,
} from "react";
import styles from "./UploadArea.module.css";
import { ariaLabels, frontendErrorsLabels } from "@/utils/labels";

interface UploadAreaProps {
  children: React.ReactNode;
  className?: string;
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxFiles?: number;
  uploadedFiles: File[];
  setUploadedFiles: Dispatch<SetStateAction<File[]>>;
}

export default function UploadArea({
  children,
  className = "",
  onFileSelect,
  accept = ".pdf",
  maxFiles = 2,
  uploadedFiles,
  setUploadedFiles,
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (uploadedFiles.length >= maxFiles) {
      alert(frontendErrorsLabels.maximumFiles);
      return;
    }

    if (onFileSelect) {
      onFileSelect(file);
    }
    setUploadedFiles((prev) => [...prev, file]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleSelectTextClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.uploadAreaContainer}>
      <div
        className={`${styles.uploadArea} ${className} ${
          isDragging ? styles.dragging : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={accept}
          style={{ display: "none" }}
        />
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectText) {
            return React.cloneElement(
              child as React.ReactElement<SelectTextProps>,
              {
                onClick: handleSelectTextClick,
              }
            );
          }
          return child;
        })}
      </div>

      {uploadedFiles.length > 0 && (
        <div className={styles.uploadedFilesContainer}>
          {uploadedFiles.map((file, index) => (
            <div key={index} className={styles.fileItem}>
              <span className={styles.fileName}>{file.name}</span>
              <button
                className={styles.removeButton}
                onClick={() => handleRemoveFile(index)}
                aria-label={ariaLabels.removeFile}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface UploadInfoProps {
  children: React.ReactNode;
  className?: string;
}

export function UploadInfo({ children, className = "" }: UploadInfoProps) {
  return <p className={`${styles.uploadInfo} ${className}`}>{children}</p>;
}

interface SelectTextProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function SelectText({
  children,
  className = "",
  onClick,
}: SelectTextProps) {
  return (
    <span
      className={`${className === "" ? styles.selectText : className}`}
      onClick={onClick}
    >
      {children}
    </span>
  );
}
