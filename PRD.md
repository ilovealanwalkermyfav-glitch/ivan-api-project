# Product Requirements Document (PRD)
## HalluGuard AI — Detecting Hallucinations in Large Language Models

**Document Version:** 1.0
**Project Type:** College Minor Project (Full-Stack + API Integration)
**Author/Owner:** [Your Name]
**Last Updated:** September 2026

---

## 1. Executive Summary

HalluGuard AI is a full-stack web application that demonstrates how Large Language Models (LLMs) can produce hallucinated (factually incorrect or unsupported) content, and how a second API-driven verification layer can detect, score, and explain those hallucinations. The project is intentionally **API-integration-focused** rather than ML-model-training-focused, making it realistic in scope for a college minor project while still being technically substantial and visually impressive.

The core idea: **one API call generates an answer, a second API call critiques that answer against evidence**, and the results are presented on an interactive dashboard with confidence scores, claim-level breakdowns, and plain-language explanations.

---

## 2. Problem Statement

LLMs are increasingly used as trusted sources of information, but they can generate **hallucinations** — confident-sounding statements that are false, unverifiable, or not grounded in real evidence. Most end users have no way to know when this is happening. There is a need for a lightweight, explainable system that:

- Shows generated LLM output next to a verification pass
- Flags claims that are unsupported or fabricated
- Communicates uncertainty rather than false confidence
- Educates users on *why* hallucinations happen

This project addresses that gap in a scoped, demonstrable way suitable for academic evaluation.

---

## 3. Objectives

1. Build a working end-to-end pipeline: **User Input → Generation API → Verification API → Structured Analysis → Dashboard**
2. Demonstrate a clear, reproducible example of a hallucination (fictional entity) vs. a grounded answer.
3. Present confidence scores and claim-level verdicts in an intuitive, visual way.
4. Maintain a history of past analyses (JSON or lightweight DB).
5. Provide a **Demo Mode** so the project works and can be presented even without live API access/internet in the exam room.
6. Clearly and honestly communicate the **limitations** of AI-based verification (no guaranteed truth, probabilistic scoring, false positive/negative risk).
7. Package everything (code + documentation) so it's easy to explain in a viva/demo.

### Non-Goals (Explicitly Out of Scope)
- Training or fine-tuning any ML/NLP model from scratch
- Building a production-grade RAG pipeline with a vector database (mentioned only as future scope)
- Guaranteeing 100% hallucination detection accuracy
- Multi-user authentication / production security hardening (basic protections only)

---

## 4. Target Users

| User | Need |
|---|---|
| College evaluator / professor ("sir") | See a working, well-explained, technically sound demo |
| Student (you) | A project that's buildable in a reasonable timeframe with clear API boundaries |
| General demo audience | Understand, at a glance, "is this AI answer trustworthy?" |

---

## 5. Core Concept Recap

1. User submits a question (and optionally a reference/evidence text).
2. Backend calls **Generation API** (LLM) → produces an answer.
3. Backend calls **Verification API** (a second LLM call with a strict "fact-checking" system prompt) → evaluates the generated answer against the question + optional evidence + the model's own general knowledge.
4. Verification response is parsed into **structured JSON**: verdict, confidence, supported claims, hallucinated claims, explanation.
5. Frontend renders this as an interactive results dashboard.
6. Analysis is saved to history.

**Critical honesty requirement:** Every confidence score and verdict must be visibly labeled as an *AI-generated estimate*, not ground truth. This should appear as a persistent disclaimer/tooltip in the UI, not just in documentation.

---

## 6. System Architecture

### 6.1 High-Level Architecture Diagram (textual)

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React.js)                        │
│  ┌───────────┐  ┌────────────┐  ┌────────────┐  ┌─────────────┐ │
│  │  Input     │  │  Results    │  │  History    │  │  Demo Mode  │ │
│  │  Panel     │  │  Dashboard  │  │  Panel      │  │  Toggle     │ │
│  └─────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│        └────────────────┴────────────────┴────────────────┘      │
│                          Axios (services/api.js)                  │
└───────────────────────────────┬────────────────────────────────┘
                                 │ HTTPS (REST/JSON)
