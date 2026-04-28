const express = require("express");
const { processSymptoms } = require("../services/triageService");

const router = express.Router();

router.post("/", async (req, res) => {
  const { symptoms } = req.body;

  if (!symptoms || typeof symptoms !== "string" || !symptoms.trim()) {
    return res.status(400).json({
      error: "Symptoms input is required."
    });
  }

  try {
    const result = await processSymptoms(symptoms);
    return res.json(result);
  } catch (error) {
    console.error("Triage route error:", error);
    return res.status(500).json({
      error: "Unable to process symptoms right now. Please try again."
    });
  }
});

module.exports = router;
