/**
 * confusionService.js
 * Detects and handles user confusion to ensure recovery and engagement.
 */

const normalize = (message) =>
  String(message ?? "")
    .toLowerCase()
    .trim();

/** Includes matching after lowercase normalization. */
const CONFUSION_SIGNAL_PHRASES = [
  "i don't understand",
  "dont understand",
  "don't understand",
  "still not clear",
  "still not crystal",
  "not clear yet",
  "still confused",
  "this is confusing",
  "so confusing",
  "too confusing",
  "explain again",
  "explain once more",
  "say again",
  "repeat that",
  "makes no sense",
  "doesn't make sense",
  "doesnt make sense",
  "don't get it",
  "dont get it",
  "what??",
  "???",
  "too complex",
  "lost",
  "stuck",
  "confusing",
  "too much info",
  "hard to follow",
];

const hasConfusionSignal = (message) => {
  const lower = normalize(message);
  if (!lower) return false;
  return CONFUSION_SIGNAL_PHRASES.some((phrase) => lower.includes(phrase));
};

/**
 * Roughly answers "Did this help?" negatively → alternate / options.
 */
const isNegativeHelpFeedback = (message) => {
  const lower = normalize(message);
  if (!lower) return false;
  const compactNoPunct = lower.replace(/[!?.]+$/g, "").trim();
  if (["no", "nope", "nah", "not really"].includes(compactNoPunct.replace(/\s+/g, " ")))
    return true;
  return [
    "still not clear",
    "still confused",
    "doesn't help",
    "doesnt help",
    "not helping",
    "still don't get",
    "still dont get",
    "not clear yet",
  ].some((p) => lower.includes(p));
};

const LEVEL1_OPENERS = [
  "Let me put it more simply:",
  "Here's another way to say it:",
];

const LEVEL2_CORE = [
  "Think of voting as marking your choice privately, once, when it's time to vote.",
  "In one line: you check in, prove who you are, then record your vote in private.",
];

const stripForSignature = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 120);

/**
 * Applies simplified copy only when routing intent is `confusion` (logicEngine enforces precedence).
 * @param {string} message - User input (for future use / tracing)
 * @param {object} response - Structured response (`intent`, `explanation`, …)
 * @param {{ forcedLevel?: number, variantSeed?: number, lastConfusionExplanation?: string }} opts - Level (1–2), variant flip, dedupe anchor
 */
const handleConfusion = (message, response, opts = {}) => {
  if (!response || response.intent !== "confusion") {
    return response;
  }

  const simplified = JSON.parse(JSON.stringify(response));
  const level = Math.min(
    Math.max(Number(opts.forcedLevel) || 1, 1),
    2
  );
  simplified.confusionLevel = level;

  const variantSeed = Number(opts.variantSeed) || 0;
  const openerPick = LEVEL1_OPENERS[variantSeed % LEVEL1_OPENERS.length];
  const ultraPick =
    LEVEL2_CORE[(variantSeed + level) % LEVEL2_CORE.length];

  const lastSig = stripForSignature(opts.lastConfusionExplanation || "");

  if (level === 1) {
    const raw = simplified.explanation || "";
    let rephrased = raw
      .replace(/comprehensive|implementation|structure/gi, "main steps")
      .replace(/fundamental|essential|core/gi, "basic")
      .split(".")
      .filter(Boolean)
      .slice(0, 2)
      .join(".")
      .trim();
    if (rephrased && !rephrased.endsWith(".")) rephrased += ".";
    if (!rephrased) {
      rephrased =
        "Elections mean people choose leaders by voting once per contest, fairly and peacefully.";
    }

    let block = `${openerPick} ${rephrased}`;
    if (stripForSignature(block) === lastSig) {
      block = `${LEVEL1_OPENERS[(variantSeed + 1) % LEVEL1_OPENERS.length]} ${rephrased}`;
    }

    const baseTitle = String(simplified.title || "")
      .replace(/^#{1,3}\s*/u, "")
      .replace(/^💡[^:]*:\s*/u, "")
      .replace(/^🎯[^:]*:\s*/u, "")
      .trim();
    simplified.title = `💡 Simpler explanation: ${baseTitle}`;
    simplified.explanation = block;
    simplified.example = simplified.example?.trim?.() ? simplified.example : "";
  } else {
    let block =
      `${ultraPick}\n\n` +
      `**Options**\n` +
      `- Continue the guide — type **next** or **continue**.\n` +
      `- Or ask about a **different topic** (timeline, process, importance, etc.).`;

    if (stripForSignature(block) === lastSig) {
      const alt =
        LEVEL2_CORE[
        (variantSeed + LEVEL2_CORE.length + 1) % LEVEL2_CORE.length
        ];
      block =
        `${alt}\n\n` +
        `**Options**\n` +
        `- **Continue**: type **next** or **continue**.\n` +
        `- **Different topic**: ask about timelines, registering, or what to bring to vote.\n`;
    }

    const baseTitle = String(simplified.title || "")
      .replace(/^#{1,3}\s*/u, "")
      .replace(/^💡[^:]*:\s*/u, "")
      .replace(/^🎯[^:]*:\s*/u, "")
      .trim();
    simplified.title = `🎯 Super simple + what you can do: ${baseTitle}`;
    simplified.explanation = block;
    if (!simplified.example || !String(simplified.example).trim()) {
      simplified.example =
        "Whenever you're ready, say **next** to move on—or name what still feels fuzzy.";
    }
  }

  simplified.next_suggestion =
    level === 1
      ? "You can type **next** to continue the guide or say what's still fuzzy."
      : "Choose **next** / **continue**, or switch to another election topic.";
  simplified.confirmation = "Did this help?";
  simplified.isConfusionRecovered = true;
  simplified._confusionVariantNext = variantSeed + 1;

  return simplified;
};

/**
 * Minimal flow escape: advance without confusion wording (lets user leave recovery).
 */
const isBareGuidedContinuation = (message) => {
  const t = normalize(message).replace(/[!?.]+$/g, "").trim();
  if (!t) return false;
  const allowed = ["next", "continue", "go on", "proceed", "next step"];
  return allowed.some((kw) => t === kw);
};

module.exports = {
  handleConfusion,
  hasConfusionSignal,
  isNegativeHelpFeedback,
  isBareGuidedContinuation,
};
