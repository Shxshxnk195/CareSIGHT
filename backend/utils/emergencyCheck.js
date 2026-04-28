const EMERGENCY_PATTERNS = [
  /chest pain/i,
  /shortness of breath|difficulty breathing|can(?:'|’)t breathe/i,
  /severe bleeding|bleeding heavily/i,
  /loss of consciousness|passed out|fainted/i,
  /stroke|face drooping|slurred speech|one-sided weakness/i,
  /seizure|convulsion/i,
  /severe allergic reaction|anaphylaxis|swelling of (?:the )?throat/i,
  /confusion|disoriented/i,
  /blue lips|blue skin/i
];

const hasEmergencySymptoms = (symptoms) => {
  return EMERGENCY_PATTERNS.some((pattern) => pattern.test(symptoms));
};

module.exports = {
  hasEmergencySymptoms
};
