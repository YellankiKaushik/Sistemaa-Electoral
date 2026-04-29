# Guided Flow Logic

This document defines the structured learning path the assistant uses to guide users through the election process.

## 1. Learning Steps
The guided flow consists of five sequential steps:

1.  **Basics**: "What is an election?" — Fundamental concepts.
2.  **Importance**: "Why vote?" — The value of participation and citizen impact.
3.  **Timeline**: "When does it happen?" — Stages from announcement to results.
4.  **Process**: "How do I vote?" — Step-by-step walkthrough of casting a vote.
5.  **Actions**: "What should I do now?" — Preparation and Election Day checklist.

---

## 2. Progress Tracking
The assistant maintains a `current_step` state to track user progress.

- **State Variable:** `current_step`
- **Range:** 0 to 5 (0 = Not started)
- **Persistence:** Tracked during the session (reset on refresh).

---

## 3. Flow Control Logic
The flow is designed to be flexible rather than rigid.

### Moving Step-by-Step:
- **Default:** Assistant moves from `step N` to `step N+1`.
- **Trigger:** User selects "Continue" or "Next step" in response to a post-step prompt.

### Skipping and Jumping:
- **Skip:** User can say "Skip this" or "Next topic" to increment `current_step` without viewing the current step's detail.
- **Jump:** User can explicitly ask for a topic (e.g., "Tell me about the timeline") via **Intent Detection**. 
    - The assistant updates `current_step` to match the requested topic.
    - After completion, it suggests the *next* logical step in the sequence.

---

## 4. Post-Step Interaction Behavior
After delivering the content for any step, the assistant must guide the user forward.

### Interaction Template:
1.  **Confirmation:** "Did this make sense? Shall I explain anything again?"
2.  **Next Suggestion:** "Next, we can talk about **[Step Name]**."
3.  **Action Prompt:** "Would you like to continue, or do you have a specific question?"

### Example (After Step 2: Importance):
> "I hope that shows why every vote counts! Next, I can explain the **Timeline** so you know when each stage happens. Would you like to continue to the Timeline, or is there something else you'd like to ask?"

---

## 5. Handling Interruptions
The guided flow does **not** block the user.

- **Question Interruption:** If a user asks a question (Intent: `question`), the assistant pauses the flow, answers the question, and then provides a "bridge" back:
    - *"Now that we've cleared that up, shall we go back to our step-by-step guide? We were just about to look at [Step Name]."*

---

## 6. Constraints Alignment
- **No UI:** Purely logic and behavior definitions.
- **Flexible Flow:** Allows jumping and skipping based on user intent.
- **No Blocking:** Questions are handled immediately without losing the flow position.

---

## 7. Interaction Completion
Once the user completes Step 5 and has no further questions:
1.  **Summary:** Provide a 2-sentence summary of the key "Action" items.
2.  **Encouragement:** "You're now ready to participate in the democratic process!"
3.  **Final Prompt:** "Is there anything else you'd like to revisit, or are we all set for now?"
4.  **Closing:** If all set, provide a polite closing message and end the active guidance.
