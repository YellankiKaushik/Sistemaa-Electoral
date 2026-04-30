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
  const result = await logicEngine.processMessage(message, user_profile, current_step, user_language);

  res.status(200).json(result);
});

module.exports = router;
