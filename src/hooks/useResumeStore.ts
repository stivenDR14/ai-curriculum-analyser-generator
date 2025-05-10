import { create } from "zustand";
import { IResume } from "@/models/resume";
import { RESUME_DATA_KEY, VACANCY_DATA_KEY } from "@/utils/constants-all";

interface ResumeStoreState {
  resumeData: IResume | null;
  setResumeData: (data: IResume) => void;
  clearResumeData: () => void;
  loadResumeFromStorage: () => void;
  vacancyData: string;
  setVacancyData: (data: string) => void;
  clearVacancyData: () => void;
  loadVacancyFromStorage: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  resumeData: null,
  setResumeData: (data) => set({ resumeData: data }),
  clearResumeData: () => set({ resumeData: null }),
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
  clearVacancyData: () => set({ vacancyData: "" }),
  loadVacancyFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(VACANCY_DATA_KEY);
      if (saved) {
        console.log("loadVacancyFromStorage", saved);
        set({ vacancyData: saved });
      }
    }
  },
}));
