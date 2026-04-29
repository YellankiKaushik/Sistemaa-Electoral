const intentService = require('../server/services/intentService');

const testCases = [
  "What is an election?", // basics
  "When are the dates?", // timeline
  "This is confusing, I don't understand", // confusion
  "How to vote? Also I'm lost.", // confusion (priority)
  "Who is running?", // question
  "Can I vote without ID?", // question
  "What documents do I need?", // action_guidance
  "Random message" // question (default fallback)
];

testCases.forEach(msg => {
  const result = intentService.detectIntent(msg);
  console.log(`Message: "${msg}" -> Intent: ${result.intent}`);
});
