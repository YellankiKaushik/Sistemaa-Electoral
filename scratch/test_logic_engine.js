const logicEngine = require('../server/services/logicEngine');

const testCases = [
  {
    message: "What is an election?",
    profile: { level: 'beginner', mode: 'guided' },
    step: 1
  },
  {
    message: "Tell me about the timeline",
    profile: { level: 'advanced', type: 'aware', mode: 'guided' },
    step: 1
  },
  {
    message: "I am confused, help me",
    profile: { level: 'beginner', mode: 'guided' },
    step: 2
  },
  {
    message: "Who is running for office?",
    profile: { level: 'beginner', mode: 'free' },
    step: 4
  }
];

testCases.forEach((tc, index) => {
  console.log(`\n--- Test Case ${index + 1} ---`);
  console.log(`Input: "${tc.message}" | Profile: ${JSON.stringify(tc.profile)} | Step: ${tc.step}`);
  const result = logicEngine.processMessage(tc.message, tc.profile, tc.step);
  console.log(`Response Title: ${result.title}`);
  console.log(`Response Expl: ${result.explanation}`);
  if (result.steps) console.log(`Response Steps: ${result.steps.length} items`);
  console.log(`Next Step: ${result.next_step}`);
  console.log(`Intent: ${result.intent}`);
});
