/**
 * personalizationService.js
 * Adapts structured responses based on the user profile.
 */

/**
 * Adapts a structured response object based on user level and type.
 * @param {object} content - The structured response object from flowService
 * @param {object} user_profile - User profile metadata
 * @returns {object} - The personalized structured response
 */
const adaptResponse = (content, user_profile) => {
  const profile = {
    level: user_profile.level || 'beginner',
    type: user_profile.type || 'first_time',
    mode: user_profile.mode || 'guided'
  };

  // Clone content to avoid mutating the original
  const personalized = JSON.parse(JSON.stringify(content));

  // 1. Confused - Highest Priority (Override all)
  if (profile.type === 'confused') {
    // Simplify to max 2 short sentences
    let simplified = personalized.explanation.split('. ').slice(0, 2).join('. ');
    if (simplified && !simplified.endsWith('.')) simplified += '.';
    
    personalized.explanation = simplified;
    personalized.confirmation = "Did this make sense?";
    
    // Remove complex examples for confused users
    if (personalized.example) delete personalized.example;
    
    return personalized;
  }

  // 2. Beginner
  if (profile.type === 'first_time' || profile.level === 'beginner') {
    personalized.explanation = `Welcome! ${personalized.explanation}`;
    if (!personalized.example) {
      personalized.example = "Think of it like a community decision where everyone helps choose the path forward.";
    }
  } 
  // 3. Aware
  else if (profile.type === 'aware') {
    // Skip extras and remove example safely
    if (personalized.example) delete personalized.example;
    
    // Simple string replacement for conciseness (no risky regex)
    personalized.next_suggestion = personalized.next_suggestion
      .replace("Next, we can talk about", "Jump to")
      .replace("Next, I can explain the", "See");
  }

  // Mode Adaptation (Applied only if not confused)
  if (profile.mode === 'free') {
    personalized.next_suggestion = "What else would you like to know? Or we can continue with the guide.";
  }

  return personalized;
};

module.exports = {
  adaptResponse
};
