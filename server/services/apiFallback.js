const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * apiFallback.js
 * Handles queries using Google Gemini API when rule-based logic fails.
 */

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const callApi = async (message, user_profile) => {
  try {
    const query = message && message.trim() !== "" ? message : null;

    if (!query) {
      return {
        title: "### Need Clarification",
        explanation: "Can you please clarify your question?",
        next_suggestion: "You can ask about the election process or follow the guide.",
        confirmation: "Would you like to try again?"
      };
    }

    // Strict prompt for minimal token usage
    const prompt = `
Answer briefly and clearly about elections or voting.
Max 5-6 lines.
No extra explanation.

User question:
${query}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Limit output and add disclaimer
    const limitedText = text.slice(0, 600);

    return {
      title: "AI Assistant Response",
      explanation: limitedText + "\n\n(This response is AI-generated and may contain minor inaccuracies.)",
      next_suggestion: "Would you like to continue with the guide?",
      confirmation: "Did that answer your question?",
      status: 'success'
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Safe Fallback if API or processing fails
    return {
      title: "Temporary Issue",
      explanation: "I'm having trouble answering that right now. Let's continue with the guided steps.",
      next_suggestion: "Would you like to continue learning step-by-step?",
      confirmation: "Shall we continue?"
    };
  }
};

module.exports = {
  callApi
};
