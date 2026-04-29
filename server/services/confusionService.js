/**
 * confusionService.js
 * Detects and handles user confusion to ensure recovery and engagement.
 */

/**
 * Handles user confusion by simplifying and rephrasing the response.
 * @param {string} message - The user's input message
 * @param {object} response - The current response object (structured)
 * @returns {object} - The modified response object
 */
const handleConfusion = (message, response) => {
  const lowerMessage = (message || "").toLowerCase();
  
  // List of explicit confusion signals
  const confusionSignals = [
    "don't understand", "dont understand", "confusing", "lost", "stuck", 
    "too complex", "explain again", "what?", "too much info"
  ];

  const isUserConfused = confusionSignals.some(signal => lowerMessage.includes(signal)) || response.intent === 'confusion';

  if (!isUserConfused) {
    return response;
  }

  // Clone to avoid mutation
  const simplified = JSON.parse(JSON.stringify(response));
  
  // Escalation tracking (stateless via object flags)
  const level = (response.confusionLevel || 0) + 1;
  simplified.confusionLevel = level;

  // Title update
  simplified.title = level === 1 
    ? `💡 Let's simplify this: ${simplified.title}`
    : `🎯 Essential Concept: ${simplified.title}`;

  // Strategy based on level
  if (level === 1) {
    // Level 1: Rephrase and truncate
    const rephrased = (simplified.explanation || "")
      .replace(/comprehensive|implementation|structure/gi, "main parts")
      .replace(/fundamental|essential|core/gi, "basic")
      .split('.').slice(0, 2).join('.') + ".";
    
    simplified.explanation = `Let me explain that differently. In short: ${rephrased}`;
  } else {
    // Level 2+: Ultra-simple 1-sentence summary / Example focused
    simplified.explanation = "Let's strip away the details. Basically, this is about helping you understand the process step-by-step.";
    if (!simplified.example) {
      simplified.example = "Think of it like a simple guide: follow the markers to reach the end of the path.";
    }
  }

  // Recovery options including 'continue'
  simplified.next_suggestion = "We can try another explanation, move to a new topic, or just continue with the guide.";
  simplified.confirmation = "Does this simplified view help you move forward?";
  simplified.isConfusionRecovered = true;

  return simplified;
};

module.exports = {
  handleConfusion
};
