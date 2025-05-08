"use client";

import React, { useState, useEffect } from "react";
import styles from "./Loader.module.css";

interface LoaderProps {
  messages: string[];
  interval?: number;
}

const Loader: React.FC<LoaderProps> = ({ messages, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setIsExiting(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [messages.length, interval]);

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner} />
      </div>
      <div className={styles.textContainer}>
        <p
          className={`${styles.loadingText} ${
            isExiting ? styles.exiting : styles.visible
          }`}
        >
          {messages[currentIndex]}
        </p>
      </div>
    </div>
  );
};

export default Loader;
