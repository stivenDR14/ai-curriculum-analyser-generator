import { useEffect, useState } from "react";
import { useDocuments } from "./use-documents.hook";
import { useRouter } from "next/navigation";
import { frontendErrorsLabels } from "@/utils/labels";
import { showToast } from "@/components/Toast";
import { MAX_CHARACTERS, MAX_FILES } from "@/utils/constants-all";
import { useResumeStore } from "./use-resumeStore";

export const UseHandleUploadFiles = (isHome: boolean) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [disableSelectFile, setDisableSelectFile] = useState(false);
  const [recruiterText, setRecruiterText] = useState("");
  const [cvText, setCvText] = useState("");
  const router = useRouter();
  const loadResumeFromStorage = useResumeStore(
    (state) => state.loadResumeFromStorage
  );
  const loadVacancyFromStorage = useResumeStore(
    (state) => state.loadVacancyFromStorage
  );
  const { isRecruiter, setIsRecruiter, saveResumeData } = useDocuments({
    router,
    isHome,
  });

  const vacancyData = useResumeStore((state) => state.vacancyData);
  const resumeData = useResumeStore((state) => state.resumeData);

  useEffect(() => {
    if (uploadedFiles.length < MAX_FILES) {
      setDisableSelectFile(false);
    } else {
      setDisableSelectFile(true);
    }
  }, [uploadedFiles]);

  useEffect(() => {
    if (!isHome) {
      loadResumeFromStorage();
      loadVacancyFromStorage();
    }
  }, []);

  const handleAnalyze = async (type: "curriculum" | "vacancy") => {
    if (
      !uploadedFiles.length &&
      (type === "curriculum" ? cvText === "" : recruiterText === "")
    ) {
      showToast.error(frontendErrorsLabels.noFilesSelected);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("text", type === "curriculum" ? cvText : recruiterText);
    if (!isHome) {
      if (type === "curriculum") {
        formData.append("vacancy", vacancyData);
      } else {
        formData.append("resume", JSON.stringify(resumeData));
      }
    }
    try {
      console.log("type", type);
      const response = await fetch(
        `/api/${!isHome ? "report" : "analyze"}/${type}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(frontendErrorsLabels.uploadError);
      }

      const data = await response.json();
      saveResumeData(data, isRecruiter);

      router.push(
        isHome ? (isRecruiter ? "/vacancy" : "/curriculum-analisys") : "/report"
      );
    } catch (error: unknown) {
      console.error("Error:", error);
      showToast.error(frontendErrorsLabels.uploadError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    isRecruiter: boolean
  ) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      if (isRecruiter) {
        setRecruiterText(text);
      } else {
        setCvText(text);
      }
    }
  };

  const handleSelectFile = () => {
    if (uploadedFiles.length >= MAX_FILES) {
      setDisableSelectFile(true);
      return;
    }
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setUploadedFiles((filesaux) => [...filesaux, file]);
      }
    };
    fileInput.click();
  };

  return {
    router,
    isLoading,
    uploadedFiles,
    setUploadedFiles,
    disableSelectFile,
    recruiterText,
    cvText,
    isRecruiter,
    setIsRecruiter,
    handleAnalyze,
    handleTextChange,
    handleSelectFile,
  };
};
