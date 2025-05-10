import { SectionTitle } from "../Typography";
import styles from "./CardSection.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

export default function CardSection({
  title,
  content,
  icon,
  handleEdit,
  isSuggestion = false,
}: {
  title: string;
  content: string;
  icon: string;
  handleEdit: () => void;
  isSuggestion?: boolean;
}) {
  const [expanded, setExpanded] = useState(isSuggestion ? true : false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={`${styles.resultSection} ${
        isSuggestion && styles.suggestionSection
      }`}
    >
      <SectionTitle icon={icon}>{title}</SectionTitle>
      <div className={styles.sectionContent}>
        <div
          className={`${styles.markdownBox} ${
            expanded ? styles.expanded : styles.collapsed
          }`}
        >
          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
          {!isSuggestion &&
            (content.split("\n").length > 3 || content.length > 100) && (
              <button className={styles.expandButton} onClick={toggleExpand}>
                {expanded ? "Ver menos" : "Ver más"}
              </button>
            )}
        </div>
        {!isSuggestion && (
          <div className={styles.actionButtons}>
            <button className={styles.actionButton} onClick={handleEdit}>
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
