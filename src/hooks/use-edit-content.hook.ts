import { create } from "zustand";
import { DOCUMENTS_KEY } from "@/utils/constants-all";
import { useResumeStore } from "./use-resumeStore";

// Clave para almacenar el contenido editado en localStorage
export const EDITED_CONTENT_KEY = "EDITED_CONTENT_KEY";

// Interfaz para los elementos editables
export interface EditableContent {
  id: string;
  title: string;
  content: string;
  icon: string;
}

// Interfaz para el estado del store
interface EditContentStoreState {
  // Estado para controlar qué sección se está editando actualmente
  currentEditId: string | null;
  setCurrentEditId: (id: string | null) => void;

  // Estado para guardar el contenido original antes de editarlo
  originalContent: EditableContent | null;
  setOriginalContent: (content: EditableContent | null) => void;

  // Estado para el contenido que se está editando
  editingContent: string;
  setEditingContent: (content: string) => void;

  // Métodos para guardar, cancelar y aplicar cambios
  saveContent: (id: string, newContent: string) => void;
  cancelEdit: () => void;

  // Método para cargar contenido editado desde localStorage
  loadEditedContentFromStorage: () => Record<string, string>;

  clearEditedContent: () => void;
}

// Hook personalizado para gestionar la edición de contenido
export const useEditContentStore = create<EditContentStoreState>(
  (set, get) => ({
    currentEditId: null,
    setCurrentEditId: (id) => set({ currentEditId: id }),

    originalContent: null,
    setOriginalContent: (content) => set({ originalContent: content }),

    editingContent: "",
    setEditingContent: (content) => set({ editingContent: content }),

    saveContent: (id, newContent) => {
      // Guardar cambios en localStorage con EDITED_CONTENT_KEY
      const editedContentMap = get().loadEditedContentFromStorage();
      editedContentMap[id] = newContent;
      localStorage.setItem(
        EDITED_CONTENT_KEY,
        JSON.stringify(editedContentMap)
      );

      // Obtener el estado global de documentos
      const documentsFromStore = useResumeStore.getState().documents;

      // Si hay documentos en el store global, actualizar según corresponda
      if (documentsFromStore) {
        const updatedDocuments = { ...documentsFromStore };

        // Actualizar el documento correspondiente según el ID
        if (id === "report" && updatedDocuments.report !== undefined) {
          updatedDocuments.report = newContent;
        } else if (
          id === "coverLetter" &&
          updatedDocuments.coverLetter !== undefined
        ) {
          updatedDocuments.coverLetter = newContent;
        } else if (
          id === "curriculum" &&
          updatedDocuments.report !== undefined
        ) {
          // No modificamos directamente el currículum porque está compuesto de varios campos
          // Esto se manejaría en otro lugar si fuera necesario
        }

        // Actualizar el estado global con los documentos modificados
        useResumeStore.getState().setDocuments(updatedDocuments);

        // También actualizar localStorage para mantener consistencia
        localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(updatedDocuments));
      }

      // Limpiar estado de edición
      set({
        currentEditId: null,
        originalContent: null,
        editingContent: "",
      });
    },

    cancelEdit: () => {
      set({
        currentEditId: null,
        originalContent: null,
        editingContent: "",
      });
    },

    loadEditedContentFromStorage: () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(EDITED_CONTENT_KEY);
        if (saved) {
          try {
            return JSON.parse(saved);
          } catch (error) {
            console.error("Error al cargar contenido editado:", error);
          }
        }
      }
      return {};
    },

    clearEditedContent: () => {
      localStorage.removeItem(EDITED_CONTENT_KEY);
    },
  })
);

// Hook para usar en los componentes
export const useEditContent = () => {
  const {
    currentEditId,
    setCurrentEditId,
    originalContent,
    setOriginalContent,
    editingContent,
    setEditingContent,
    saveContent,
    cancelEdit,
    loadEditedContentFromStorage,
    clearEditedContent,
  } = useEditContentStore();

  // Obtener los documentos del estado global
  const documents = useResumeStore((state) => state.documents);

  // Iniciar edición de una sección
  const startEditing = (content: EditableContent) => {
    setOriginalContent(content);
    setEditingContent(content.content);
    setCurrentEditId(content.id);
  };

  // Guardar los cambios realizados
  const saveChanges = () => {
    if (currentEditId && originalContent) {
      saveContent(currentEditId, editingContent);
      return true;
    }
    return false;
  };

  // Cancelar la edición
  const cancelEditing = () => {
    cancelEdit();
  };

  // Obtener el contenido para mostrar, priorizando el estado global
  const getEditedContent = (id: string, defaultContent: string): string => {
    // Primero intentar obtener del estado global de documentos
    if (documents) {
      if (id === "report" && documents.report !== undefined) {
        return documents.report;
      }
      if (id === "coverLetter" && documents.coverLetter !== undefined) {
        return documents.coverLetter;
      }
      // Para curriculum, ya se maneja con el objeto resumeData en CardSection
    }

    // Como fallback, intentar obtener de los contenidos editados guardados
    const editedContentMap = loadEditedContentFromStorage();
    return editedContentMap[id] || defaultContent;
  };

  // Verificar si hay una edición en progreso
  const isEditing = currentEditId !== null;

  return {
    isEditing,
    currentEditId,
    editingContent,
    setEditingContent,
    startEditing,
    saveChanges,
    cancelEditing,
    getEditedContent,
    clearEditedContent,
  };
};