┌───────────────────────────────▼────────────────────────────────┐
│                    SERVER (Node.js + Express.js)                 │
│  ┌────────────┐   ┌───────────────┐   ┌────────────────────┐    │
│  │ /api/generate│  │ /api/verify   │  │ /api/history        │    │
│  └──────┬──────┘   └───────┬───────┘   └──────────┬─────────┘    │
│         │                  │                       │              │
│  ┌──────▼──────────────────▼───────────────────────▼────────┐    │
│  │        Controllers → Services → Utils (parsing/scoring)    │    │
│  └──────┬──────────────────┬───────────────────────┬────────┘    │
│         │                  │                       │              │
│  ┌──────▼──────┐   ┌───────▼───────┐      ┌────────▼────────┐   │
│  │ LLM API      │   │ Verification  │      │ JSON/DB storage │   │
│  │ (Generation) │   │ LLM API call  │      │ (history.json)  │   │
│  └──────────────┘   └───────────────┘      └─────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   External LLM Provider   │
                    │ (Anthropic / OpenAI, etc.)│
                    └───────────────────────────┘
```

### 6.2 Component Responsibilities

- **Client (React.js):** Collects input, calls backend REST endpoints (never the LLM directly), renders results, manages theme (dark/light), manages Demo Mode state, displays history.
- **Server (Express.js):** Owns all API keys, orchestrates the two-step LLM workflow, validates/sanitizes input, parses LLM verification output into strict JSON, persists history, exposes health check.
- **Storage:** Lightweight — a local `history.json` file (or optionally SQLite/lowdb) storing past analyses. No user accounts needed for a minor project.

---

## 7. API Workflow (Detailed)

### Step-by-step sequence

```
1. User enters question (+ optional reference text) → clicks "Analyze Answer"
2. Frontend: POST /api/generate  { question }
3. Backend: calls LLM Generation API with question
4. Backend: returns { answer, model, timestamp }
5. Frontend: automatically (or on second click) POST /api/verify
   { question, answer, referenceText (optional) }
6. Backend: builds a strict verification prompt instructing the LLM to:
     - break the answer into discrete claims
     - classify each claim as Supported / Unsupported / Uncertain
     - assign an overall confidence score (0–100)
     - return a verdict: "Supported" | "Mostly Supported" | "Partially Supported" | "Unsupported / Hallucinated"
     - give a short plain-language explanation
   - Requires the LLM to respond in STRICT JSON (use response schema / JSON-only instruction)
7. Backend: parses/validates JSON response (with fallback error handling if malformed)
8. Backend: saves the full analysis object to history storage
9. Backend: returns structured analysis JSON to frontend
10. Frontend: renders Results Dashboard (badges, confidence meter, claim list, explanation)
11. Frontend: appends to History Panel
```

### 7.1 Verification Prompt Design (core intellectual contribution of the project)

The verification call system prompt should instruct the model to act as a **strict, skeptical fact-checking assistant**, e.g.:

> "You are a fact-verification engine. You will be given a QUESTION, an ANSWER generated by another AI, and optionally REFERENCE TEXT. Break the ANSWER into individual factual claims. For each claim, decide if it is SUPPORTED, UNSUPPORTED, or UNCERTAIN based on the reference text (if given) and your general knowledge. Be skeptical of specific names, dates, and statistics that cannot be verified. Respond ONLY with valid JSON matching this schema: { verdict, confidence, supported_claims: [], potentially_hallucinated_claims: [], explanation }. Do not include any text outside the JSON."

This prompt-engineering step is what makes the "detection" mechanism work — it should be documented clearly since it's the technical core of the project (no custom ML model is being trained; the intelligence comes from prompting a second, independent LLM call as a critic/verifier).

---

## 8. Data Model / Data Flow Design

### 8.1 Analysis Object Schema (stored + returned)

```json
{
  "id": "uuid-string",
  "timestamp": "2026-09-09T10:00:00Z",
  "question": "Who invented the telephone?",
  "referenceText": "",
  "generatedAnswer": "Alexander Graham Bell is commonly credited with inventing the telephone.",
  "verification": {
    "verdict": "Mostly Supported",
    "confidence": 92,
    "supported_claims": [
      "Alexander Graham Bell is widely credited with inventing the telephone."
    ],
    "potentially_hallucinated_claims": [],
    "explanation": "The statement is broadly supported by historical references, although the invention involved contributions from multiple people (e.g., Elisha Gray)."
  },
  "isDemoData": false,
  "modelUsed": "claude-sonnet-4-6"
}
```

### 8.2 History Storage

- File: `server/data/history.json` — array of Analysis Objects (simplest option for a minor project).
- Optional upgrade: `lowdb` or `SQLite` (better-sqlite3) if the evaluator wants "database" checked off formally.
- Cap history at, e.g., last 50 entries to keep the file small; expose `GET /api/history` and `DELETE /api/history/:id`.

### 8.3 Data Flow Diagram (textual)

```
[User Input] 
   → [POST /api/generate] → [LLM API] → [Generated Answer]
   → [POST /api/verify: question+answer+reference] → [Verification LLM API]
   → [Parsed JSON Analysis] 
   → [Saved to history.json] 
   → [Returned to Frontend] 
   → [Rendered in Dashboard + History Panel]
