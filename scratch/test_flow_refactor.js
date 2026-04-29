const logicEngine = require('../server/services/logicEngine');

console.log("--- Test: Step 1 -> Next ---");
const step1 = logicEngine.processMessage("What is an election?", { level: 'beginner', mode: 'guided' }, 1);
console.log(`Current Step: ${step1.current_step} | Next Step: ${step1.next_step}`);

console.log("\n--- Test: User says 'next' ---");
const step2 = logicEngine.processMessage("next", { level: 'beginner', mode: 'guided' }, step1.current_step);
console.log(`Current Step: ${step2.current_step} | Next Step: ${step2.next_step} | Title: ${step2.title}`);

console.log("\n--- Test: Jump to Importance ---");
const importance = logicEngine.processMessage("Why is voting important?", { level: 'beginner', mode: 'guided' }, 1);
console.log(`Current Step: ${importance.current_step} | Next Step: ${importance.next_step} | Title: ${importance.title}`);
