/**
 * Defensive JSON parsing utilities for LLM responses
 */

function extractAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return { success: false, data: null, error: "Empty response text" };
  }

  let cleaned = rawText.trim();

  // Strip markdown code fences if present (```json ... ``` or ``` ...)
  const fenceRegex = /```(?:json)?\s*([\s\S]*?)\s*```/i;
  const match = fenceRegex.exec(cleaned);
  if (match && match[1]) {
    cleaned = match[1].trim();
  }

  // Attempt direct JSON.parse
  try {
    const parsed = JSON.parse(cleaned);
    return { success: true, data: normalizeVerificationSchema(parsed) };
  } catch (err) {
    // Try finding the first '{' and last '}'
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const sliced = cleaned.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(sliced);
        return { success: true, data: normalizeVerificationSchema(parsed) };
      } catch (innerErr) {
        // Attempt minor repairs: replace unescaped control chars, trailing commas
        try {
          const repaired = cleaned
            .substring(firstBrace, lastBrace + 1)
            .replace(/,\s*([\]}])/g, "$1") // remove trailing commas
            .replace(/[\u0000-\u001F]+/g, " "); // remove control characters
          const parsed = JSON.parse(repaired);
          return { success: true, data: normalizeVerificationSchema(parsed) };
        } catch (repairErr) {
          return { success: false, data: null, error: repairErr.message };
        }
      }
    }
    return { success: false, data: null, error: err.message };
  }
}

/**
 * Ensures the parsed object adheres to the expected Verification schema
 */
function normalizeVerificationSchema(obj) {
  if (!obj || typeof obj !== "object") {
    return createFallbackVerification("Malformed verification payload");
  }

  let verdict = obj.verdict || "Partially Supported";
  const validVerdicts = [
    "Supported",
    "Mostly Supported",
    "Partially Supported",
    "Unsupported / Hallucinated",
    "Unsupported"
  ];
  if (!validVerdicts.some(v => v.toLowerCase() === String(verdict).toLowerCase())) {
    verdict = "Partially Supported";
  }

  let confidence = parseInt(obj.confidence, 10);
  if (isNaN(confidence) || confidence < 0) confidence = 50;
  if (confidence > 100) confidence = 100;

  const supported_claims = Array.isArray(obj.supported_claims)
    ? obj.supported_claims.map(String).filter(Boolean)
    : [];

  const potentially_hallucinated_claims = Array.isArray(obj.potentially_hallucinated_claims)
    ? obj.potentially_hallucinated_claims.map(String).filter(Boolean)
    : Array.isArray(obj.hallucinated_claims)
    ? obj.hallucinated_claims.map(String).filter(Boolean)
    : [];

  const explanation = typeof obj.explanation === "string" && obj.explanation.trim().length > 0
    ? obj.explanation.trim()
    : "Analysis completed. Review the individual claim breakdown for details.";

  const technical_notes = typeof obj.technical_notes === "string"
    ? obj.technical_notes.trim()
    : undefined;

  return {
    verdict,
    confidence,
    supported_claims,
    potentially_hallucinated_claims,
    explanation,
    technical_notes,
    disclaimer: "This is an AI-generated estimate, not a guaranteed measure of truth."
  };
}

function createFallbackVerification(reason = "Unable to reliably verify claims") {
  return {
    verdict: "Unable to Verify",
    confidence: 50,
    supported_claims: [],
    potentially_hallucinated_claims: [],
    explanation: `Verification could not be conclusively determined (${reason}). Review the generated answer with external primary sources.`,
    technical_notes: "The secondary verification pass encountered an unparseable response and gracefully triggered safe fallback handling.",
    disclaimer: "This is an AI-generated estimate, not a guaranteed measure of truth."
  };
}

module.exports = {
  extractAndParseJSON,
  normalizeVerificationSchema,
  createFallbackVerification
};
