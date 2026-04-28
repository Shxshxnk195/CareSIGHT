# AI Healthcare Triage Prototype

This project is a complete web-based prototype for an AI-powered healthcare triage system. It accepts symptom text, sends it through a backend triage pipeline, and returns:

- Risk Level
- Possible Cause
- Recommended Action

It is explicitly designed as a triage tool, not a diagnosis tool.

## Folder Structure

```text
GSCproject/
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── styles.css
├── backend/
│   ├── prompts/
│   │   └── triagePrompt.js
│   ├── routes/
│   │   └── triage.js
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── heuristicTriageService.js
│   │   └── triageService.js
│   ├── tests/
│   │   └── runTests.js
│   ├── utils/
│   │   ├── emergencyCheck.js
│   │   ├── parser.js
│   │   └── validator.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Safety Design

- The prompt forbids diagnosis-style language.
- Emergency symptom patterns force `High` risk in validation.
- AI output is parsed into structured fields before returning.
- A self-check layer validates structure and language.
- If Gemini fails or output is unsafe, the system auto-corrects or falls back to a safe heuristic response.
- Every response includes the required disclaimer:
  `This is not a medical diagnosis. Please consult a professional.`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root.

3. Add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
PORT=3000
```

You can copy `.env.example` and rename it to `.env`.

## Where To Insert Gemini API Key

Insert it in the root `.env` file:

```env
GEMINI_API_KEY=your_actual_gemini_api_key
```

The backend reads this in [backend/server.js](/C:/Users/admin/Desktop/GSCproject/backend/server.js).

## Run Locally

Start the app:

```bash
npm start
```

Open:

[http://localhost:3000](http://localhost:3000)

## Run Tests

The required test inputs are included in:

[backend/tests/runTests.js](/C:/Users/admin/Desktop/GSCproject/backend/tests/runTests.js)

Run them with:

```bash
npm test
```

Included test cases:

1. `fever for 2 days`
2. `chest pain and sweating`
3. `small cut on finger`
4. `vomiting and dizziness`

## Notes For Demo

- With a valid Gemini API key, the app uses Gemini for response generation.
- If Gemini is unavailable, the app still works using a safe fallback triage path.
- The fallback exists to preserve demo reliability while keeping safety guardrails active.
