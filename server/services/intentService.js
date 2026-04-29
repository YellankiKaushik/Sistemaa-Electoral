/**
 * intentService.js
 * Identifies user intent based on keyword and pattern matching.
 */

const intents = {
  CONFUSION: 'confusion',
  QUESTION: 'question',
  BASICS: 'basics',
  TIMELINE: 'timeline',
  PROCESS: 'process',
  ACTION_GUIDANCE: 'action_guidance',
  IMPORTANCE: 'importance',
  FLOW_TRANSITION: 'flow_transition'
};

const keywordMap = {
  [intents.CONFUSION]: [
    "don't understand", "dont understand", "confusing", "lost", "what?", "too complex", 
    "simplify", "stuck", "not clear", "help", "don't get it", "dont get it", "difficult"
  ],
  [intents.BASICS]: [
    "what is", "meaning of", "election basics", "overview", "intro", 
    "fundamentals", "basics", "purpose"
  ],
  [intents.TIMELINE]: [
    "when", "dates", "schedule", "stages", "phase", "start to finish", "steps of cycle", 
    "timeline", "calendar", "how long", "period"
  ],
  [intents.PROCESS]: [
    "how to", "procedure", "system", "step by step", "mechanism", "how it works", 
    "method", "process", "voting step", "inside the booth"
  ],
  [intents.ACTION_GUIDANCE]: [
    "what should i do", "how do i vote", "where to go", "documents", "id proof", 
    "registration", "voter id", "requirements", "eligibility", "prepare"
  ],
  [intents.IMPORTANCE]: [
    "importance", "important", "why vote", "value", "impact", "reason to vote"
  ],
  [intents.FLOW_TRANSITION]: [
    "next", "continue", "go on", "proceed", "next step"
  ],
  [intents.QUESTION]: [
    "can i", "is it possible", "who", "where", "how can", "is there", "any way", 
    "can you", "what is the", "tell me who", "tell me about", "explain", "?"
  ]
};

/**
 * Detects the primary intent from the user message.
 * New Priority: confusion > (basics/timeline/process/action) > question
 * @param {string} message - The user input text
 * @returns {object} - { intent: "..." }
 */
const detectIntent = (message) => {
  const lowerMessage = (message || "").toLowerCase();

  // 1. Confusion (Highest Priority)
  if (keywordMap[intents.CONFUSION].some(kw => lowerMessage.includes(kw))) {
    return { intent: intents.CONFUSION };
  }

  // 2. Specific Learning Intents (Middle Priority)
  const learningIntents = [
    intents.BASICS, 
    intents.TIMELINE, 
    intents.PROCESS, 
    intents.ACTION_GUIDANCE,
    intents.IMPORTANCE,
    intents.FLOW_TRANSITION
  ];

  for (const intent of learningIntents) {
    if (keywordMap[intent].some(kw => lowerMessage.includes(kw))) {
      return { intent: intent };
    }
  }

  // 3. Question (Lowest Priority / Fallback)
  // We check for question keywords OR if it ends with a question mark
  if (keywordMap[intents.QUESTION].some(kw => lowerMessage.includes(kw)) || lowerMessage.includes('?')) {
    return { intent: intents.QUESTION };
  }

  // Final Fallback: Treat as a generic question for AI processing
  return { intent: intents.QUESTION };
};

module.exports = {
  detectIntent,
  intents
};
