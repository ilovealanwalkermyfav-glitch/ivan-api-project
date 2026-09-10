/**
 * Input validators and sanitizers
 */

const MAX_INPUT_CHARS = parseInt(process.env.MAX_INPUT_CHARS || "1500", 10);

function sanitizeText(input) {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, MAX_INPUT_CHARS);
}

function validateQuestion(question) {
  if (!question || typeof question !== "string") {
    return { valid: false, error: "Question is required and must be text." };
  }
  const trimmed = question.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "Question must be at least 3 characters long." };
  }
  if (trimmed.length > MAX_INPUT_CHARS) {
    return { valid: false, error: `Question exceeds maximum limit of ${MAX_INPUT_CHARS} characters.` };
  }
  return { valid: true, sanitized: trimmed };
}

function validateVerifyInput(question, answer, referenceText) {
  const qVal = validateQuestion(question);
  if (!qVal.valid) return qVal;

  if (!answer || typeof answer !== "string" || answer.trim().length < 2) {
    return { valid: false, error: "Answer is required and must be text." };
  }

  return {
    valid: true,
    question: qVal.sanitized,
    answer: sanitizeText(answer),
    referenceText: sanitizeText(referenceText || "")
  };
}

module.exports = {
  sanitizeText,
  validateQuestion,
  validateVerifyInput,
  MAX_INPUT_CHARS
};
