import { create } from "zustand";
import { IResume } from "@/models/resume";
import {
  RESUME_DATA_KEY,
  SUGGESTIONS_KEY,
  VACANCY_DATA_KEY,
} from "@/utils/constants-all";

interface ResumeStoreState {
  resumeData: IResume | null;
  setResumeData: (data: IResume) => void;
  clearResumeData: () => void;
  loadResumeFromStorage: () => void;
  vacancyData: string;
  setVacancyData: (data: string) => void;
  clearVacancyData: () => void;
  loadVacancyFromStorage: () => void;
  suggestions: string;
  setSuggestions: (data: string) => void;
  clearSuggestions: () => void;
  loadSuggestionsFromStorage: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  resumeData: null,
  setResumeData: (data) => set({ resumeData: data }),
  clearResumeData: () => {
    set({ resumeData: null });
    localStorage.removeItem(RESUME_DATA_KEY);
  },
  loadResumeFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(RESUME_DATA_KEY);
      if (saved) {
        set({ resumeData: JSON.parse(saved) });
      }
    }
  },
  vacancyData: "",
  setVacancyData: (data) => set({ vacancyData: data }),
  clearVacancyData: () => {
    set({ vacancyData: "" });
    localStorage.removeItem(VACANCY_DATA_KEY);
  },
  loadVacancyFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(VACANCY_DATA_KEY);
      if (saved) {
        try {
          // Procesar el texto para eliminar escape characters y formatear correctamente
          const processedData = saved
            .replace(/\\n/g, "\n") // Reemplazar \n por saltos de línea reales
            .replace(/\"/g, "") // Reemplazar \" por comillas reales
            .replace(/\\\\/g, "\\") // Reemplazar \\ por \
            .replace(/\\t/g, "\t") // Reemplazar \t por tabulaciones reales
            // Eliminar comillas JSON del principio y final si existen
            .replace(/^"(.*)"$/, "$1");

          set({ vacancyData: processedData });
        } catch (error) {
          console.error("Error processing vacancy data:", error);
          set({ vacancyData: saved });
        }
      }
    }
  },
  suggestions: "",
  setSuggestions: (data) => set({ suggestions: data }),
  clearSuggestions: () => {
    set({ suggestions: "" });
    localStorage.removeItem(SUGGESTIONS_KEY);
  },
  loadSuggestionsFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SUGGESTIONS_KEY);
      if (saved) {
        set({ suggestions: JSON.parse(saved) });
      }
    }
  },
}));
