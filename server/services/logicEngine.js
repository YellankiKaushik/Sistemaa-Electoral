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
  // Default structure for user_profile if not provided
  const profile = {
    level: user_profile.level || 'beginner',
    type: user_profile.type || 'first_time',
    mode: user_profile.mode || 'guided',
    ...user_profile
  };

  // 0. Language detection and translation
  // Prioritize user-selected language, fallback to auto-detection for longer messages
  let lang = user_language || 'en';
  if (!user_language && message && message.split(" ").length >= 3) {
    lang = await translationService.detectLanguage(message);
  }

  let translatedInput = message;
  if (lang !== 'en') {
    translatedInput = await translationService.translateToEnglish(message);
  }

  const lowerMessage = (translatedInput || "").toLowerCase().trim();

  // Handle explicit "help" command
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
      language: lang
    };

    // Translate output back if needed
    if (lang !== 'en') {
      finalHelpResponse.title = await translationService.translateText(finalHelpResponse.title, lang);
      finalHelpResponse.explanation = await translationService.translateText(finalHelpResponse.explanation, lang);
      finalHelpResponse.next_suggestion = await translationService.translateText(finalHelpResponse.next_suggestion, lang);
      finalHelpResponse.confirmation = await translationService.translateText(finalHelpResponse.confirmation, lang);
    }

    return finalHelpResponse;
  }

  // 1. Detect intent
  const intent = intentService.detectIntent(translatedInput);

  let finalResponse;

  // 2. Decide logic vs API
  // Rule: Use logic for basics, timeline, process, action_guidance, confusion
  // Use API for generic questions or when intent is not specific
  const supportedIntents = ['basics', 'timeline', 'process', 'action_guidance', 'confusion', 'importance', 'flow_transition'];
  
  if (supportedIntents.includes(intent.intent)) {
    // 3. Apply flow (guided/free)
    const flowResult = flowService.handleFlow(intent.intent, profile, current_step, translatedInput);
    
    // 4. Apply personalization
    const personalizedResponse = personalizationService.adaptResponse(flowResult, profile);
    
    finalResponse = {
      ...personalizedResponse,
      status: 'success'
    };
  } else {
    // Trigger API Fallback
    finalResponse = await apiFallback.callApi(translatedInput, profile);
    finalResponse.next_step = current_step; // Maintain current step
  }

  // 5. Add intent for tracing and subsequent services
  finalResponse.intent = intent.intent;

  // 6. Apply confusion handling
  finalResponse = confusionService.handleConfusion(translatedInput, finalResponse);

  // 7. Format final output
  const formattedResponse = responseFormatter.formatResponse(finalResponse, profile);

  // 8. Prepare final return object
  let finalResult = {
    ...formattedResponse,
    next_step: finalResponse.next_step,
    current_step: finalResponse.current_step,
    intent: finalResponse.intent,
    mode: profile.mode,
    status: 'success',
    language: lang
  };

  // 9. Translate output back if needed
  if (lang !== 'en') {
    finalResult.title = await translationService.translateText(finalResult.title, lang);
    finalResult.explanation = await translationService.translateText(finalResult.explanation, lang);
    finalResult.next_suggestion = await translationService.translateText(finalResult.next_suggestion, lang);
    finalResult.confirmation = await translationService.translateText(finalResult.confirmation, lang);
    // DO NOT translate steps array as per requirement
  }

  return finalResult;
};

module.exports = {
  processMessage
};
