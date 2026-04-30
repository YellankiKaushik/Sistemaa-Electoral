const express = require('express');
const router = express.Router();
const logicEngine = require('../services/logicEngine');

/**
 * POST /chat
 * Main endpoint to handle user queries
 */
router.post('/', async (req, res) => {
  const { message, user_profile, current_step, user_language } = req.body;

  // Basic validation
  if (!message) {
    return res.status(400).json({
      status: 'error',
      message: 'User message is required'
    });
  }

  // Pass input to logic engine
  try {
    const result = await logicEngine.processMessage(message, user_profile, current_step, user_language);
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
