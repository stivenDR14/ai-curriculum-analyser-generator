import { useRouter } from "next/navigation";
import { useSettingsStore } from "./use-settingsStore";
import { useResumeStore } from "./use-resumeStore";
import { useEffect } from "react";

export const useReportDocuments = () => {
  const router = useRouter();
  const isRecruiter = useSettingsStore((state) => state.isRecruiter);
  const documents = useResumeStore((state) => state.documents);
  const clearDocuments = useResumeStore((state) => state.clearDocuments);
  const resumeData = useResumeStore((state) => state.resumeData);
  const loadDocumentsFromStorage = useResumeStore(
    (state) => state.loadDocumentsFromStorage
  );
  const loadResumeFromStorage = useResumeStore(
    (state) => state.loadResumeFromStorage
  );
  const loadRecruiterFromStorage = useSettingsStore(
    (state) => state.loadIsRecruiterFromStorage
  );
  useEffect(() => {
    loadDocumentsFromStorage();
    loadRecruiterFromStorage();
    loadResumeFromStorage();
  }, []);

  return {
    router,
    documents,
    resumeData,
    isRecruiter,
    clearDocuments,
  };
};
