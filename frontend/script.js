const form = document.getElementById("triage-form");
const symptomsInput = document.getElementById("symptoms");
const submitButton = document.getElementById("submit-button");
const resultCard = document.getElementById("result-card");
const riskBadge = document.getElementById("risk-badge");
const sourceBadge = document.getElementById("source-badge");
const sourceNote = document.getElementById("source-note");
const possibleCause = document.getElementById("possible-cause");
const recommendedAction = document.getElementById("recommended-action");
const disclaimer = document.getElementById("disclaimer");

const setRiskBadge = (riskLevel) => {
  riskBadge.textContent = riskLevel;
  riskBadge.className = "risk-badge";

  if (riskLevel === "Low") {
    riskBadge.classList.add("risk-low");
  } else if (riskLevel === "Moderate") {
    riskBadge.classList.add("risk-moderate");
  } else if (riskLevel === "High") {
    riskBadge.classList.add("risk-high");
  }
};

const setSourceBadge = (source = "") => {
  const normalizedSource = source.toLowerCase();
  sourceBadge.className = "source-badge";

  if (normalizedSource === "gemini") {
    sourceBadge.textContent = "Gemini API";
    sourceBadge.classList.add("source-gemini");
    sourceNote.textContent = "Primary AI response generated through Gemini.";
    return;
  }

  if (normalizedSource.includes("fallback")) {
    sourceBadge.textContent = "Safety Fallback";
    sourceBadge.classList.add("source-fallback");
    sourceNote.textContent =
      "A backup safety path was used because the Gemini response was unavailable or needed correction.";
    return;
  }

  sourceBadge.textContent = "Unknown Source";
  sourceNote.textContent = "The source of this analysis could not be determined.";
};

const setLoadingState = (isLoading) => {
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Analyzing..." : "Analyze Symptoms";
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const symptoms = symptomsInput.value.trim();
  if (!symptoms) {
    return;
  }

  setLoadingState(true);

  try {
    const response = await fetch("/api/triage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ symptoms })
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Unable to analyze symptoms.");
    }

    setRiskBadge(payload.riskLevel);
    setSourceBadge(payload.source);
    possibleCause.textContent = payload.possibleCause;
    recommendedAction.textContent = payload.recommendedAction;
    disclaimer.textContent = payload.disclaimer;
    resultCard.hidden = false;
  } catch (error) {
    setRiskBadge("High");
    setSourceBadge("safety-fallback");
    possibleCause.textContent =
      "The system could not fully process the request, so a cautious response is being shown.";
    recommendedAction.textContent =
      "If symptoms are severe, worsening, or feel urgent, seek immediate medical care. Otherwise, contact a healthcare professional.";
    disclaimer.textContent =
      "This is not a medical diagnosis. Please consult a professional.";
    resultCard.hidden = false;
    console.error(error);
  } finally {
    setLoadingState(false);
  }
});
