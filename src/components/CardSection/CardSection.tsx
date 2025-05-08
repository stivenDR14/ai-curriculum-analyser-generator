import { SectionTitle } from "../Typography";
import styles from "./CardSection.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CardSection({
  title,
  content,
  icon,
  handleEdit,
}: {
  title: string;
  content: string;
  icon: string;
  handleEdit: () => void;
}) {
  return (
    <div className={styles.resultSection}>
      <SectionTitle icon={icon}>{title}</SectionTitle>
      <div className={styles.sectionContent}>
        <div className={styles.markdownBox}>
          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={handleEdit}>
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
