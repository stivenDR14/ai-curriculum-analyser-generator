import { handleAnalysis } from "@/helpers/analyzeHandler";

export async function POST(request: Request) {
  return handleAnalysis(request, "vacancy");
}
