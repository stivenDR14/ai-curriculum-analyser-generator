"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Resources() {
  const [jobDescription, setJobDescription] = useState("");

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
  };

  const handleAnalyzeJob = () => {
    // En una implementación real, aquí procesaríamos la información
    alert("Analizando vacante...");
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.mainTitle}>¿A qué te quieres postular?</h1>

      <p className={styles.description}>
        En el campo a continuación agrega la URL donde está el vacante, o pega
        el texto de la página que la contiene.
      </p>

      <div className={styles.inputContainer}>
        <textarea
          className={styles.jobTextArea}
          value={jobDescription}
          onChange={handleJobDescriptionChange}
          placeholder="Ej: We are Foolproof, a product design specialist working closely with Indigo Slate..."
        />

        <div className={styles.fileUploadContainer}>
          <button className={styles.fileUploadButton}>
            O selecciona un PDF desde tus archivos
          </button>
        </div>

        <div className={styles.actionContainer}>
          <button onClick={handleAnalyzeJob} className={styles.analyzeButton}>
            Analizar Vacante
          </button>
        </div>
      </div>

      <div className={styles.navigationContainer}>
        <Link href="/curriculum-analisys" className={styles.backButton}>
          Volver al Currículum
        </Link>
        <Link href="/" className={styles.homeButton}>
          Volver al Inicio
        </Link>
      </div>
    </main>
  );
}
