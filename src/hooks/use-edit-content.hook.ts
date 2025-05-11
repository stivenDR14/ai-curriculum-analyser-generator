import { create } from "zustand";
import { DOCUMENTS_KEY } from "@/utils/constants-all";
import { IDocuments } from "@/models/general";

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
      // Guardar cambios en localStorage
      const editedContentMap = get().loadEditedContentFromStorage();
      editedContentMap[id] = newContent;
      localStorage.setItem(
        EDITED_CONTENT_KEY,
        JSON.stringify(editedContentMap)
      );

      // Si el contenido forma parte de los documentos, actualizar en el store
      try {
        const documentsJson = localStorage.getItem(DOCUMENTS_KEY);
        if (documentsJson) {
          const documents: IDocuments = JSON.parse(documentsJson);

          // Actualizar el documento correspondiente según el ID
          if (id === "report" && documents.report) {
            documents.report = newContent;
          } else if (id === "coverLetter" && documents.coverLetter) {
            documents.coverLetter = newContent;
          }

          // Guardar los documentos actualizados
          localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
        }
      } catch (error) {
        console.error("Error al actualizar documentos:", error);
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
  } = useEditContentStore();

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

  // Verificar si un contenido específico ha sido editado
  const getEditedContent = (id: string, defaultContent: string): string => {
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
  };
};
