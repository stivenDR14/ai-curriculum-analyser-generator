import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";
import {
  RECRUITER_MODE_KEY,
  RESUME_DATA_KEY,
  RESUME_DATA_KEY_RECRUITER,
} from "@/utils/constants-all";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface IResponse {
  success: boolean;
  message: string;
  data: ResumeData | VacancyData;
}

interface ResumeData {
  resume: {
    title: string;
    contactInformation: string;
    professionalSummary: string;
    skills: string;
    workExperience: string;
    education: string;
    certifications: string;
  };
  error?: string;
}

interface VacancyData {
  vacancy: {
    title: string;
    industry: string;
    description: string;
    requirements: string;
    benefits: string;
    salary: string;
    location: string;
    company: string;
  };
  error?: string;
}

interface UseDocumentsReturn {
  isRecruiter: boolean;
  setIsRecruiter: (value: boolean) => void;
  saveResumeData: (data: IResponse, isRecruiter: boolean) => void;
  getResumeData: () => ResumeData | null;
}

export const useDocuments = (router: AppRouterInstance): UseDocumentsReturn => {
  const [isRecruiter, setIsRecruiter] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem(RECRUITER_MODE_KEY);
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem(RECRUITER_MODE_KEY, JSON.stringify(isRecruiter));
  }, [isRecruiter]);

  //if there is information on the local storage about the resume data, and the local storage is not recruiter mode, route to the currirculum-analysis page
  // if there is information on the local storage about the vacancy data, and the local storage is recruiter mode, route to the resources page

  useEffect(() => {
    if (getResumeData() && !isRecruiter) {
      router.push("/curriculum-analisys");
    }
    if (getResumeData() && isRecruiter) {
      router.push("/resources");
    }
  }, [isRecruiter]);

  const saveResumeData = (data: IResponse, isRecruiter: boolean) => {
    if (data.data.error) {
      showToast.info(data.data.error);
    }

    if (isRecruiter) {
      showToast.success(data.message);
      localStorage.setItem(
        isRecruiter ? RESUME_DATA_KEY_RECRUITER : RESUME_DATA_KEY,
        JSON.stringify((data.data as VacancyData).vacancy)
      );
    } else {
      showToast.success(data.message);
      localStorage.setItem(
        isRecruiter ? RESUME_DATA_KEY_RECRUITER : RESUME_DATA_KEY,
        JSON.stringify((data.data as ResumeData).resume)
      );
    }
  };

  const getResumeData = (): ResumeData | null => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(RESUME_DATA_KEY);
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
