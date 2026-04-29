const express = require('express');
const router = express.Router();
const logicEngine = require('../services/logicEngine');

/**
 * POST /chat
 * Main endpoint to handle user queries
 */
router.post('/', (req, res) => {
  const { message, user_profile, current_step } = req.body;

  // Basic validation
  if (!message) {
    return res.status(400).json({
      status: 'error',
      message: 'User message is required'
    });
  }

  // Pass input to logic engine
  const result = logicEngine.processMessage(message, user_profile, current_step);

  res.status(200).json(result);
});

module.exports = router;
