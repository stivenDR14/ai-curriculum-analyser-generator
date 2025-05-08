"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Loader from "@/components/Loader";
import Button from "@/components/Button";
import { Title, Description, SectionTitle } from "@/components/Typography";

export default function CurriculumAnalisys() {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <Loader
        messages={[
          "📤 Enviando los recursos 📤",
          "🔍 Extrayendo información de los recursos 🔍",
          "📝 Generando secciones optimas 📝",
          "✨ ¡Algo genial esta por generarse! ✨",
          "⏳ Un poco más para tener lista la abstracción... ⏳",
        ]}
        interval={3000}
      />
    );
  }

  return (
    <main className={styles.container}>
      <Title centered>
        ¡Bien!, hemos terminado de analizar y extraer tu información
      </Title>

      <Description centered>
        Hemos logrado un 90% de precisión en la extracción. Hemos generado las
        siguientes secciones
      </Description>

      <div className={styles.resultSection}>
        <SectionTitle icon="📝">Título profesional sugerido</SectionTitle>
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
        <SectionTitle icon="📄">Extracto o resumen profesional</SectionTitle>
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
        <SectionTitle icon="💼">Experiencia laboral</SectionTitle>
        <div className={styles.sectionContent}>
          <div className={styles.experienceItem}>
            <h3>Fundador & UX Strategist</h3>
            <p>Vittgo.com | 2023 - presente</p>
          </div>
        </div>
      </div>

      <div className={styles.actionContainer}>
        <Button onClick={handleContinue} variant="primary">
          Guardar y Continuar
        </Button>
      </div>
    </main>
  );
}
