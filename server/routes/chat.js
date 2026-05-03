const express = require('express');
const router = express.Router();
const logicEngine = require('../services/logicEngine');

/**
 * POST /chat
 * Main endpoint to handle user queries
 */
router.post('/', async (req, res) => {
  let { message, user_profile, current_step, user_language } = req.body;

  // 1. SANITIZE MESSAGE INPUT
  if (typeof message !== "string") {
    return res.status(400).json({ status: 'error', message: 'Invalid message type' });
  }

  // Trim and remove control characters
  message = message.trim().replace(/[\x00-\x1F\x7F]/g, "");

  if (!message) {
    return res.status(400).json({
      status: 'error',
      message: 'User message is required'
    });
  }

  // 2. LIMIT MESSAGE SIZE (Reject if > 300)
  if (message.length > 300) {
    return res.status(200).json({
      status: 'success',
      title: "That’s a great question!",
      explanation: "It's a bit long for me to process at once. Could you ask it in a simpler way so we can explore it step by step?",
      next_suggestion: "Try keeping your message under 300 characters.",
      confirmation: "Would you like to try a shorter question?"
    });
  }

  // 3. SANITIZE user_profile (Allow ONLY SAFE fields from client)
  const safeProfile = {
    confusionLevel: Number(req.body?.user_profile?.confusionLevel) || 0,
    confusionVariant: Number(req.body?.user_profile?.confusionVariant) || 0,
    lastConfusionExplanation: String(req.body?.user_profile?.lastConfusionExplanation || ""),
    last_message: String(req.body?.user_profile?.last_message || "")
  };

  // 4. VALIDATE current_step (Allow ONLY 1-5)
  const validSteps = [1, 2, 3, 4, 5];
  const step = Number(current_step);
  const validatedStep = validSteps.includes(step) ? step : 1;

  // Pass input to logic engine
  try {
    const result = await logicEngine.processMessage(message, safeProfile, validatedStep, user_language);
    res.status(200).json(result);
  } catch (error) {
    console.error('Chat Route Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An internal error occurred',
      title: "System Busy",
      explanation: "I'm having a bit of trouble processing that right now. Let's try again in a moment.",
      next_suggestion: "You can try rephrasing your question or typing 'next' to continue the guide.",
      confirmation: "Would you like to try again?"
    });
  }
});

module.exports = router;
