# 🛡️ HalluGuard AI — Detecting Hallucinations in Large Language Models

> **College Minor Project | Two-Model Cross-Provider Verification Architecture**  
> *Author: Ivan Dsouza* • *Built with React, Vite, Node.js, Express, Groq (Qwen 3.8 27B), and Google Gemini (Gemini 3.5 Flash)*

---

## 🌟 Executive Summary & How It Works

Large Language Models (LLMs) often generate **hallucinations**—fluent, confident-sounding assertions that are factually incorrect or fabricated. **HalluGuard AI** implements an independent **two-stage critic architecture** to audit, score, and explain hallucinations:

1. **Stage 1 — Generator:** Uses **Qwen 3.8 27B** (via Groq Cloud API) to generate a direct, fluent response to the user's question.
2. **Stage 2 — Critic / Verifier:** Uses **Gemini 3.5 Flash** (via Google Gemini API) prompted with a skeptical epistemic role to isolate atomic propositions and audit whether real-world consensus or reference text supports each assertion.
3. **Stage 3 — Evaluation Dashboard:** Delivers an interactive confidence gauge (0–100%), color-coded claim breakdown (Supported vs. Hallucinated), and academic explanation notes.

```
       [ User Question / Reference Text ]
                      │
                      ▼
        Stage 1: Generator LLM
     (Qwen 3.8 27B via Groq Cloud)
                      │
                      ▼
               Generated Answer
                      │
                      ▼
     Stage 2: Independent Critic Verifier
   (Gemini 3.5 Flash via Google Gemini API)
                      │
                      ▼
    [ Structured Verdict & Confidence Metric ]
    • Supported (Green)
    • Partially Supported (Amber)
    • Unsupported / Hallucinated (Red)
```

---

## 🚀 How to Run the Project (Works 100% Without API Keys!)

HalluGuard AI was specifically engineered with an **Offline Evaluation Engine (Demo Mode)** so that professors, evaluators, and reviewers can run and examine the full project **without needing to enter API keys or register for accounts**.

### Step 1: Clone the Repository
```bash
git clone https://github.com/ilovealanwalkermyfav-glitch/ivan-api-project.git
cd ivan-api-project
```

### Step 2: Launch the Application
Double-click **`run_project.bat`** (or open a terminal and run):
```bash
# Install dependencies
npm run install:all

# Start both Backend (Port 5000) and Frontend (Port 5173)
npm run dev
```

### Step 3: Open in Browser
Visit **[http://localhost:5173](http://localhost:5173)**.

---

## 🧪 Testing Without API Keys (Offline Demo Mode)

By default, the project runs in **Demo Mode**:
- **Zero API keys or external internet connectivity needed.**
- Includes 3 pre-calibrated academic evaluation benchmarks accessible via 1-click chips:
  1. **Historical Fact (Supported — 94% Confidence):** Alexander Graham Bell and the telephone patent.
  2. **Geographical Misconception (Partially Supported — 35% Confidence):** Sydney vs. Canberra as capital of Australia.
  3. **Fabricated Entity (Unsupported / Hallucinated — 8% Confidence):** Fictitious physicist *"Dr. Arjun Mehta"*.
- You can also type any custom question to test the offline heuristic parser!

---

## 🔑 Optional: Running with Live API Keys

To test live queries against active LLM cloud providers:

1. Copy the template in the `server` folder:
   ```bash
   cp server/.env.example server/.env
   ```
2. Open `server/.env` and add free API keys:
   ```env
   # 1. Generator (Groq Cloud)
   LLM_API_PROVIDER=groq
   LLM_API_KEY=your_free_groq_api_key_here
   LLM_MODEL=qwen/qwen3.8-27b

   # 2. Verifier (Google Gemini API)
   LLM_VERIFIER_PROVIDER=gemini
   GEMINI_API_KEY=your_free_gemini_api_key_here
   LLM_VERIFIER_MODEL=gemini-3.5-flash-lite
   ```
   - Free Groq API Key: [console.groq.com/keys](https://console.groq.com/keys)
   - Free Gemini API Key: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
3. Restart the server and toggle **Demo Mode OFF** in the top header.

---

## 🎓 Viva & Academic Evaluation Cheat Sheet

| Question | Evaluation Answer |
| :--- | :--- |
| **"Did you train your own model from scratch?"** | No, sir. This is an *applied API integration architecture*. Training custom LLMs requires millions of dollars in compute; instead, we designed a multi-model cross-provider critic pattern using Groq and Google Gemini with defensive JSON schema validation. |
| **"Why use two different LLM providers instead of one?"** | Cross-provider verification eliminates single-model bias. If a model generates a false answer, asking the same model to review itself often leads to confirmation bias. Using an independent model (Qwen generated, Gemini verified) ensures objective critique. |
| **"What are the limitations of this system?"** | The verifier itself is an LLM; it outputs probabilistic estimations, not absolute philosophical truth. Performance is highest when verified against established historical facts or provided reference evidence. |
| **"How does the system prevent token rate limits?"** | We enforce a strict output token ceiling (`max_tokens: 700`) on the Groq generation stage, keeping expected output safely below provider rate limits while ensuring sufficient detail for verification. |

---

## 📁 Repository Structure

```
ivan-api-project/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Confidence Meter, Answer Card, Claim Highlighting
│   │   ├── data/               # Pre-loaded benchmark evaluation test cases
│   │   └── App.jsx             # Main interactive dashboard
├── server/                     # Node.js + Express Backend Proxy
│   ├── controllers/            # Health, Analysis, and History endpoints
│   ├── services/
│   │   ├── llmService.js       # Groq & Google Gemini dual-provider pipeline
│   │   └── verificationPrompt.js # Strict JSON schema and proposition extraction prompts
│   ├── data/                   # Persistent local query history
│   └── .env.example            # Environment template
├── PRD.md                      # Full Project Requirements Document
├── run_project.bat             # 1-Click Launch Script for Windows
└── README.md                   # Project Documentation
```

---

## 📜 Academic Disclaimer
*This project is built for academic evaluation in a college minor project curriculum. Verification metrics and confidence scores are heuristic approximations generated by AI models and should not be used as infallible arbiters of truth in safety-critical domains.*