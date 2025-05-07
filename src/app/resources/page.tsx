"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Button from "@/components/Button";
import { Title, Description } from "@/components/Typography";

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
      <Title centered>{`¿A qué te quieres postular?`}</Title>

      <Description centered>
        En el campo a continuación agrega la URL donde está el vacante, o pega
        el texto de la página que la contiene.
      </Description>

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
          <Button onClick={handleAnalyzeJob} variant="primary">
            Analizar Vacante
          </Button>
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
