const DEFAULT_DISCLAIMER =
  "This is not a medical diagnosis. Please consult a professional.";

const parseTriageText = (rawText) => {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const parsed = {
    riskLevel: "",
    possibleCause: "",
    recommendedAction: "",
    disclaimer: DEFAULT_DISCLAIMER,
    raw: rawText
  };

  for (const line of lines) {
    if (/^Risk Level:/i.test(line)) {
      parsed.riskLevel = line.replace(/^Risk Level:/i, "").trim();
    } else if (/^Possible Cause:/i.test(line)) {
      parsed.possibleCause = line.replace(/^Possible Cause:/i, "").trim();
    } else if (/^Recommended Action:/i.test(line)) {
      parsed.recommendedAction = line.replace(/^Recommended Action:/i, "").trim();
    } else if (/^Disclaimer:/i.test(line)) {
      parsed.disclaimer = line.replace(/^Disclaimer:/i, "").trim();
    }
  }

  return parsed;
};

module.exports = {
  DEFAULT_DISCLAIMER,
  parseTriageText
};
