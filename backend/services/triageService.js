const { generateTriageText } = require("./geminiService");
const { buildHeuristicTriage } = require("./heuristicTriageService");
const { parseTriageText } = require("../utils/parser");
const {
  correctTriageResult,
  validateTriageResult
} = require("../utils/validator");

const processSymptoms = async (symptoms) => {
  const trimmedSymptoms = symptoms.trim();

  let triageResult;
  let source = "gemini";

  try {
    const rawText = await generateTriageText(trimmedSymptoms);
    triageResult = parseTriageText(rawText);
  } catch (error) {
    console.warn("Gemini unavailable, using heuristic fallback:", error.message);
    triageResult = buildHeuristicTriage(trimmedSymptoms);
    source = "safety-fallback";
  }

  // All model output is normalized through a correction pass so the UI only receives
  // structured, safety-checked triage text.
  const validation = validateTriageResult(triageResult, trimmedSymptoms);
  const safeResult = correctTriageResult(triageResult, trimmedSymptoms);

  if (!validation.isValid) {
    source = `${source}-corrected`;
  }

  return {
    symptoms: trimmedSymptoms,
    riskLevel: safeResult.riskLevel,
    possibleCause: safeResult.possibleCause,
    recommendedAction: safeResult.recommendedAction,
    disclaimer: safeResult.disclaimer,
    source
  };
};

module.exports = {
  processSymptoms
};
