"use client";

import { FC } from "react";
import "@mdxeditor/editor/style.css";
import styles from "./MDXEditor.module.css";
import { useEditContent } from "@/hooks/use-edit-content.hook";
import dynamic from "next/dynamic";

// Cargar de forma dinámica el componente cliente
const MDXEditorClient = dynamic(() => import("./MDXEditorClient"), {
  ssr: false,
});

// Componente wrapper para el editor MDX
const MDXEditorComponent: FC = () => {
  const { editingContent, setEditingContent, saveChanges, cancelEditing } =
    useEditContent();

  const handleSave = () => {
    saveChanges();
  };

  const handleCancel = () => {
    cancelEditing();
  };

  return (
    <div className={styles.editorContainer}>
      {editingContent && (
        <MDXEditorClient
          markdown={editingContent}
          onChange={setEditingContent}
        />
      )}
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
