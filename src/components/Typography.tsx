import React from "react";
import styles from "./Typography.module.css";

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function Title({
  children,
  className = "",
  centered = false,
}: TitleProps) {
  return (
    <h1
      className={`${styles.title} ${
        centered ? styles.centered : ""
      } ${className}`}
    >
      {children}
    </h1>
  );
}

interface SubtitleProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function Subtitle({
  children,
  className = "",
  centered = false,
}: SubtitleProps) {
  return (
    <p
      className={`${styles.subtitle} ${
        centered ? styles.centered : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export function SectionTitle({
  children,
  className = "",
  icon,
}: SectionTitleProps) {
  return (
    <div className={styles.sectionHeader}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <h2 className={`${styles.sectionTitle} ${className}`}>{children}</h2>
    </div>
  );
}

interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function Description({
  children,
  className = "",
  centered = false,
}: DescriptionProps) {
  return (
    <p
      className={`${styles.description} ${
        centered ? styles.centered : ""
      } ${className}`}
    >
      {children}
    </p>
  );
}
