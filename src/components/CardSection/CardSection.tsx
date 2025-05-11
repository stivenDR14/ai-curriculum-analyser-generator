import { SectionTitle } from "../Typography";
import styles from "./CardSection.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { reportLabels } from "@/utils/labels";
import { renderToString } from "react-dom/server";

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

  // Función auxiliar para renderizar texto con formato negrita
  const renderFormattedText = (
    pdf: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number
  ): number => {
    // Si el texto contiene formato de negrita
    if (text.includes("**")) {
      const segments = text.split("**");
      let posX = x;

      for (let j = 0; j < segments.length; j++) {
        if (!segments[j]) continue; // Saltamos segmentos vacíos

        if (j % 2 === 0) {
          // Texto normal
          pdf.setFont("helvetica", "normal");
        } else {
          // Texto en negrita
          pdf.setFont("helvetica", "bold");
        }

        // Si alcanzamos el borde, envolvemos el texto
        if (posX + pdf.getTextWidth(segments[j]) > x + maxWidth) {
          // Envolvemos el texto
          const wrapped = pdf.splitTextToSize(
            segments[j],
            maxWidth - (posX - x)
          );
          pdf.text(wrapped[0], posX, y);

          // Si hay más líneas, las procesamos en nuevas líneas
          if (wrapped.length > 1) {
            for (let i = 1; i < wrapped.length; i++) {
              y += 12; // Nueva línea
              pdf.text(wrapped[i], x, y);
            }
            posX = x + pdf.getTextWidth(wrapped[wrapped.length - 1]);
          } else {
            posX += pdf.getTextWidth(wrapped[0]);
          }
        } else {
          // Texto normal sin envolver
          pdf.text(segments[j], posX, y);
          posX += pdf.getTextWidth(segments[j]);
        }
      }

      // Restauramos la fuente normal
      pdf.setFont("helvetica", "normal");
      return y;
    } else {
      // Texto sin formato especial
      const wrappedText = pdf.splitTextToSize(text, maxWidth);
      pdf.text(wrappedText, x, y);
      return y + (wrappedText.length - 1) * 12;
    }
  };

  const handleDownloadPDF = async () => {
    const fileName = title
      ? `${title.replace(/\s+/g, "_").replace(/[^\w\s]/gi, "")}.pdf`
      : "documento.pdf";

    try {
      // Creamos el PDF directamente - usando tamaño de puntos para mejor control
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Dimensiones A4 en puntos
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 30; // Margen reducido
      const contentWidth = pageWidth - 2 * margin;

      // Renderizamos y agregamos el título
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text(title, margin, margin);

      let currentY = margin + 20; // Posición inicial después del título

      // Procesamos el markdown de forma continua, sin saltos entre secciones
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10); // Tamaño de fuente más pequeño para aprovechar espacio

      // Procesar el contenido completo
      const processContent = (content: string) => {
        // Preparamos el contenido - eliminamos espacios en blanco múltiples
        const cleanContent = content.replace(/\n\s*\n\s*\n/g, "\n\n");

        // Dividimos en líneas
        const lines = cleanContent.split("\n");

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Saltamos líneas vacías

          // Verificamos si debemos saltar de página
          if (currentY > pageHeight - 40) {
            pdf.addPage();
            currentY = margin;
          }

          // Sección principal (## Título)
          if (line.startsWith("## ")) {
            const sectionTitle = line.substring(3);
            currentY += 8; // Pequeño espacio antes de sección
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(12);
            pdf.text(sectionTitle, margin, currentY);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            currentY += 14; // Espacio post-título reducido
            continue;
          }

          // Subsección (### Título)
          if (line.startsWith("### ")) {
            const subsectionTitle = line.substring(4);
            currentY += 5; // Espacio mínimo
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(11);
            pdf.text(subsectionTitle, margin, currentY);
            pdf.setFont("helvetica", "normal");
            pdf.setFontSize(10);
            currentY += 12;
            continue;
          }

          // Lista con viñetas (con posible formato de negrita dentro)
          if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
            // Si el texto tiene múltiples líneas y no cabe, cambiar de página
            if (currentY > pageHeight - 40) {
              pdf.addPage();
              currentY = margin;
            }

            // Dibujamos la viñeta
            pdf.text("•", margin, currentY);

            // Extraemos el texto después de la viñeta
            const textContent = line.trim().substring(2);

            // Procesamos el texto por si contiene formato de negrita
            currentY = renderFormattedText(
              pdf,
              textContent,
              margin + 10,
              currentY,
              contentWidth - 10
            );

            // Avanzamos a la siguiente línea si no ha habido saltos
            currentY += 12;
            continue;
          }

          // Texto normal (párrafo)
          if (currentY > pageHeight - 40) {
            pdf.addPage();
            currentY = margin;
          }

          // Procesamos el texto normal con posible formato de negrita
          currentY = renderFormattedText(
            pdf,
            line,
            margin,
            currentY,
            contentWidth
          );

          // Avanzamos a la siguiente línea
          currentY += 12;

          // Agregamos espacio mínimo después de párrafos
          // Solo si no es el final de una sección
          if (
            i < lines.length - 1 &&
            !lines[i + 1].startsWith("#") &&
            lines[i + 1].trim() !== ""
          ) {
            currentY += 2; // Espacio mínimo entre párrafos
          }
        }
      };

      // Procesamos todo el contenido de manera continua
      processContent(content);

      // Guardamos el PDF
      pdf.save(fileName);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Inténtalo de nuevo.");

      // Método alternativo simplificado si falla el enfoque principal
      try {
        // Creamos un solo contenedor para todo el contenido
        const tempContainer = document.createElement("div");
        tempContainer.style.width = "595px"; // Ancho A4 en puntos
        tempContainer.style.padding = "10px";
        tempContainer.style.margin = "0";
        tempContainer.style.backgroundColor = "#fff";
        tempContainer.style.fontFamily = "Arial, sans-serif";
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "0";

        // Título
        const titleElement = document.createElement("h1");
        titleElement.textContent = title;
        titleElement.style.fontSize = "14px";
        titleElement.style.marginBottom = "5px";
        titleElement.style.paddingBottom = "3px";
        titleElement.style.color = "#333";
        tempContainer.appendChild(titleElement);

        // Markdown a HTML muy compacto
        const markdownHtml = renderToString(
          <div style={{ color: "#333", lineHeight: "1.2", fontSize: "10px" }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        );

        const contentDiv = document.createElement("div");
        contentDiv.innerHTML = markdownHtml;
        tempContainer.appendChild(contentDiv);

        // Estilos ultra compactos
        const styleElement = document.createElement("style");
        styleElement.textContent = `
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { margin: 0; padding: 0; }
          h1 { font-size: 14px; margin: 0 0 4px 0; }
          h2 { font-size: 12px; margin: 6px 0 2px 0; }
          h3 { font-size: 11px; margin: 4px 0 1px 0; }
          p { margin: 0 0 2px 0; line-height: 1.2; }
          ul, ol { margin: 0 0 2px 10px; padding: 0; }
          li { margin: 0 0 1px 0; }
          br { height: 1px; }
          div { margin: 0; padding: 0; }
          strong { font-weight: bold; }
        `;
        tempContainer.appendChild(styleElement);

        document.body.appendChild(tempContainer);

        const pdfOutput = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        // Capturamos el contenido y lo convertimos a imagen
        const canvas = await html2canvas(tempContainer, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#fff",
        });

        // Agregamos la imagen al PDF, ajustándola al ancho de página
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgWidth = pdfOutput.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Para grandes contenidos, necesitamos múltiples páginas
        let heightLeft = imgHeight;
        let position = 0;
        let page = 1;

        // Primera página
        pdfOutput.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        heightLeft -= pdfOutput.internal.pageSize.getHeight();

        // Páginas adicionales si es necesario
        while (heightLeft > 0) {
          position = -pdfOutput.internal.pageSize.getHeight() * page;
          pdfOutput.addPage();
          pdfOutput.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pdfOutput.internal.pageSize.getHeight();
          page++;
        }

        pdfOutput.save(fileName);
        document.body.removeChild(tempContainer);
      } catch (fallbackError) {
        console.error("Error en método alternativo:", fallbackError);
        alert("No fue posible generar el PDF. Por favor, inténtalo más tarde.");
      }
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
            <button className={styles.actionButton} onClick={handleDownloadPDF}>
              {reportLabels.downloadPDF}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
