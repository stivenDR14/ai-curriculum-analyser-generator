import { handleAnalysis } from "@/services/analyze-handler";

export async function POST(request: Request) {
  return handleAnalysis(request, "curriculum");
}
