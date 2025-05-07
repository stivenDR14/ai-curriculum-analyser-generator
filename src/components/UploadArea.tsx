import React from "react";
import styles from "./UploadArea.module.css";

interface UploadAreaProps {
  children: React.ReactNode;
  className?: string;
}

export default function UploadArea({
  children,
  className = "",
}: UploadAreaProps) {
  return <div className={`${styles.uploadArea} ${className}`}>{children}</div>;
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
    <span className={`${styles.selectText} ${className}`} onClick={onClick}>
      {children}
    </span>
  );
}
