const intentService = require('./intentService');
const flowService = require('./flowService');
const personalizationService = require('./personalizationService');
const confusionService = require('./confusionService');
const apiFallback = require('./apiFallback');
const responseFormatter = require('./responseFormatter');

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
const processMessage = (message, user_profile = {}, current_step = 1) => {
  // Default structure for user_profile if not provided
  const profile = {
    level: user_profile.level || 'beginner',
    type: user_profile.type || 'first_time',
    mode: user_profile.mode || 'guided',
    ...user_profile
  };

  // 1. Detect intent
  const intent = intentService.detectIntent(message);

  let finalResponse;

  // 2. Decide logic vs API
  // Rule: Use logic for basics, timeline, process, action_guidance, confusion
  // Use API for generic questions or when intent is not specific
  const supportedIntents = ['basics', 'timeline', 'process', 'action_guidance', 'confusion', 'importance', 'flow_transition'];
  
  if (supportedIntents.includes(intent.intent)) {
    // 3. Apply flow (guided/free)
    const flowResult = flowService.handleFlow(intent.intent, profile, current_step, message);
    
    // 4. Apply personalization
    const personalizedResponse = personalizationService.adaptResponse(flowResult, profile);
    
    finalResponse = {
      ...personalizedResponse,
      status: 'success'
    };
  } else {
    // Trigger API Fallback
    finalResponse = apiFallback.callApi(message, profile);
    finalResponse.next_step = current_step; // Maintain current step
  }

  // 5. Add intent for tracing and subsequent services
  finalResponse.intent = intent.intent;

  // 6. Apply confusion handling
  finalResponse = confusionService.handleConfusion(message, finalResponse);

  // 7. Format final output
  const formattedResponse = responseFormatter.formatResponse(finalResponse, profile);

  // 8. Return structured response
  return {
    ...formattedResponse,
    next_step: finalResponse.next_step,
    current_step: finalResponse.current_step,
    intent: finalResponse.intent,
    status: 'success'
  };
};

module.exports = {
  processMessage
};
