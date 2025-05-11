import { useRouter } from "next/navigation";
import { useSettingsStore } from "./use-settingsStore";
import { useResumeStore } from "./use-resumeStore";
import { useEffect } from "react";

export const useReportDocuments = () => {
  const router = useRouter();
  const isRecruiter = useSettingsStore((state) => state.isRecruiter);
  const documents = useResumeStore((state) => state.documents);
  const clearDocuments = useResumeStore((state) => state.clearDocuments);
  const loadDocumentsFromStorage = useResumeStore(
    (state) => state.loadDocumentsFromStorage
  );
  const loadRecruiterFromStorage = useSettingsStore(
    (state) => state.loadIsRecruiterFromStorage
  );
  useEffect(() => {
    loadDocumentsFromStorage();
    loadRecruiterFromStorage();
  }, []);

  return {
    router,
    documents,
    isRecruiter,
    clearDocuments,
  };
};
