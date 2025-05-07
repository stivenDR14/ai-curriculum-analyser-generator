import React from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "switch";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: ButtonProps) {
  const getButtonClass = () => {
    switch (variant) {
      case "primary":
        return styles.primary;
      case "secondary":
        return styles.secondary;
      case "switch":
        return styles.switch;
      default:
        return styles.primary;
    }
  };

  return (
    <button
      type={type}
      className={`${getButtonClass()} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
