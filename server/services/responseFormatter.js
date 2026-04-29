/**
 * responseFormatter.js
 * Ensures all assistant responses strictly follow the PRD's 6-point structure.
 */

/**
 * Formats raw response data into the standard 6-point structure.
 * @param {object} rawData - The response data from flowService/logicEngine
 * @param {object} user_profile - User profile for final adaptive tweaks
 * @returns {object} - { title, explanation, steps, example, next, confirmation }
 */
const formatResponse = (rawData) => {
  // Pure formatting layer: Normalize fields and ensure strict 6-point structure
  return {
    title: String(rawData.title || "### Election Assistant").trim(),
    explanation: String(rawData.explanation || "Helping you understand the election process.").trim(),
    steps: Array.isArray(rawData.steps) ? rawData.steps : [],
    example: String(rawData.example || "").trim(),
    next_suggestion: String(rawData.next_suggestion || rawData.next || "What else would you like to know?").trim(),
    confirmation: String(rawData.confirmation || "Did this make sense?").trim()
  };
};

module.exports = {
  formatResponse
};
