"use client";

import React, { useEffect, useMemo } from "react";
import styles from "./Stepper.module.css";
import { stepperLabels } from "@/utils/labels";
import { useSettingsStore } from "@/hooks/useSettingsStore";
import { usePathname } from "next/navigation";

const getLabels = (isRecruiter: boolean) => {
  if (isRecruiter) {
    return [stepperLabels.step21, stepperLabels.step22];
  }
  return [stepperLabels.step11, stepperLabels.step12, stepperLabels.step13];
};

const Stepper: React.FC = () => {
  const isRecruiter = useSettingsStore((state) => state.isRecruiter);
  const pathname = usePathname();
  const loadRecruiterFromStorage = useSettingsStore(
    (state) => state.loadIsRecruiterFromStorage
  );

  const routesMap = useMemo(() => {
    return !isRecruiter
      ? {
          "/curriculum-analisys": 1,
          "/resources": 2, // Asumiendo que esta es la página para el paso 2
          "/reports": 3, // Asumiendo que esta es la página para el paso 3
        }
      : {
          "/resources": 1, // Para reclutador, /resources es el paso 1
          "/report": 2, // Y /report es el paso 2
        };
  }, [isRecruiter]);

  useEffect(() => {
    loadRecruiterFromStorage();
  }, []);

  const currentStepForPath = routesMap[pathname as keyof typeof routesMap];
  const labels = getLabels(isRecruiter);

  // No renderizar si es la página principal, la ruta no está mapeada, o el paso excede los labels disponibles.
  if (
    pathname === "/" ||
    !currentStepForPath ||
    currentStepForPath > labels.length
  ) {
    return null;
  }

  return (
    <nav className={styles.stepper} aria-label="Progreso del proceso">
      {labels.map((label, idx) => {
        const stepNumber = idx + 1;
        const isActive = currentStepForPath === stepNumber;
        const isCompleted = currentStepForPath > stepNumber;

        return (
          <React.Fragment key={label}>
            <div className={styles.stepItem}>
              <div
                className={`${styles.circle} ${
                  isActive
                    ? styles.active
                    : isCompleted
                    ? styles.completed
                    : styles.inactive
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {stepNumber}
              </div>
              <span
                className={`${styles.label} ${
                  isActive ? styles.labelActive : styles.labelInactive
                }`}
              >
                {label}
              </span>
            </div>
            {idx < labels.length - 1 && (
              <div
                className={`${styles.lineConnector} ${
                  isCompleted ? styles.lineFilled : styles.lineDefault // Linea azul si el paso actual (idx) está completado, sino gris
                }`}
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Stepper;
