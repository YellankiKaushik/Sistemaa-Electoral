# Testing & Validation Logic

This document defines the core test scenarios and validation checks to ensure the assistant behaves correctly across different user profiles and interaction types.

---

## 1. Test Scenarios

### Scenario 1: First-Time User (Beginner)
**Context:** User has no prior knowledge and prefers guided learning.
- **Input:** "I'm a first-time voter."
- **Expected Behavior:**
    1.  **Onboarding:** Confirm user type and set `user_profile.level = beginner`.
    2.  **Introduction:** Provide a high-level overview of elections using simple language.
    3.  **Example:** Include a mandatory analogy (e.g., school captain).
    4.  **Prompt:** Suggest Step 1: Basics of Elections.
- **Step-by-Step:**
    - User: "I'm a first-time voter."
    - Assistant: Standard Response (Title: **Welcome First-Time Voter**, Simple Explanation, Analogy, Next Suggestion: Step 1, Confirmation).

### Scenario 2: Confused User
**Context:** User indicates they don't understand a specific explanation.
- **Input:** "This is too confusing."
- **Expected Behavior:**
    1.  **Detection:** Trigger `confusion` intent.
    2.  **Response:** Simplify the previous explanation, break it into smaller parts, and use ultra-simple wording.
    3.  **Recovery:** End with "Did this make sense?" or "Do you want a simpler explanation?".
    4.  **Options:** Offer to Repeat, Change Topic, or Continue Flow.
- **Step-by-Step:**
    - Assistant explains Timeline.
    - User: "This is too confusing."
    - Assistant: Pivots to simplified breakdown of the Timeline.

### Scenario 3: Aware User
**Context:** User already knows the basics and wants specific info.
- **Input:** "I know how it works, just show me the timeline."
- **Expected Behavior:**
    1.  **Detection:** Trigger `timeline` intent + set `user_profile.level = aware`.
    2.  **Conciseness:** Skip the "Basics" and "Importance" steps.
    3.  **Response:** Directly present the election stages in a structured, concise format.
    4.  **Prompt:** Ask if they want to see the "Action Checklist" next.

### Scenario 4: Free Chat Interaction
**Context:** User asks a random question during a guided flow.
- **Input (during Step 2):** "What documents do I need?"
- **Expected Behavior:**
    1.  **Detection:** Trigger `action_guidance` intent.
    2.  **Interruption Handling:** Answer the question directly (Free Chat Mode).
    3.  **Bridge:** Suggest returning to Step 2 or moving to Step 5 (Actions).
    4.  **State:** Maintain `current_step = 2`.

### Scenario 5: Edge Case - "Help me"
**Context:** User is stuck or doesn't know how to interact.
- **Input:** "Help me"
- **Expected Behavior:**
    1.  **Detection:** Trigger `confusion` / `help` intent.
    2.  **Guidance:** Present clear starting options (Basics, Timeline, Process, Ask Question).
    3.  **Prompt:** "Do you want to learn step-by-step?"

### Scenario 6: Edge Case - "I don't know what to ask"
**Context:** User is passive or overwhelmed.
- **Input:** "I don't know what to ask"
- **Expected Behavior:**
    1.  **Validation:** Acknowledge the feeling.
    2.  **Suggestion:** "That's okay! Many people start with **What is an election?** or **Why should I vote?**."
    3.  **Action:** Present the guided flow options as buttons/choices.

---

## 2. Validation Checks

| Check | Criteria | Failure Indicator |
| :--- | :--- | :--- |
| **Clarity** | Response uses simple language (12-year-old level). | Jargon like "Constituency" or "Electoral Roll" used without explanation. |
| **Guided Flow** | `current_step` increments correctly; no loops. | User is stuck on the same step after clicking "Next". |
| **Personalization** | Beginner gets examples; Aware gets concise lists. | Aware user is forced to read "What is an election?" summary. |
| **Confusion Handling** | Pivot is triggered; explanation is rephrased. | Assistant repeats the exact same text after user says "I don't understand". |
| **State Integrity** | Progress is saved; no data loss on mode switch. | `current_step` resets to 0 after a free chat question. |

---

## 3. Potential Issues & Risks

- **Intent Misalignment:** User asks a complex question that triggers the wrong intent (e.g., "How do I choose?" triggering `process` instead of `advice`).
- **Flow Rigidity:** User gets trapped in a step-by-step flow and can't find the exit to free chat.
- **Redundancy:** Assistant suggests a topic the user has already completed.
- **Incomplete Recovery:** User says "No" to "Did this make sense?" and the assistant doesn't have a third level of simplification.
