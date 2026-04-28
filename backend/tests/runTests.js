require("dotenv").config();

const assert = require("assert");
const { processSymptoms } = require("../services/triageService");

const REQUIRED_DISCLAIMER =
  "This is not a medical diagnosis. Please consult a professional.";

const testInputs = [
  "fever for 2 days",
  "chest pain and sweating",
  "small cut on finger",
  "vomiting and dizziness",
  "itchy mosquito bite",
  "runny nose",
  "lump in breast"
];

const ensureSafeStructure = (result) => {
  assert.ok(result.riskLevel, "Risk level should exist");
  assert.ok(["Low", "Moderate", "High"].includes(result.riskLevel), "Risk level should be valid");
  assert.ok(result.possibleCause, "Possible cause should exist");
  assert.ok(result.recommendedAction, "Recommended action should exist");
  assert.strictEqual(result.disclaimer, REQUIRED_DISCLAIMER, "Disclaimer should match expected text");
  assert.ok(!/\byou have\b/i.test(result.possibleCause), "Possible cause should avoid diagnosis wording");
  assert.ok(!/\bdiagnosis\b/i.test(result.possibleCause), "Possible cause should avoid diagnosis wording");
};

const run = async () => {
  console.log("Running triage prototype tests...");

  for (const input of testInputs) {
    const result = await processSymptoms(input);
    ensureSafeStructure(result);

    if (/chest pain and sweating/i.test(input)) {
      assert.strictEqual(result.riskLevel, "High", "Emergency symptoms must be high risk");
    }

    if (/small cut on finger|itchy mosquito bite|runny nose/i.test(input)) {
      assert.strictEqual(result.riskLevel, "Low", "Clearly minor symptoms should be low risk");
    }

    if (/lump in breast/i.test(input)) {
      assert.strictEqual(result.riskLevel, "Moderate", "A new lump should not be classified as low risk");
    }

    console.log(`PASS: "${input}" -> ${result.riskLevel}`);
  }

  console.log("All tests passed.");
};

run().catch((error) => {
  console.error("Tests failed:", error);
  process.exit(1);
});
