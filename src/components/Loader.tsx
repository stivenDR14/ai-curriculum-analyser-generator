"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Loader.module.css";

interface LoaderProps {
  destination: string;
}

export default function Loader({ destination }: LoaderProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(destination);
    }, 2000);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 4;
      });
    }, 80); // 25 pasos en 2 segundos

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [destination, router]);

  return (
    <div className={styles.loaderContainer}>
      <h2 className={styles.loaderTitle}>Procesando información...</h2>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className={styles.progressText}>{progress}%</p>
    </div>
  );
}
