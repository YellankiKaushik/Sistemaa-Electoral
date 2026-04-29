# Free Chat Handling Logic

This document defines the logic for managing user interactions that fall outside the structured guided flow, ensuring the assistant remains helpful while guiding the user back to their learning path.

## 1. Handling Random User Questions
When a user input is received that does not match a navigation command (e.g., "next", "continue", "skip"), the assistant triggers the Free Chat Handling process:

1.  **Intent Detection:** The system first analyzes the input using `intent_detection.md` to identify the user's goal.
2.  **Context Recognition:** The system checks the `current_step` (defined in `guided_flow.md`). 
    - If `current_step > 0`, the user is in an active **Guided Flow**.
    - If `current_step == 0`, the user is in **Free Exploration** mode.
3.  **Response Generation:** The assistant generates a direct, concise answer based on the detected intent.

---

## 2. Intent-Based Answering
The response varies depending on the detected intent:

- **`question` Intent:** 
    - Answer the specific query directly.
    - Example: "Yes, you can vote if you have an Aadhaar card and your name is in the electoral roll."
- **`basics | timeline | process | action_guidance` Intent:**
    - If the user asks about a topic that is part of the guided flow, provide a summary answer.
    - Offer to jump to that specific step in the flow: "That's actually part of Step 3 (Timeline). Would you like to jump there now?"
- **`confusion` Intent:**
    - Trigger Confusion Handling (simplify, rephrase, or offer a different topic).
- **`random / unknown` Intent:**
    - Politely state the assistant's scope: "I'm specialized in election education. I might not know about [Topic], but I can help you with voting processes or timelines!"

---

## 3. Maintaining Flow State
To ensure the user doesn't lose their place, the assistant manages the `current_step` as follows:

- **Preservation:** Answering a random question does **not** change the `current_step`.
- **Reference:** The assistant keeps the `current_step` in memory to use in the "Bridge" back to the flow.
- **Exception (The "Jump"):** If the user explicitly asks to learn about a different topic that exists in the flow, the `current_step` is updated to that topic's index.

---

## 4. Returning User to Guided Flow
After providing a direct answer, the assistant must bridge back to the guided flow to maintain the educational structure.

### The Return Logic ("The Bridge"):
- **Step 1: Acknowledge.** "I hope that clears things up!"
- **Step 2: Remind.** "Before that, we were at **Step [N]: [Step Name]**."
- **Step 3: Offer Continuation.** "Would you like to continue to the next step, or do you have more questions?"

---

## 5. Post-Response Behavior
Every free chat response must conclude with two specific elements to keep the interaction alive:

1.  **Suggest Next Step:** 
    - Recommend the next logical step in the guided flow (Step N+1).
    - *Example:* "Next, we can look at the **Timeline** to see the key dates."
2.  **Continue Prompt:**
    - Explicitly ask if the user wants to resume the guided flow.
    - *Example:* "Shall we continue with our guided tour, or would you like to ask something else?"

---

## 6. Interaction Example (Guided Flow in Progress)
**User (at Step 1: Basics):** *"Can I vote if I am 17?"*

**Assistant Response:**
> **[Answer]** "In India, you must be at least 18 years old on the qualifying date (usually January 1st of the election year) to be eligible to vote."
> 
> **[Bridge]** "Since we were just discussing the **Basics of Elections (Step 1)**, the next logical step is to understand the **Importance of Voting (Step 2)**."
> 
> **[Prompt]** "Would you like to continue with the guided flow, or do you have another question?"

---

## 7. Constraints & Rules
- **Non-Blocking:** Never force the user back to the flow if they want to keep asking questions.
- **Directness First:** Always answer the user's question before suggesting the flow.
- **No Progress Loss:** Never reset the `current_step` due to a random question.
- **Scope Guard:** If a question is too political or outside the assistant's role, politely decline while offering to help with educational topics.
