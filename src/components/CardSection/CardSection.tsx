import { SectionTitle } from "../Typography";
import styles from "./CardSection.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { reportLabels } from "@/utils/labels";

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
  const [showPdfModal, setShowPdfModal] = useState(false);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleOpenPdfModal = () => {
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
  };

  const handleDownloadPDF = async () => {
    if (!pdfContentRef.current) return;

    const fileName = title
      ? `${title.replace(/\s+/g, "_").replace(/[^\w\s]/gi, "")}.pdf`
      : "documento.pdf";

    try {
      // Capturar el contenido del modal
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#fff",
      });

      // Crear el PDF con formato A4
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Agregar la imagen al PDF
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Manejar contenido de múltiples páginas
      let heightLeft = imgHeight;
      let position = 0;
      let page = 1;

      // Primera página
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Páginas adicionales si es necesario
      while (heightLeft > 0) {
        position = -pageHeight * page;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        page++;
      }

      pdf.save(fileName);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Inténtalo de nuevo.");
    }
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
            <button
              className={styles.actionButton}
              onClick={handleOpenPdfModal}
            >
              {reportLabels.downloadPDF}
            </button>
          </div>
        )}
      </div>

      {showPdfModal && (
        <div className={styles.pdfModalOverlay}>
          <div className={styles.pdfModalContent}>
            <div className={styles.pdfModalHeader}>
              <h2>{title}</h2>
              <div className={styles.pdfModalActions}>
                <button
                  className={styles.pdfDownloadButton}
                  onClick={handleDownloadPDF}
                >
                  Descargar PDF
                </button>
                <button
                  className={styles.pdfCloseButton}
                  onClick={handleClosePdfModal}
                >
                  ✕
                </button>
              </div>
            </div>
            <div className={styles.pdfDocumentContainer}>
              <div className={styles.pdfDocumentContent} ref={pdfContentRef}>
                <div className={styles.pdfDocumentHeader}>
                  <h1>{title}</h1>
                </div>
                <div className={styles.pdfDocumentBody}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
