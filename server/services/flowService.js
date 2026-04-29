/**
 * flowService.js
 * Manages the guided learning flow and step transitions.
 */

const steps = {
  BASICS: 1,
  IMPORTANCE: 2,
  TIMELINE: 3,
  PROCESS: 4,
  ACTIONS: 5
};

const flowContent = {
  [steps.BASICS]: {
    title: "### What is an Election?",
    explanation: "An election is a process where people vote to choose their leaders. It's like a big group decision where everyone's voice counts equally.",
    example: "Think of it like choosing a captain for your sports team. Every player gets one vote, and the person with the most votes wins.",
    next_suggestion: "Next, we can talk about **Why Your Vote Matters**.",
    confirmation: "Did that help you understand what an election is?"
  },
  [steps.IMPORTANCE]: {
    title: "### Why Every Vote Matters",
    explanation: "Your vote is your power to influence how your community is run. It determines who will make decisions about schools, roads, and hospitals.",
    example: "If 100 people are choosing a movie but only 10 vote, those 10 people decide for everyone. Voting ensures you have a say in the final choice.",
    next_suggestion: "Next, I can explain the **Election Timeline**.",
    confirmation: "Does it make sense why participation is so important?"
  },
  [steps.TIMELINE]: {
    title: "### The Election Timeline",
    explanation: "The election process happens in stages, from the official announcement to the final results being declared.",
    steps: [
      "1. **Announcement**: The election dates are declared.",
      "2. **Nominations**: Candidates file their papers to run.",
      "3. **Campaigning**: Candidates share their plans with voters.",
      "4. **Polling**: Voters go to the booths to cast their votes.",
      "5. **Counting & Results**: Votes are counted and winners are announced."
    ],
    next_suggestion: "Now, let's look at the **Step-by-Step Voting Process**.",
    confirmation: "Are the different stages clear to you?"
  },
  [steps.PROCESS]: {
    title: "### How to Cast Your Vote",
    explanation: "On election day, you'll follow a few simple steps at your local polling station to make your choice.",
    steps: [
      "1. **Verification**: Officials check your ID against the voter list.",
      "2. **Inking**: An official puts indelible ink on your finger.",
      "3. **Registration**: You sign the voter register.",
      "4. **Voting**: You go into the private booth and press the button on the EVM next to your chosen candidate's symbol."
    ],
    next_suggestion: "Finally, we can go through your **Action Checklist**.",
    confirmation: "Do you feel comfortable with the steps at the booth?"
  },
  [steps.ACTIONS]: {
    title: "### Your Action Checklist",
    explanation: "To be ready for election day, there are a few things you should prepare in advance.",
    steps: [
      "1. **Check Voter List**: Ensure your name is on the list.",
      "2. **Locate Booth**: Find out exactly where you need to go.",
      "3. **Identity Proof**: Carry your Voter ID card or another valid document like Aadhaar.",
      "4. **Plan Your Visit**: Decide when you'll go to avoid the biggest crowds."
    ],
    next_suggestion: "You've completed the full guided flow! You're ready to participate.",
    confirmation: "Is there anything else you'd like to revisit, or are we all set?"
  }
};

/**
 * Handles the guided flow and returns the appropriate content.
 * @param {string} intent - Detected user intent
 * @param {object} user_profile - User profile metadata
 * @param {number} current_step - Current progress
 * @param {string} message - Original user message (optional, for keyword fallback)
 * @returns {object} - { content, next_step, current_step }
 */
const handleFlow = (intent, user_profile, current_step, message = "") => {
  const lowerMessage = message.toLowerCase();
  let targetStep = current_step || 1;

  // 1. Handle "Next / Continue" logic
  const isContinueIntent = intent === 'flow_transition' || 
                           lowerMessage === 'next' || lowerMessage === 'continue';

  if (isContinueIntent) {
    targetStep = (current_step || 1) + 1;
    if (targetStep > 5) targetStep = 5; // Cap at the last step
  } 
  // 2. Handle specific jumps
  else if (intent === 'basics') targetStep = steps.BASICS;
  else if (intent === 'importance' || lowerMessage.includes('importance')) targetStep = steps.IMPORTANCE;
  else if (intent === 'timeline') targetStep = steps.TIMELINE;
  else if (intent === 'process') targetStep = steps.PROCESS;
  else if (intent === 'action_guidance') targetStep = steps.ACTIONS;

  // Ensure targetStep is within valid range
  if (targetStep < 1) targetStep = 1;
  if (targetStep > 5) targetStep = 5;

  const content = flowContent[targetStep] || flowContent[steps.BASICS];
  
  // 3. Internal Step Control (Calculate next step)
  // If in guided mode, the next_step is simply targetStep + 1
  let next_step = targetStep;
  if (user_profile.mode === 'guided') {
    if (targetStep < 5) {
      next_step = targetStep + 1;
    } else {
      next_step = 5; // Stay at 5 or handle completion
    }
  }

  return {
    ...content,
    next_step: next_step,
    current_step: targetStep
  };
};

module.exports = {
  handleFlow,
  steps
};