```

---

## 9. API Specification

### 9.1 `POST /api/generate`
**Request Body**
```json
{ "question": "string (required)" }
```
**Response 200**
```json
{ "answer": "string", "model": "string", "timestamp": "ISO date" }
```
**Errors:** 400 (missing question), 500 (LLM API failure), 504 (timeout)

### 9.2 `POST /api/verify`
**Request Body**
```json
{
  "question": "string (required)",
  "answer": "string (required)",
  "referenceText": "string (optional)"
}
```
**Response 200**
```json
{
  "verdict": "Supported | Mostly Supported | Partially Supported | Unsupported",
  "confidence": 0,
  "supported_claims": ["..."],
  "potentially_hallucinated_claims": ["..."],
  "explanation": "string",
  "disclaimer": "This is an AI-generated estimate, not a guaranteed measure of truth."
}
```
**Errors:** 400 (missing fields), 422 (LLM returned non-parseable JSON — backend should attempt one repair retry, then fall back to a safe default response), 500, 504

### 9.3 `POST /api/analyze` (optional convenience endpoint combining generate + verify in one call)
Runs steps 9.1 and 9.2 sequentially server-side and returns the full Analysis Object (Section 8.1). Recommended as the primary endpoint the frontend calls for the "Analyze Answer" button, since it simplifies frontend logic to a single request.

### 9.4 `GET /api/history`
Returns array of saved Analysis Objects (most recent first), paginated optionally via `?limit=20&offset=0`.

### 9.5 `DELETE /api/history/:id`
Removes one entry (nice-to-have "reset" feature).

### 9.6 `GET /api/health`
```json
{
  "status": "ok",
  "server": "running",
  "llmApiConfigured": true,
  "llmApiReachable": true,
  "timestamp": "ISO date"
}
```
Used by the frontend to show a status indicator (green/red dot) and to auto-suggest Demo Mode if the live API is unreachable.

### 9.7 `GET /api/demo-examples`
Returns the 3 hardcoded demo cases (Section 12) so the frontend doesn't need to bundle them separately, and so Demo Mode logic lives on the backend too (keeps it consistent/reusable).

---

## 10. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend framework | React.js (Vite recommended over CRA for speed) | Functional components + hooks |
| Styling | Tailwind CSS | Utility-first, fast to make it look premium |
| Animation | Framer Motion (optional but recommended) | For confidence meter, card transitions, loading states |
| Icons | lucide-react | Clean, modern icon set |
| Charts | Recharts or a custom SVG/CSS radial meter | For confidence score visualization |
| HTTP client | Axios | Frontend → backend calls only |
| Backend framework | Node.js + Express.js | REST API |
| LLM Provider | Anthropic Claude API (or OpenAI, configurable) | Two calls: generation + verification |
| Env management | dotenv | `.env` for API keys, never committed |
| Storage | JSON file (`history.json`) or lowdb/SQLite | Lightweight, no external DB server needed |
| Validation | express-validator or manual checks | Input sanitation |
| Dev tools | nodemon, concurrently | Run client+server together in dev |

---

## 11. UI/UX Design Specification

### 11.1 Design Language
- **Style:** Modern dashboard, subtle glassmorphism (frosted cards, soft shadows, light border glow), gradient accents (violet → cyan or indigo → teal), rounded corners (xl/2xl), generous whitespace.
- **Typography:** A clean sans-serif (Inter / Manrope / Sora) — bold headings, medium body text.
- **Themes:** Dark mode (default, deep navy/slate background with neon-ish gradient accents) and Light mode (soft off-white background, same accent gradients) — toggle stored in localStorage.
- **Motion:** Fade/slide-in for result cards, smooth width/stroke animation for the confidence meter, pulsing "thinking" animation during API calls (skeleton loaders, not spinners only).

### 11.2 Page/Section Layout

**Header**
- Logo/wordmark: "🤖 HalluGuard AI"
- Tagline: "Detect. Verify. Understand."
- Right side: theme toggle, health-status dot, Demo Mode switch

**Hero Section**
- Large heading: "Can you trust every AI answer?"
- Subtext explaining the tool in 1–2 lines
- Scroll/CTA down to input section

**Input Section**
- Question textarea (large, auto-expanding)
- Collapsible "Add reference text (optional)" textarea
- Row of example question chips/buttons (clicking pre-fills the textarea)
- Primary button: "Analyze Answer" (gradient, loading state with animated icon)
- Secondary: "Try Demo Example" button set (3 buttons: ✅ Supported / ⚠️ Partial / ❌ Hallucinated)

**Results Section** (appears after analysis, animated in)
- **Generated Answer Card** — shows the raw LLM answer, with a small "🤖 Generated by [model]" tag
- **Verdict Badge** — color-coded pill: green (Supported), yellow (Partially Supported), red (Unsupported/Hallucinated)
- **Confidence Meter** — animated radial/arc gauge, 0–100%, color-shifts with value; tooltip/footnote: "AI-estimated confidence — not a guarantee of factual accuracy"
- **Claim-by-Claim Breakdown** — two columns or a single list:
  - ✅ Supported Claims (green left-border cards)
  - 🔴 Potentially Hallucinated Claims (red left-border cards)
- **Explanation Card** — plain-language paragraph, styled as an "AI insight" callout
- Action row: "Try Another Question" (reset), "Copy Result" (copies formatted summary to clipboard)

**History Section**
- List/table of past analyses: question (truncated), verdict badge, confidence %, timestamp
- Click a row → reopens that full analysis in the Results Section (read-only replay)
- Small "Demo Data" tag on entries generated via Demo Mode

**Footer**
- Short academic disclaimer (see Section 13) + "Built as a college minor project" credit + links to About/Architecture explainer modal

### 11.3 Responsiveness
- Mobile: stack all cards vertically, collapse example-question chips into a horizontal scroll row, sticky "Analyze" button.
- Tablet/Desktop: two-column results layout (answer+verdict on left, claims breakdown on right) on ≥1024px.

### 11.4 Micro-interactions Checklist
- [ ] Loading skeleton / animated "Analyzing…" state with step indicators ("Generating answer…" → "Verifying claims…")
- [ ] Animated confidence arc (0 → final value over ~800ms)
- [ ] Verdict badge pop/scale-in animation
- [ ] Toast notification on "Copied to clipboard"
- [ ] Smooth dark/light theme cross-fade
- [ ] Hover elevation on cards
- [ ] Disabled state + shake animation if user submits empty question

---

## 12. Demo Mode Specification

Demo Mode must work **fully offline** (no network calls) so the project never fails during a live evaluation.

### 12.1 Predefined Cases

**Case 1 — Supported ✅**
- Question: "Who invented the telephone?"
- Answer: "Alexander Graham Bell is commonly credited with inventing the telephone."
- Verdict: Supported, Confidence: 92%
- Explanation: Well-documented historical fact; minor nuance around simultaneous inventors.

**Case 2 — Partially Supported ⚠️**
- Question: "What is the capital of Australia?"
- Answer (deliberately flawed): "The capital of Australia is Sydney, its largest and most famous city."
- Verdict: Partially Supported / Unsupported, Confidence: 35%
- Supported claim: "Sydney is Australia's largest and most famous city."
- Hallucinated claim: "Sydney is the capital of Australia" (actual capital is Canberra).
- Explanation: Common misconception; the model conflated "largest city" with "capital."

**Case 3 — Hallucinated ❌**
- Question: "Tell me about a fictional scientist named Dr. Arjun Mehta."
- Answer: A fabricated biography (e.g., "Dr. Arjun Mehta is a Nobel Prize-winning physicist from Pune who discovered the 'Mehta Field Theory' in 1998...")
- Verdict: Unsupported / Hallucinated, Confidence: 8%
- Hallucinated claims: All biographical details (no such person/prize/theory exists)
- Explanation: No verifiable evidence exists for this person; the model fabricated plausible-sounding but fictitious details — a classic hallucination pattern.

### 12.2 UI Treatment
- Every demo result carries a visible **"DEMO DATA — not a live API result"** ribbon/badge.
- Demo Mode toggle in the header disables live API calls entirely while active and swaps the Analyze button behavior to instantly (with animation) show canned results.

---

## 13. Security & Reliability Requirements

- All API keys stored in backend `.env`; `.env` added to `.gitignore`; `.env.example` provided with placeholder keys.
- Frontend never talks to the LLM provider directly — always via backend proxy routes.
- Backend validates and trims/limits input length (e.g., max 1000 chars per field) to control token usage/cost.
- Timeouts on LLM calls (e.g., 20s) with graceful error messages ("The verification service is taking too long. Try again or use Demo Mode.").
- Verification LLM response is parsed defensively: if JSON parsing fails, attempt a single "repair" re-prompt; if that also fails, return a safe fallback object with `verdict: "Unable to Verify"` rather than crashing.
- Rate-limit basic abuse (e.g., simple in-memory limiter — X requests/minute) — optional but a nice-to-mention safeguard.
- No claims of guaranteed correctness anywhere in UI copy or docs — every confidence score/verdict is labeled as a probabilistic AI estimate.

---

## 14. Academic / Explainer Content (to embed in an "About" modal + README)

**What are LLM hallucinations?**
Instances where an LLM generates text that is fluent and confident-sounding but factually incorrect, fabricated, or unsupported by any real source.

**Why do hallucinations happen?**
LLMs are next-token predictors trained to produce statistically plausible text, not databases of verified facts. They lack a built-in mechanism to "know what they don't know," can blend memorized patterns incorrectly, and may fill gaps with the most probable-sounding (but false) continuation — especially for obscure entities, precise numbers, or fictional prompts.

**What is API-based hallucination detection (as used here)?**
Rather than training a custom classifier, this project uses a **second independent LLM call** with a skeptical, claim-decomposition prompt to critique the first model's output — comparing claims against provided reference text and general knowledge, and scoring confidence. This is a lightweight, practical approximation of verification, not a formal fact-checking system.

**Generation vs. Verification — key difference**
Generation optimizes for fluent, helpful, plausible answers. Verification optimizes for skepticism — actively looking for what *can't* be substantiated. Using two separate calls/prompts (rather than one) reduces the model's tendency to simply defend its own prior answer.

**Limitations of this project**
- Verification is itself performed by an LLM, which can also hallucinate or be miscalibrated — this is a heuristic aid, not ground truth.
- No live web search or curated knowledge base is used unless the user supplies reference text (i.e., no RAG in this version).
- Confidence scores are self-reported by the model, not statistically calibrated probabilities.
- Small/ambiguous claims may be misclassified.

**Future scope**
- Retrieval-Augmented Generation (RAG): pull real-time evidence from a vector DB / search engine before verification.
- Source citation linking (show the actual source URL/passage backing each supported claim).
- Multi-model cross-verification (ask 2–3 different LLMs and compare consensus).
- Fine-tuned lightweight classifier trained on labeled hallucination datasets for faster, cheaper first-pass screening.
- Browser extension version for real-time checking of any AI chat output.

---

## 15. Presentation / Viva Structure (ready-made outline)

1. **Project Title** — HalluGuard AI: Detecting Hallucinations in LLMs
2. **Problem Statement** — Section 2
3. **Objectives** — Section 3
4. **Proposed System** — Section 5
5. **System Architecture** — Section 6
6. **API Workflow** — Section 7
7. **Technology Stack** — Section 10
8. **Key Features** — Sections 11–12 (dashboard + demo mode highlights)
9. **Sample Output** — walk through Example (Section 5) and the 3 Demo Mode cases (Section 12)
10. **Limitations** — Section 14
11. **Future Scope** — Section 14
12. **Conclusion** — one slide: "HalluGuard AI shows that a second-opinion API call, with the right prompt design, can meaningfully surface AI hallucinations — a practical, low-cost pattern applicable to any AI product."

---

## 16. Suggested Project Folder Structure

```
halluguard-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── InputPanel.jsx
│   │   │   ├── ExampleChips.jsx
│   │   │   ├── AnswerCard.jsx
│   │   │   ├── VerdictBadge.jsx
│   │   │   ├── ConfidenceMeter.jsx
│   │   │   ├── ClaimList.jsx
│   │   │   ├── ExplanationCard.jsx
│   │   │   ├── HistoryPanel.jsx
│   │   │   ├── DemoModeSwitch.jsx
│   │   │   └── LoadingState.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── demoExamples.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── routes/
│   │   ├── generate.routes.js
│   │   ├── verify.routes.js
│   │   ├── history.routes.js
│   │   └── health.routes.js
│   ├── controllers/
│   │   ├── generate.controller.js
│   │   ├── verify.controller.js
│   │   └── history.controller.js
│   ├── services/
│   │   ├── llmService.js         # wraps LLM API calls
│   │   └── verificationPrompt.js # prompt templates
│   ├── utils/
│   │   ├── jsonParser.js         # defensive JSON parsing/repair
│   │   └── validators.js
│   ├── data/
│   │   └── history.json
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json (root, optional concurrently script)
```

---

## 17. Implementation Plan (Phased)

**Phase 1 — Setup**
- Init client (Vite + React + Tailwind) and server (Express) projects
- Set up `.env`, `.env.example`, basic health check endpoint

**Phase 2 — Backend Core**
- Build `llmService.js` (generic function to call the LLM API)
- Build `/api/generate` and `/api/verify` (or combined `/api/analyze`)
- Build defensive JSON parsing for verification responses
- Build `history.json` read/write + `/api/history` endpoints

**Phase 3 — Frontend Core**
- Build layout shell (Header, Hero, Input Section)
- Wire up Axios service to call `/api/analyze`
- Build Results Dashboard components (Answer Card, Verdict Badge, Confidence Meter, Claim List, Explanation Card)

**Phase 4 — Demo Mode**
- Hardcode the 3 demo cases
- Build toggle + instant "fake analysis" flow with same UI components

**Phase 5 — Polish**
- Dark/light theme, animations, responsive pass, copy/reset buttons, History panel UI

**Phase 6 — Documentation**
- README with setup instructions, architecture diagram, academic explainer, screenshots
- Prepare presentation slides using Section 15 outline

---

## 18. Setup & Run Instructions (to include in README.md)

```bash
# 1. Clone / unzip project
cd halluguard-ai

