"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Loader from "@/components/Loader";

export default function CurriculumAnalisys() {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
  };

  if (isLoading) {
    return <Loader destination="/resources" />;
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.mainTitle}>
        ¡Bien!, hemos terminado de analizar y extraer tu información
      </h1>

      <p className={styles.description}>
        Hemos logrado un 90% de precisión en la extracción. Hemos generado las
        siguientes secciones
      </p>

      <div className={styles.resultSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>📝</span>
          <h2>Título profesional sugerido</h2>
        </div>
        <div className={styles.sectionContent}>
          <p>
            Senior UX Designer | Consultor en Innovación Digital | Emprendedor
            Creativo
          </p>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Reescribir con IA</button>
            <button className={styles.actionButton}>Editar</button>
          </div>
        </div>
      </div>

      <div className={styles.resultSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>📄</span>
          <h2>Extracto o resumen profesional</h2>
        </div>
        <div className={styles.sectionContent}>
          <p>
            Diseñador de experiencias con más de 15 años de trayectoria creando
            soluciones digitales centradas en las personas y alineadas con
            objetivos de negocio...
          </p>
          <div className={styles.actionButtons}>
            <button className={styles.actionButton}>Reescribir con IA</button>
            <button className={styles.actionButton}>Editar</button>
          </div>
        </div>
      </div>

      <div className={styles.resultSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>💼</span>
          <h2>Experiencia laboral</h2>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.experienceItem}>
            <h3>Fundador & UX Strategist</h3>
            <p>Vittgo.com | 2023 - presente</p>
          </div>
        </div>
      </div>

      <div className={styles.actionContainer}>
        <button onClick={handleContinue} className={styles.continueButton}>
          Guardar y Continuar
        </button>
      </div>
    </main>
  );
}
