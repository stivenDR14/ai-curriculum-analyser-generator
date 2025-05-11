"use client";

import Loader from "@/components/Loader";
import { useReportDocuments } from "@/hooks/use-report-documents.hook";
import { vacancyLabels } from "@/utils/labels";

export default function Report() {
  const { documents, isRecruiter, clearDocuments } = useReportDocuments();

  if (!documents) {
    return <Loader messages={vacancyLabels.loaderMessages} />;
  }

  return <div>Report</div>;
}