# 2. Install server dependencies
cd server
npm install
cp .env.example .env
# then fill in your LLM API key inside .env

# 3. Install client dependencies
cd ../client
npm install

# 4. Run both (from project root, two terminals or use concurrently)
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev

# 5. Open the app
# Frontend: http://localhost:5173
# Backend health check: http://localhost:5000/api/health
```

`.env.example`:
```
PORT=5000
LLM_API_KEY=your_api_key_here
LLM_API_PROVIDER=anthropic
LLM_MODEL=claude-sonnet-4-6
```

---

## 19. Acceptance Criteria (Definition of Done)

- [ ] User can submit a question and receive a generated answer within a reasonable time
- [ ] Verification step returns structured verdict/confidence/claims/explanation
- [ ] Confidence score and verdict are visually rendered with an animated meter and color-coded badges
- [ ] At least one true hallucination example is demonstrable (fictional person case)
- [ ] Demo Mode works fully offline with all 3 cases and is clearly labeled
- [ ] History of past analyses persists across page reloads and is viewable
- [ ] Dark/light theme toggle works app-wide
- [ ] App is responsive on mobile widths
- [ ] No API keys are exposed in any frontend code or network request visible in browser dev tools
- [ ] README explains setup, architecture, and academic concepts clearly enough for a non-coder evaluator to follow

---

## 20. Disclaimer Text (must appear in-app, not just docs)

> "HalluGuard AI uses a second AI model to estimate whether an answer is well-supported. This is a probabilistic, AI-generated estimate — not a guarantee of factual accuracy. The system can produce false positives (flagging correct claims as unsupported) and false negatives (missing real hallucinations). Always verify important information against trusted primary sources."

---

*End of PRD — ready to proceed to implementation (backend skeleton → frontend skeleton → full working code) upon request.*
