import { RECRUITER_MODE_KEY } from "@/utils/constants-all";
import { create } from "zustand";

interface SettingsStoreState {
  isRecruiter: boolean;
  setIsRecruiter: (value: boolean) => void;
  loadIsRecruiterFromStorage: () => void;
}

export const useSettingsStore = create<SettingsStoreState>((set) => ({
  isRecruiter: false, // Valor inicial por defecto
  setIsRecruiter: (value) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(RECRUITER_MODE_KEY, JSON.stringify(value));
    }
    set({ isRecruiter: value });
  },
  loadIsRecruiterFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(RECRUITER_MODE_KEY);
      if (saved) {
        set({ isRecruiter: JSON.parse(saved) });
      }
    }
  },
}));

// Opcional: Cargar el estado desde localStorage cuando la tienda se inicializa por primera vez.
// Esto se puede hacer de manera más robusta si es necesario, pero para este caso,
// un componente principal (como _app.tsx o el layout) podría llamar a loadIsRecruiterFromStorage.
// Por ahora, lo dejaremos explícito para ser llamado donde se necesite al inicio.
