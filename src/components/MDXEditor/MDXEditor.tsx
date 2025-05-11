"use client";

import { FC, useEffect, useState } from "react";
import "@mdxeditor/editor/style.css";
import styles from "./MDXEditor.module.css";
import { useEditContent } from "@/hooks/use-edit-content.hook";

interface MDXEditorClientProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

// Componente wrapper para cargar MDXEditor dinámicamente
const MDXEditorComponent: FC = () => {
  const [Editor, setEditor] =
    useState<React.ComponentType<MDXEditorClientProps> | null>(null);
  const { editingContent, setEditingContent, saveChanges, cancelEditing } =
    useEditContent();

  useEffect(() => {
    // Solo importar el editor en el cliente
    import("./MDXEditorClient")
      .then((mod) => setEditor(() => mod.default))
      .catch((error) => console.error("Error al cargar el editor:", error));
  }, []);

  const handleSave = () => {
    saveChanges();
  };

  const handleCancel = () => {
    cancelEditing();
  };

  if (!Editor) {
    return <div className={styles.loading}>Cargando editor...</div>;
  }

  return (
    <div className={styles.editorContainer}>
      <Editor markdown={editingContent} onChange={setEditingContent} />
      <div className={styles.editorActions}>
        <button className={styles.saveButton} onClick={handleSave}>
          Guardar
        </button>
        <button className={styles.cancelButton} onClick={handleCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default MDXEditorComponent;
