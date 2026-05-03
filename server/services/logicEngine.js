const intentService = require('./intentService');
const flowService = require('./flowService');
const personalizationService = require('./personalizationService');
const confusionService = require('./confusionService');
const apiFallback = require('./apiFallback');
const responseFormatter = require('./responseFormatter');
const translationService = require('./translationService');

/**
 * logicEngine.js
 * Central engine to process user messages and coordinate services.
 */

/**
 * Main function to process incoming messages
 * @param {string} message - User input text
 * @param {object} user_profile - User metadata (level, type, mode)
 * @param {number} current_step - Current progress in guided flow
 * @returns {object} Structured response
 */
const processMessage = async (message, user_profile = {}, current_step = 1, user_language = null) => {
  const msgTrimmed = String(message || "").trim();
  const lowerMessage = msgTrimmed.toLowerCase();

  // 1. STEP VALIDATION & CLAMPING
  if (typeof current_step !== "number" || isNaN(current_step)) {
    current_step = 1;
  }
  current_step = Math.min(Math.max(current_step, 1), 5);

  // 2. PROFILE & LANGUAGE PREP
  const profile = {
    level: user_profile.level || 'beginner',
    type: user_profile.type || 'first_time',
    mode: user_profile.mode || 'guided',
    ...user_profile
  };

  const rawUserLang = user_language != null ? String(user_language).trim() : "";
  const userLangNorm = rawUserLang === "" ? null : translationService.normalizeLangCode(rawUserLang);

  const earlyReturn = async (title, explanation) => {
    let result = {
      title,
      explanation,
      steps: [],
      example: "",
      next_suggestion: "Let’s continue learning step by step.",
      confirmation: "Ready to move forward?",
      next_step: current_step,
      current_step: current_step,
      intent: 'unknown',
      confusionLevel: 0,
      confusionVariant: 0,
      lastConfusionExplanation: '',
      mode: profile.mode,
      status: 'success',
      language: userLangNorm || "en"
    };

    if (result.language !== "en") {
      const fields = [result.title, result.explanation, result.next_suggestion, result.confirmation];
      const translated = await translationService.translateMultiple(fields, result.language);
      [result.title, result.explanation, result.next_suggestion, result.confirmation] = translated;
    }
    return result;
  };

  // 3. BASIC VALIDATION
  if (!msgTrimmed || msgTrimmed === "...") {
    return await earlyReturn("Let’s get started!", "What would you like to learn about elections today?");
  }
  if (msgTrimmed.length > 300) {
    return await earlyReturn("That’s a great question!", "It's a bit long for me to process at once. Could you ask it in a simpler way so we can explore it step by step?");
  }

  // 4. RESTART DETECTION
  const isRestart = /\b(restart|start over|reset)\b/i.test(msgTrimmed);
  if (isRestart) {
    return {
      title: "Let’s start fresh",
      explanation: "We’ll begin from the basics of the election process.",
      next_suggestion: "Type 'next' to begin.",
      confirmation: "Ready to restart?",
      current_step: 1,
      next_step: 1,
      status: 'success',
      language: userLangNorm || "en"
    };
  }
  // 6. REPEAT DETECTION
  const isRepeated = profile?.last_message && profile.last_message === msgTrimmed;
  if (isRepeated) {
    return {
      title: "Let’s move forward",
      explanation: "We’ve already covered that. Let’s continue to the next step.",
      next_suggestion: "Type 'next' or ask something new.",
      confirmation: "Shall we continue?",
      current_step,
      next_step: current_step,
      status: 'success',
      language: userLangNorm || "en"
    };
  }



  const storedConfusionLevel = Number(profile.confusionLevel) || 0;
  const confusionVariantSeed = Number(profile.confusionVariant) || 0;
  const lastConfusionExplanation = profile.lastConfusionExplanation || "";

  // 5. HELP DETECTION
  if (lowerMessage === 'help') {
    const helpResponse = {
      title: "### How to Use This Assistant",
      explanation: "This assistant helps you understand and navigate the election process with ease.\n\n" +
        "• **What you can ask**: You can ask about voting requirements, registration steps, or election timelines.\n" +
        "• **How to navigate**: Use the guided learning path by typing **'next'**, or simply ask any question at any time.",
      example: "You can learn step-by-step about elections by following the guide, or ask questions like 'What is election?' or 'How to vote?'",
      next_suggestion: "To get started with the guided tour, just type **'next'**.",
      confirmation: "I'm here to help you become an informed voter!"
    };

    let finalHelpResponse = {
      ...responseFormatter.formatResponse(helpResponse),
      current_step,
      next_step: current_step,
      intent: 'help',
      mode: profile.mode,
      status: 'success',
      language: effectiveOutputLang
    };

    if (effectiveOutputLang !== "en") {
      const fields = [finalHelpResponse.title, finalHelpResponse.explanation, finalHelpResponse.next_suggestion, finalHelpResponse.confirmation];
      const translated = await translationService.translateMultiple(fields, effectiveOutputLang);
      [finalHelpResponse.title, finalHelpResponse.explanation, finalHelpResponse.next_suggestion, finalHelpResponse.confirmation] = translated;
    }
    return finalHelpResponse;
  }

  // 3. LANGUAGE DETECTION & TRANSLATION
  let detectedLang = await translationService.detectLanguage(message);
  const hinglishKeywords = ["kya", "kaise", "hai", "karo", "batao", "samjhao"];

  const isHinglish = hinglishKeywords.some(word =>
    new RegExp(`\\b${word}\\b`).test(lowerMessage)
  );

  // 🔥 FORCE correct detection for Hinglish
  if (isHinglish && detectedLang === "en") {
    detectedLang = "hi";
  }

  let normalizedDetected = translationService.normalizeLangCode(detectedLang);

  // FINAL OUTPUT LANGUAGE PRIORITY
  const effectiveOutputLang =
    userLangNorm || normalizedDetected || "en";

  let translatedInput = message;
  if (normalizedDetected !== "en") {
    translatedInput = await translationService.translateToEnglish(message);
  }
  translatedInput = String(translatedInput || "").trim();
  const translatedLower = translatedInput.toLowerCase();

  // 4. NOISE DETECTION (POST-TRANSLATION)
  const isNoisyInput =
    /^[^a-z]*$/.test(translatedLower) ||
    (translatedLower.length > 15 && !/[a-z]{3,}/.test(translatedLower));

  const isQuestion = /^(what|how|why|when|who)\b/i.test(translatedLower);

  if (isNoisyInput && !isQuestion) {
    return {
      title: "Let’s keep things clear",
      explanation: "I couldn’t understand that. Try asking about elections, voting, or the process.",
      next_suggestion: "Ask a clear question or type 'next' to continue.",
      confirmation: "Would you like to continue?",
      current_step,
      next_step: current_step,
      status: 'success',
      language: effectiveOutputLang
    };
  }

  // 5. TOXIC CHECKS (POST-TRANSLATION)
  const toxicWords = ['abuse', 'fuck', 'shit', 'stupid', 'idiot', 'dumb', 'asshole', 'bitch', 'crap'];
  const isToxic = toxicWords.some(w => new RegExp(`\\b${w}\\b`).test(translatedLower));
  if (isToxic) {
    return await earlyReturn("Let’s keep things focused", "Ask about elections or use the guide.");
  }
  // Topic matching (re-evaluation on translated message for routing)
  const keyTopics = ['election', 'voting', 'process', 'timeline', 'importance'];
  let matchedTopics = [];
  for (const topic of keyTopics) {
    const topicRegex = new RegExp(`\\b${topic}\\b`, 'gi');
    const matches = translatedLower.match(topicRegex);
    if (matches) {
      const idx = translatedLower.search(new RegExp(`\\b${topic}\\b`, 'i'));
      matchedTopics.push({ topic, index: idx, count: matches.length });
    }
  }

  let selectedTopic = null;
  let routingIntent = intentService.detectIntent(translatedInput).intent;



  // 1. HARD CLARIFICATION (Multiple Topics)
  const isPhrase = /\b(election|voting)\b.*\b(process|system|procedure)\b/i.test(translatedLower);

  if (matchedTopics.length > 1 && !isPhrase) {
    const uniqueTopics = [...new Set(matchedTopics.map(m => m.topic))];
    return {
      title: "Just to clarify...",
      explanation: `You're asking about multiple topics (${uniqueTopics.join(", ")}). Which one would you like to start with?`,
      next_suggestion: `Try: ${uniqueTopics.join(" / ")}`,
      confirmation: "Choose a topic to continue.",
      current_step,
      next_step: current_step,
      status: 'success',
      language: effectiveOutputLang
    };
  }

  const isNavigation = /\b(start|begin|guide me)\b/i.test(translatedLower);
  const hasConfusion = confusionService.hasConfusionSignal(translatedInput);
  const isNegativeFeedback = confusionService.isNegativeHelpFeedback(translatedInput);
  let forcedConfusionLevel = null;
  let finalResponse;

  const supportedIntents = ['basics', 'timeline', 'process', 'action_guidance', 'confusion', 'importance', 'flow_transition'];

  const wordCount = msgTrimmed.split(" ").length;
  const isVague = /\b(something|anything|tell me|explain)\b/i.test(translatedLower) && wordCount <= 3;

  // AMBIGUITY CHECK: Context Validation
  const hasContext = /\b(what|how|why|explain|tell|process|steps|about)\b/i.test(translatedInput);
  const topicIntents = ['basics', 'timeline', 'process', 'importance'];

  if (topicIntents.includes(routingIntent) && matchedTopics.length === 0 && !isNavigation) {
    if (!hasContext) {
      return await earlyReturn(
        "Just to clarify...",
        "Do you want to learn about the election process? You can also say 'start' to begin."
      );
    }
  }

  // --- STRICT PRIORITY ROUTING BLOCK ---
  if (matchedTopics.length === 1 && !hasConfusion) {
    selectedTopic = matchedTopics[0].topic;
    routingIntent = intentService.detectIntent(selectedTopic).intent;

    const flowResult = flowService.handleFlow(routingIntent, profile, current_step, translatedInput);
    if (flowResult.is_complete) {
      finalResponse = {
        title: "You’re ready!",
        explanation: "You’ve completed the full election journey. You now understand how the system works.",
        next_suggestion: "You can explore any topic again or ask something new.",
        confirmation: "Would you like to revisit or explore something else?",
        next_step: flowResult.next_step,
        current_step: flowResult.current_step,
        status: 'success'
      };
    } else {
      const personalizedResponse = personalizationService.adaptResponse(flowResult, profile);
      finalResponse = { ...personalizedResponse, status: 'success' };
      if (finalResponse.explanation) {
        finalResponse.explanation += `\n\nLet's start with ${selectedTopic}. You can explore other topics next.`;
      }
    }
  }
  else if (isNavigation) {
    routingIntent = 'basics';
    current_step = 1;
    const flowResult = flowService.handleFlow(routingIntent, profile, current_step, translatedInput);
    const personalizedResponse = personalizationService.adaptResponse(flowResult, profile);
    finalResponse = { ...personalizedResponse, status: 'success' };
    if (finalResponse.explanation) {
      finalResponse.explanation += "\n\nLet’s start from the basics and build your understanding step by step.";
    }
  }
  // TOPIC RESCUE (GLOBAL — MUST BE INDEPENDENT)
  if (matchedTopics.length === 1 && hasConfusion) {
    routingIntent = intentService.detectIntent(matchedTopics[0].topic).intent;
  }
  else if (!matchedTopics.length && !isNavigation && hasConfusion) {
    routingIntent = "confusion";

    // 2. FIX CONFUSION LOOP (CRITICAL)
    if (storedConfusionLevel >= 2) {
      return {
        title: "Let’s restart with clarity",
        explanation: "Let’s go back to the basics to make things clearer.",
        next_suggestion: "Type 'next' to begin again.",
        confirmation: "Ready to restart?",
        current_step: 1,
        next_step: 1,
        status: 'success',
        language: effectiveOutputLang
      };
    }

    if (isNegativeFeedback) {
      forcedConfusionLevel = storedConfusionLevel >= 1 ? 2 : 1;
    } else {
      forcedConfusionLevel = Math.min(storedConfusionLevel + 1, 2);
    }
    const flowResult = flowService.handleFlow(routingIntent, profile, current_step, translatedInput);
    const personalizedResponse = personalizationService.adaptResponse(flowResult, profile);
    finalResponse = { ...personalizedResponse, status: 'success' };
  }
  else if (supportedIntents.includes(routingIntent)) {
    const flowResult = flowService.handleFlow(routingIntent, profile, current_step, translatedInput);
    if (flowResult.is_complete) {
      finalResponse = {
        title: "You’re ready!",
        explanation: "You’ve completed the full election journey. You now understand how the system works.",
        next_suggestion: "You can explore any topic again or ask something new.",
        confirmation: "Would you like to revisit or explore something else?",
        next_step: flowResult.next_step,
        current_step: flowResult.current_step,
        status: 'success'
      };
    } else {
      const personalizedResponse = personalizationService.adaptResponse(flowResult, profile);
      finalResponse = { ...personalizedResponse, status: 'success' };
    }
  }
  else if (
    routingIntent === intentService.intents.UNKNOWN &&
    (msgTrimmed.length > 5 || isQuestion) &&
    wordCount >= 2 &&
    !isNoisyInput &&
    !hasConfusion &&
    !isVague
  ) {
    finalResponse = await apiFallback.callApi(translatedInput, profile);
    finalResponse.current_step = current_step;
    finalResponse.next_step = current_step;
  }
  else {
    finalResponse = {
      title: "Let’s keep learning",
      explanation: "We can explore this step by step through the election guide.",
      next_suggestion: "Try asking about voting, timeline, or process.",
      confirmation: "Would you like to continue?",
      current_step,
      next_step: current_step
    };
  }

finalResponse.intent = routingIntent;

const confusionOpts =
  routingIntent === 'confusion'
    ? {
      forcedLevel: forcedConfusionLevel,
      variantSeed: confusionVariantSeed,
      lastConfusionExplanation
    }
    : {};

finalResponse = confusionService.handleConfusion(
  translatedInput,
  finalResponse,
  confusionOpts
);

const nextVariant =
  routingIntent === 'confusion'
    ? Number(finalResponse._confusionVariantNext) ||
    confusionVariantSeed + 1
    : confusionVariantSeed;

delete finalResponse._confusionVariantNext;

// GLOBAL SAFETY GUARD
finalResponse.current_step =
  finalResponse.current_step ?? current_step;

finalResponse.next_step =
  finalResponse.next_step ?? current_step;

// 7. Format final output
const formattedResponse = responseFormatter.formatResponse(finalResponse, profile);

// 8. Prepare final return object
let finalResult = {
  ...formattedResponse,
  next_step: finalResponse.next_step ?? current_step,
  current_step: finalResponse.current_step ?? current_step,
  intent: finalResponse.intent,
  confusionLevel: routingIntent === 'confusion' ? forcedConfusionLevel : 0,
  confusionVariant: nextVariant,
  lastConfusionExplanation:
    routingIntent === 'confusion'
      ? String(finalResponse.explanation || '').trim()
      : '',
  mode: profile.mode,
  status: 'success',
  language: effectiveOutputLang
};

finalResult.confusionLevel = finalResult.confusionLevel ?? 0;
finalResult.confusionVariant = finalResult.confusionVariant ?? 0;
finalResult.lastConfusionExplanation = finalResult.lastConfusionExplanation ?? "";

if (effectiveOutputLang !== "en") {
  const fields = [
    finalResult.title,
    finalResult.explanation,
    finalResult.next_suggestion,
    finalResult.confirmation,
    finalResult.example || ""
  ];
  const translated = await translationService.translateMultiple(fields, effectiveOutputLang);
  [finalResult.title, finalResult.explanation, finalResult.next_suggestion, finalResult.confirmation, finalResult.example] = translated;
}

return finalResult;
};

module.exports = {
  processMessage
};
