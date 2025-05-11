import { handleReport } from "@/services/analyze-report";

export async function POST(request: Request) {
  return handleReport(request, "vacancy");
}
