import { create } from "zustand";
import { IResume } from "@/models/resume";
import { RESUME_DATA_KEY } from "@/utils/constants-all";

interface ResumeStoreState {
  resumeData: IResume | null;
  setResumeData: (data: IResume) => void;
  clearResumeData: () => void;
  loadResumeFromStorage: () => void;
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
}));
