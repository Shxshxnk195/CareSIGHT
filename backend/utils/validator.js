const { hasEmergencySymptoms } = require("./emergencyCheck");
const { DEFAULT_DISCLAIMER } = require("./parser");

const ALLOWED_RISK_LEVELS = ["Low", "Moderate", "High"];
const DIAGNOSIS_LANGUAGE_PATTERNS = [
  /\byou have\b/i,
  /\byou are suffering from\b/i,
  /\bthis is definitely\b/i,
  /\bdiagnosis\b/i,
  /\bdiagnosed with\b/i,
  /\bit is (?:certain|confirmed)\b/i
];

const isDiagnosisLanguage = (text) => {
  return DIAGNOSIS_LANGUAGE_PATTERNS.some((pattern) => pattern.test(text));
};

const validateTriageResult = (triageResult, symptoms) => {
  const validationErrors = [];
  const combinedText = [
    triageResult.possibleCause,
    triageResult.recommendedAction
  ].join(" ");

  if (!ALLOWED_RISK_LEVELS.includes(triageResult.riskLevel)) {
    validationErrors.push("Invalid or missing risk level.");
  }

  if (!triageResult.possibleCause) {
    validationErrors.push("Possible cause is missing.");
  }

  if (!triageResult.recommendedAction) {
    validationErrors.push("Recommended action is missing.");
  }

  if (isDiagnosisLanguage(combinedText)) {
    validationErrors.push("Diagnosis-like language detected.");
  }

  if (hasEmergencySymptoms(symptoms) && triageResult.riskLevel !== "High") {
    validationErrors.push("Emergency symptoms must be high risk.");
  }

  return {
    isValid: validationErrors.length === 0,
    validationErrors
  };
};

const sanitizeText = (text) => {
  let safeText = text || "";

  safeText = safeText.replace(/\byou have\b/gi, "these symptoms may relate to");
  safeText = safeText.replace(/\byou are suffering from\b/gi, "these symptoms could suggest");
  safeText = safeText.replace(/\bdefinitely\b/gi, "possibly");
  safeText = safeText.replace(/\bconfirmed\b/gi, "possible");
  safeText = safeText.replace(/\bdiagnosis\b/gi, "assessment");

  return safeText.trim();
};

const buildFallbackResult = (symptoms) => {
  if (hasEmergencySymptoms(symptoms)) {
    return {
      riskLevel: "High",
      possibleCause:
        "These symptoms may indicate a serious condition that needs urgent medical assessment.",
      recommendedAction:
        "Seek emergency care immediately or call local emergency services now.",
      disclaimer: DEFAULT_DISCLAIMER
    };
  }

  return {
    riskLevel: "Moderate",
    possibleCause:
      "These symptoms may be related to a common illness or dehydration, but they still need medical review if they continue or worsen.",
    recommendedAction:
      "Arrange prompt evaluation by a healthcare professional, especially if symptoms intensify, new symptoms appear, or you cannot keep fluids down.",
    disclaimer: DEFAULT_DISCLAIMER
  };
};

const correctTriageResult = (triageResult, symptoms) => {
  const corrected = {
    riskLevel: ALLOWED_RISK_LEVELS.includes(triageResult.riskLevel)
      ? triageResult.riskLevel
      : "Moderate",
    possibleCause: sanitizeText(triageResult.possibleCause),
    recommendedAction: sanitizeText(triageResult.recommendedAction),
    disclaimer: DEFAULT_DISCLAIMER
  };

  if (!corrected.possibleCause) {
    corrected.possibleCause =
      "These symptoms may be related to a non-specific health issue and should be assessed carefully.";
  }

  if (!corrected.recommendedAction) {
    corrected.recommendedAction =
      "Monitor symptoms closely and contact a healthcare professional for guidance.";
  }

  if (hasEmergencySymptoms(symptoms)) {
    corrected.riskLevel = "High";
    corrected.possibleCause =
      "These symptoms may indicate a serious condition that needs urgent medical assessment.";
    corrected.recommendedAction =
      "Seek emergency care immediately or call local emergency services now.";
  }

  const validation = validateTriageResult(corrected, symptoms);
  if (!validation.isValid) {
    return buildFallbackResult(symptoms);
  }

  return corrected;
};

module.exports = {
  buildFallbackResult,
  correctTriageResult,
  validateTriageResult
};
