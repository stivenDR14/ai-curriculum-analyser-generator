import { useEffect } from "react";
import { showToast } from "@/components/Toast";
import {
  DOCUMENTS_KEY,
  RESUME_DATA_KEY,
  SUGGESTIONS_KEY,
  VACANCY_DATA_KEY,
} from "@/utils/constants-all";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { IDocuments, IResume } from "@/models/general";
import { useResumeStore } from "./use-resumeStore";
import { useSettingsStore } from "./use-settingsStore";

interface IResponse {
  success: boolean;
  message: string;
  data: ResumeData | VacancyData | DocumentsData;
}

interface ResumeData {
  resume: IResume;
  suggestions?: string;
  error?: string;
}

interface VacancyData {
  vacancy: string;
  suggestions?: string;
  error?: string;
}

interface DocumentsData {
  documents: IDocuments;
  error?: string;
}

interface UseDocumentsReturn {
  isRecruiter: boolean;
  setIsRecruiter: (value: boolean) => void;
  saveResumeData: (data: IResponse, isRecruiter: boolean) => void;
  getResumeData: () => ResumeData | null;
}

export const useDocuments = ({
  router,
  isHome,
}: {
  router: AppRouterInstance;
  isHome: boolean;
}): UseDocumentsReturn => {
  const isRecruiter = useSettingsStore((state) => state.isRecruiter);
  const setIsRecruiter = useSettingsStore((state) => state.setIsRecruiter);
  const loadIsRecruiterFromStorage = useSettingsStore(
    (state) => state.loadIsRecruiterFromStorage
  );

  const setResumeData = useResumeStore((state) => state.setResumeData);
  const setVacancyData = useResumeStore((state) => state.setVacancyData);
  const setDocumentsData = useResumeStore((state) => state.setDocuments);
  useEffect(() => {
    setIsRecruiter(isRecruiter);
  }, [isRecruiter]);

  useEffect(() => {
    loadIsRecruiterFromStorage();
  }, []);

  useEffect(() => {
    if (isHome) {
      if (getResumeData() && !isRecruiter) {
        router.push("/curriculum-analisys");
      }
      if (getResumeData() && isRecruiter) {
        router.push("/vacancy");
      }
    }
  }, [isRecruiter]);

  const saveResumeData = (data: IResponse, isRecruiter: boolean) => {
    if (data.data.error) {
      showToast.info(data.data.error);
    }

    if (!isHome) {
      localStorage.setItem(
        DOCUMENTS_KEY,
        JSON.stringify((data.data as DocumentsData).documents)
      );
      setDocumentsData((data.data as DocumentsData).documents);
    } else {
      if (isRecruiter) {
        showToast.success(data.message);
        setVacancyData((data.data as VacancyData).vacancy);
        localStorage.setItem(
          VACANCY_DATA_KEY,
          JSON.stringify((data.data as VacancyData).vacancy)
        );
        localStorage.setItem(
          SUGGESTIONS_KEY,
          JSON.stringify((data.data as VacancyData).suggestions)
        );
      } else {
        showToast.success(data.message);
        setResumeData((data.data as ResumeData).resume);
        localStorage.setItem(
          RESUME_DATA_KEY,
          JSON.stringify((data.data as ResumeData).resume)
        );
        localStorage.setItem(
          SUGGESTIONS_KEY,
          JSON.stringify((data.data as ResumeData).suggestions)
        );
      }
    }
  };

  const getResumeData = (): ResumeData | null => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(
        isRecruiter ? VACANCY_DATA_KEY : RESUME_DATA_KEY
      );
      return savedData ? JSON.parse(savedData) : null;
    }
    return null;
  };

  return {
    isRecruiter,
    setIsRecruiter,
    saveResumeData,
    getResumeData,
  };
};
