/**
 * intentService.js
 * Identifies user intent via keyword groups (partial includes, lowercase normalization).
 */

const intents = {
  UNKNOWN: 'unknown',
  CONFUSION: 'confusion',
  BASICS: 'basics',
  TIMELINE: 'timeline',
  PROCESS: 'process',
  ACTION_GUIDANCE: 'action_guidance',
  IMPORTANCE: 'importance',
  FLOW_TRANSITION: 'flow_transition'
};

/** Routing priority when multiple explicit intents match (strongest tier wins). */
const EXPLICIT_PRIORITY = [
  intents.IMPORTANCE,
  intents.PROCESS,
  intents.TIMELINE,
  intents.BASICS,
  intents.ACTION_GUIDANCE
];

const keywordMap = {
  [intents.CONFUSION]: [
    "don't understand",
    "dont understand",
    "confusing",
    "lost",
    "too complex",
    "simplify",
    "stuck",
    "not clear",
    "don't get it",
    "dont get it",
    "difficult",
    "doesn't make sense",
    "doesnt make sense",
    "i'm confused",
    "im confused",
    "confused",
    "help me understand",
    "hard to follow",
    "not following",
    "not getting",
    "too confusing",
    "what is going on",
    "make sense",
    "??",
    "what?"
  ],
  [intents.BASICS]: [
    "tell me about elections",
    "tell me about election",
    "tell me about voting",
    "about elections",
    "about election",
    "election basics",
    "what is election",
    "what are elections",
    "what's an election",
    "what is voting",
    "meaning of election",
    "meaning of voting",
    "overview",
    "intro",
    "introduction",
    "fundamentals",
    "basics",
    "purpose",
    "explain election",
    "explain voting",
    "explain elections",
    "explain the election",
    "election overview",
    "what election",
    "define election",
    "election definition",
    "election"
  ],
  [intents.TIMELINE]: [
    "timeline",
    "when",
    "dates",
    "schedule",
    "stages",
    "phase",
    "start to finish",
    "steps of cycle",
    "calendar",
    "how long",
    "period",
    "election schedule",
    "election dates",
    "when is",
    "when are",
    "key dates",
    "polling day",
    "election day timing",
    "timeframe",
    "deadlines election",
    "election calendar"
  ],
  [intents.PROCESS]: [
    "how voting works",
    "how elections work",
    "how election works",
    "the voting process",
    "voting process",
    "election process",
    "how to vote",
    "procedure",
    "system",
    "step by step",
    "mechanism",
    "how it works",
    "method",
    "process",
    "voting step",
    "inside the booth",
    "ballot process",
    "casting vote",
    "casting a vote",
    "polling process",
    "election procedure",
    "pls tell voting process",
    "please tell voting process",
    "tell voting process",
    "explain voting process",
    "explain the voting process",
    "explain election process",
    "walk me through",
    "walk through voting"
  ],
  [intents.ACTION_GUIDANCE]: [
    "what should i do",
    "how do i vote",
    "where to go",
    "documents",
    "id proof",
    "registration",
    "voter id",
    "requirements",
    "eligibility",
    "prepare",
    "how to register",
    "where to vote",
    "polling station",
    "booth",
    "evm",
    "what do i need",
    "documents needed",
    "vote",
    "voting",
    "ballot",
    "cast my vote",
    "go vote"
  ],
  [intents.IMPORTANCE]: [
    "importance",
    "important",
    "why vote",
    "why voting",
    "value",
    "impact",
    "reason to vote",
    "reasons to vote",
    "why should i vote",
    "does my vote matter",
    "matter to vote",
    "significance",
    "why elections matter",
    "why it matters",
    "why does voting",
    "benefit of voting"
  ],
  [intents.FLOW_TRANSITION]: [
    "next step",
    "next",
    "continue",
    "go on",
    "proceed",
    "move on",
    "keep going",
    "what's next",
    "whats next"
  ]
};

/**
 * Partial match: multi-word or longer phrases use substring include; short single tokens use word boundaries.
 * @param {string} lowerMessage
 * @param {string} phrase
 */
const phraseMatches = (lowerMessage, phrase) => {
  if (!phrase) return false;
  const p = phrase.trim();
  if (!p) return false;
  if (p.includes(" ") || p.length >= 5) {
    return lowerMessage.includes(p);
  }
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`).test(
    lowerMessage
  );
};

/**
 * Strongest explicit match: pick intent by tier (importance > process > timeline > basics > actions),
 * then longest matched phrase within that tier.
 * @param {string} lowerMessage
 * @returns {string|null}
 */
const pickExplicitIntent = (lowerMessage) => {
  let bestIntent = null;
  let bestPriorityIdx = Infinity;
  let bestPhraseLen = -1;

  for (let p = 0; p < EXPLICIT_PRIORITY.length; p++) {
    const intentKey = EXPLICIT_PRIORITY[p];
    const phrases = keywordMap[intentKey] || [];
    for (const phrase of phrases) {
      if (!phrase) continue;
      if (phraseMatches(lowerMessage, phrase)) {
        const len = phrase.length;
        if (
          p < bestPriorityIdx ||
          (p === bestPriorityIdx && len > bestPhraseLen)
        ) {
          bestIntent = intentKey;
          bestPriorityIdx = p;
          bestPhraseLen = len;
        }
      }
    }
  }

  return bestIntent;
};

const matchesAnyPhrase = (lowerMessage, intentKey) =>
  (keywordMap[intentKey] || []).some((phrase) =>
    phrase && phraseMatches(lowerMessage, phrase)
  );

/**
 * Detects primary intent.
 * Priority: confusion > explicit (importance > process > timeline > basics > actions) > flow_transition > unknown.
 * @param {string} message - The user input text
 * @returns {object} - { intent: "..." }
 */
const detectIntent = (message) => {
  const lowerMessage = (message || "").toLowerCase().trim();

  if (!lowerMessage) {
    return { intent: intents.UNKNOWN };
  }

  if (matchesAnyPhrase(lowerMessage, intents.CONFUSION)) {
    return { intent: intents.CONFUSION };
  }

  const explicit = pickExplicitIntent(lowerMessage);
  if (explicit) {
    return { intent: explicit };
  }

  if (matchesAnyPhrase(lowerMessage, intents.FLOW_TRANSITION)) {
    return { intent: intents.FLOW_TRANSITION };
  }

  return { intent: intents.UNKNOWN };
};

module.exports = {
  detectIntent,
  intents
};
