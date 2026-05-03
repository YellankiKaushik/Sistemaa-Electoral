/**
 * flowService.js
 * Manages the guided learning flow and step transitions.
 */


const steps = {
  BASICS: 1,
  IMPORTANCE: 2,
  TIMELINE: 3,
  PROCESS: 4,
  ACTIONS: 5,
};

const flowContent = {
  [steps.BASICS]: {
    title: "### What is an Election?",
    explanation:
      "An election is a process where people vote to choose their leaders. It's like a big group decision where everyone's voice counts equally.",
    example:
      "Think of it like choosing a captain for your sports team. Every player gets one vote, and the person with the most votes wins.",
    next_suggestion: "Next, we can talk about **Why Your Vote Matters**.",
    confirmation: "Did that help you understand what an election is?",
  },
  [steps.IMPORTANCE]: {
    title: "### Why Every Vote Matters",
    explanation:
      "Your vote is your power to influence how your community is run. It determines who will make decisions about schools, roads, and hospitals.",
    example:
      "If 100 people are choosing a movie but only 10 vote, those 10 people decide for everyone. Voting ensures you have a say in the final choice.",
    next_suggestion: "Next, I can explain the **Election Timeline**.",
    confirmation: "Does it make sense why participation is so important?",
  },
  [steps.TIMELINE]: {
    title: "### The Election Timeline",
    explanation:
      "The election process happens in stages, from the official announcement to the final results being declared.",
    steps: [
      "1. **Announcement**: The election dates are declared.",
      "2. **Nominations**: Candidates file their papers to run.",
      "3. **Campaigning**: Candidates share their plans with voters.",
      "4. **Polling**: Voters go to the booths to cast their votes.",
      "5. **Counting & Results**: Votes are counted and winners are announced.",
    ],
    next_suggestion: "Now, let's look at the **Step-by-Step Voting Process**.",
    confirmation: "Are the different stages clear to you?",
  },
  [steps.PROCESS]: {
    title: "### How to Cast Your Vote",
    explanation:
      "On election day, you'll follow a few simple steps at your local polling station to make your choice.",
    steps: [
      "1. **Verification**: Officials check your ID against the voter list.",
      "2. **Inking**: An official puts indelible ink on your finger.",
      "3. **Registration**: You sign the voter register.",
      "4. **Voting**: You go into the private booth and press the button on the EVM next to your chosen candidate's symbol.",
    ],
    next_suggestion: "Finally, we can go through your **Action Checklist**.",
    confirmation: "Do you feel comfortable with the steps at the booth?",
  },
  [steps.ACTIONS]: {
    title: "### Your Action Checklist",
    explanation:
      "To be ready for election day, there are a few things you should prepare in advance.",
    steps: [
      "1. **Check Voter List**: Ensure your name is on the list.",
      "2. **Locate Booth**: Find out exactly where you need to go.",
      "3. **Identity Proof**: Carry your Voter ID card or another valid document like Aadhaar.",
      "4. **Plan Your Visit**: Decide when you'll go to avoid the biggest crowds.",
    ],
    next_suggestion:
      "You've completed the full guided flow! You're ready to participate.",
    confirmation:
      "Is there anything else you'd like to revisit, or are we all set?",
  },
};

/** Ordered path: Basics → Importance → Timeline → Process → Actions (no skipping inside “next” alone). */
const ORDERED_SEQUENCE = [
  steps.BASICS,
  steps.IMPORTANCE,
  steps.TIMELINE,
  steps.PROCESS,
  steps.ACTIONS,
];

const COMPLETION_AFTER_ACTIONS_NEXT = () => ({
  title: "🎉 You've Completed the Guide",
  explanation:
    "You now understand the full election process from start to finish.",
  next_suggestion: "You can ask any question or restart the guide.",
  confirmation: "Would you like to explore a topic again?",
  example: "",
  steps: [],
  next_step: steps.ACTIONS,
  current_step: steps.ACTIONS,
  is_complete: true,
});

/**
 * Handles the guided flow and returns the appropriate content.
 * @param {string} intent - Detected user intent
 * @param {object} user_profile - User profile metadata
 * @param {number} current_step - Current progress
 * @param {string} message - Original user message (optional, for keyword fallback)
 * @returns {object} - { content fields, next_step, current_step, is_complete? }
 */
const handleFlow = (intent, user_profile, current_step, message = "") => {
  const lowerMessage = String(message ?? "").toLowerCase().trim();
  const normalizedCurrent = Math.min(
    Math.max(Number(current_step) || 1, 1),
    steps.ACTIONS
  );
  let targetStep = normalizedCurrent;

  const isContinueIntent =
    intent === "flow_transition" ||
    lowerMessage === "next" ||
    lowerMessage === "continue";

  // User is on Actions (FINAL_STEP / actions); pressing “next” finishes the guide (no wrap to Basics).
  const onFinalGuideStep = normalizedCurrent === steps.ACTIONS;

  if (isContinueIntent && onFinalGuideStep) {
    return COMPLETION_AFTER_ACTIONS_NEXT();
  }

  if (isContinueIntent) {
    const idx = ORDERED_SEQUENCE.indexOf(normalizedCurrent);
    const nextIndex = idx >= 0 ? idx + 1 : ORDERED_SEQUENCE.length - 1;
    const boundedIndex = Math.min(nextIndex, ORDERED_SEQUENCE.length - 1);
    targetStep = ORDERED_SEQUENCE[boundedIndex];
  } else if (intent === "basics") targetStep = steps.BASICS;
  else if (intent === "importance" || lowerMessage.includes("importance"))
    targetStep = steps.IMPORTANCE;
  else if (intent === "timeline") targetStep = steps.TIMELINE;
  else if (intent === "process") targetStep = steps.PROCESS;
  else if (intent === "action_guidance") targetStep = steps.ACTIONS;

  // Keep within learning track (1–5)
  targetStep = Math.min(Math.max(targetStep, 1), steps.ACTIONS);

  const content = flowContent[targetStep] || flowContent[steps.BASICS];

  // Guided: “next” after a jump advances to following step in sequence (no duplicates from +1 hacks).
  let next_step = targetStep;
  if (user_profile.mode === "guided") {
    const pos = ORDERED_SEQUENCE.indexOf(targetStep);
    if (pos >= 0 && pos < ORDERED_SEQUENCE.length - 1) {
      next_step = ORDERED_SEQUENCE[pos + 1];
    } else if (targetStep >= steps.ACTIONS) {
      next_step = steps.ACTIONS;
    } else {
      next_step = targetStep + 1;
    }
  }

  return {
    ...content,
    next_step,
    current_step: targetStep,
  };
};

module.exports = {
  handleFlow,
  steps,
};
