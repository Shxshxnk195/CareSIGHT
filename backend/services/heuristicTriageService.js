const { hasEmergencySymptoms } = require("../utils/emergencyCheck");
const { DEFAULT_DISCLAIMER } = require("../utils/parser");

const LOW_RISK_PATTERNS = [
  /paper cut|small cut|minor cut|scrape|abrasion|minor wound/i,
  /mosquito bite|insect bite|bug bite/i,
  /runny nose|stuffy nose|nasal congestion/i,
  /mild sore throat/i,
  /small bruise|minor bruise/i
];

const MODERATE_RISK_PATTERNS = [
  /lump in breast|breast lump|new lump/i,
  /vomiting|dizziness/i,
  /fever/i
];

const buildHeuristicTriage = (symptoms) => {
  const normalizedSymptoms = symptoms.toLowerCase();

  if (hasEmergencySymptoms(symptoms)) {
    return {
      riskLevel: "High",
      possibleCause:
        "These symptoms may indicate a serious cardiac, breathing, or neurologic issue that requires urgent evaluation.",
      recommendedAction:
        "Seek emergency care immediately or call local emergency services now.",
      disclaimer: DEFAULT_DISCLAIMER,
      source: "safety-fallback"
    };
  }

  if (LOW_RISK_PATTERNS.some((pattern) => pattern.test(normalizedSymptoms))) {
    return {
      riskLevel: "Low",
      possibleCause:
        "This may be a minor, self-limited issue if symptoms stay mild and there are no warning signs such as spreading redness, severe pain, or trouble breathing.",
      recommendedAction:
        "Use basic home care, monitor symptoms closely, and contact a healthcare professional if symptoms worsen, last longer than expected, or new concerning signs appear.",
      disclaimer: DEFAULT_DISCLAIMER,
      source: "safety-fallback"
    };
  }

  if (MODERATE_RISK_PATTERNS.some((pattern) => pattern.test(normalizedSymptoms))) {
    return {
      riskLevel: "Moderate",
      possibleCause:
        "These symptoms may be related to a non-emergency condition that still needs monitoring or medical review.",
      recommendedAction:
        "Monitor symptoms carefully and arrange medical advice, especially if symptoms persist, worsen, or new concerning signs appear.",
      disclaimer: DEFAULT_DISCLAIMER,
      source: "safety-fallback"
    };
  }

  return {
    riskLevel: "Moderate",
    possibleCause:
      "These symptoms may be related to a non-specific health issue that needs a cautious medical review.",
    recommendedAction:
      "Monitor symptoms closely and seek medical guidance, especially if symptoms worsen or new concerning signs appear.",
    disclaimer: DEFAULT_DISCLAIMER,
    source: "safety-fallback"
  };
};

module.exports = {
  buildHeuristicTriage
};
