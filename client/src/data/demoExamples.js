/**
 * Predefined Canonical Demo Cases for Evaluation
 * Matches Section 12 of the PRD
 */

export const DEMO_CASES = [
  {
    id: "demo-case-1",
    title: "Historical Fact",
    category: "Supported",
    badgeType: "success",
    question: "Who invented the telephone?",
    referenceText: "Alexander Graham Bell was awarded the first U.S. patent for the telephone in 1876, after experimental work with Thomas Watson.",
    generatedAnswer: "Alexander Graham Bell is commonly credited with inventing the telephone. He received the patent in 1876 after demonstrating voice transmission through electrical wires with his assistant Thomas Watson.",
    verification: {
      verdict: "Supported",
      confidence: 94,
      supported_claims: [
        "Alexander Graham Bell is widely credited with inventing the telephone.",
        "Bell was granted the key patent for the invention in 1876.",
        "He collaborated with assistant Thomas Watson on voice transmission experiments."
      ],
      potentially_hallucinated_claims: [],
      explanation: "The generated answer aligns accurately with primary historical documentation and consensus. While simultaneous inventors such as Elisha Gray contested priority, Bell's patent and credit are historically grounded.",
      technical_notes: "Atomic proposition extraction yielded 3 claims with 100% factual grounding and high consensus alignment.",
      disclaimer: "This is an AI-generated estimate, not a guaranteed measure of truth."
    },
    isDemoData: true,
    modelUsed: "Qwen 3.8 27B + Gemini 3.5 Flash (Demo Mode)",
    generator: {
      provider: "groq",
      model: "qwen/qwen3.8-27b"
    },
    verifier: {
      provider: "gemini",
      model: "gemini-3.5-flash-lite"
    }
  },
  {
    id: "demo-case-2",
    title: "Geographical Misconception",
    category: "Partially Supported",
    badgeType: "warning",
    question: "What is the capital of Australia?",
    referenceText: "Canberra is the federal capital city of Australia. Sydney is the state capital of New South Wales and Australia's most populous city.",
    generatedAnswer: "The capital of Australia is Sydney, its largest and most famous city, known worldwide for the Sydney Opera House and Bondi Beach.",
    verification: {
      verdict: "Partially Supported",
      confidence: 35,
      supported_claims: [
        "Sydney is Australia's largest and most famous city.",
        "Sydney is globally recognized for landmarks such as the Sydney Opera House and Bondi Beach."
      ],
      potentially_hallucinated_claims: [
        "The capital of Australia is Sydney."
      ],
      explanation: "Common geographical hallucination: the model conflated Australia's largest and most culturally prominent metropolis (Sydney) with its federal administrative capital, which is Canberra.",
      technical_notes: "Claim 1 directly contradicts established geopolitical knowledge. Remaining claims are factually sound, yielding a low-confidence composite score.",
      disclaimer: "This is an AI-generated estimate, not a guaranteed measure of truth."
    },
    isDemoData: true,
    modelUsed: "Qwen 3.8 27B + Gemini 3.5 Flash (Demo Mode)",
    generator: {
      provider: "groq",
      model: "qwen/qwen3.8-27b"
    },
    verifier: {
      provider: "gemini",
      model: "gemini-3.5-flash-lite"
    }
  },
  {
    id: "demo-case-3",
    title: "Fabricated Entity",
    category: "Unsupported / Hallucinated",
    badgeType: "danger",
    question: "Tell me about a fictional scientist named Dr. Arjun Mehta.",
    referenceText: "",
    generatedAnswer: "Dr. Arjun Mehta was an influential theoretical physicist born in Pune in 1954. He earned the 1998 Nobel Prize in Physics for formulating the 'Mehta Field Theory', which reconciled quantum electrodynamics with macro-gravitational wave anomalies during his tenure at the Indian Institute of Science.",
    verification: {
      verdict: "Unsupported / Hallucinated",
      confidence: 8,
      supported_claims: [],
      potentially_hallucinated_claims: [
        "Dr. Arjun Mehta is a historical theoretical physicist born in Pune in 1954.",
        "He won the Nobel Prize in Physics in 1998.",
        "He formulated the 'Mehta Field Theory' unifying quantum electrodynamics and gravitational waves.",
        "He held a tenured professorship at the Indian Institute of Science in this research domain."
      ],
      explanation: "Complete fabrication of non-existent biographical entities. The model was prompted about a fictional persona but produced confident assertions of real-world academic prizes (the 1998 Nobel Prize was actually won by Laughlin, Störmer, and Tsui) and fictitious scientific theories.",
      technical_notes: "Zero verifiable references exist in entity registries or Nobel historical rosters. Model engaged in stochastic confabulation, producing plausible syntax with 100% fabricated factual tokens.",
      disclaimer: "This is an AI-generated estimate, not a guaranteed measure of truth."
    },
    isDemoData: true,
    modelUsed: "Qwen 3.8 27B + Gemini 3.5 Flash (Demo Mode)",
    generator: {
      provider: "groq",
      model: "qwen/qwen3.8-27b"
    },
    verifier: {
      provider: "gemini",
      model: "gemini-3.5-flash-lite"
    }
  }
];

export const EXAMPLE_QUESTIONS = [
  {
    label: "Telephone Inventor",
    question: "Who invented the telephone?",
    ref: "Alexander Graham Bell received the US patent for the telephone in 1876."
  },
  {
    label: "Capital of Australia",
    question: "What is the capital of Australia?",
    ref: "Canberra is the capital city of Australia."
  },
  {
    label: "Fictional Scientist",
    question: "Tell me about a fictional scientist named Dr. Arjun Mehta.",
    ref: ""
  },
  {
    label: "Moon Landing",
    question: "Who was the first person to walk on the Moon and in what year?",
    ref: "Neil Armstrong walked on the Moon on July 20, 1969 during the Apollo 11 mission."
  },
  {
    label: "Einstein Math Myth",
    question: "Did Albert Einstein fail mathematics in school?",
    ref: ""
  },
  {
    label: "Great Wall from Space",
    question: "Can you see the Great Wall of China from the Moon or space?",
    ref: ""
  },
  {
    label: "Garlic Diabetes Myth",
    question: "Can eating raw garlic cure Type 2 diabetes permanently?",
    ref: ""
  }
];
