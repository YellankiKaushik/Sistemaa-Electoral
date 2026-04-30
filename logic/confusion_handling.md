# Confusion Handling Logic

This document defines how the assistant detects user confusion and implements recovery strategies to ensure the user remains engaged and informed without frustration.

## 1. Confusion Detection Signals

The assistant identifies confusion through explicit user statements and implicit behavioral patterns.

### A. Explicit Signals (Direct Statements)
Detected via keyword matching and pattern recognition:
- "I don't understand" / "I'm lost" / "I'm stuck"
- "This is confusing" / "Too complex" / "Too much info"
- "What do you mean?" / "Explain again"
- "Help" (when in the middle of an explanation)

### B. Implicit Signals (Behavioral Patterns)
- **Repeated Questions:** User asks the same or a very similar question within 2-3 turns after an answer was provided.
- **Irrelevant Responses:** User provides input that does not match any expected intent or the context of the current step (e.g., answering "Blue" to "Are you a first-time voter?").
- **Rapid Skip:** User tries to skip multiple steps without interacting with the content.
- **Mismatched Intent:** User asks a question about a topic that was just explained in detail.

---

## 2. Response Logic (Adaptation Strategies)

When confusion is detected, the assistant MUST NOT repeat the previous response. It must adapt using one or more of the following strategies:

| Strategy | Implementation |
| :--- | :--- |
| **Simplify** | Reduce the vocabulary level (e.g., instead of "Constituency", use "Your local area"). Remove technical jargon. |
| **Chunking** | Break a long explanation into 2-3 smaller, digestible messages. |
| **Rephrasing** | Change the sentence structure and use different synonyms to explain the same concept. |
| **Examples/Analogies** | Use real-world comparisons (e.g., "Think of an election like a school captain election, but for the whole country"). |

---

## 3. Recovery Behavior & Interaction

The goal is to validate understanding and provide a clear path forward.

### A. Confirmation Check
Every "Confusion Recovery" response must end with a confirmation question such as:
- "Did this make sense?"
- "Do you want a simpler explanation?"

### B. Navigation Options
If the user remains confused after a re-explanation, offer these specific options:
1.  **Repeat:** "Shall I try explaining this one more time in a different way?"
2.  **Change Topic:** "Would you like to skip this for now and move to a different topic?"
3.  **Continue Flow:** "We can continue the guided flow from where we left off. Shall we?"

---

## 4. Flow Integration (State Management)

Confusion handling must be non-destructive to the user's progress.

- **Maintain `current_step`:** The `current_step` variable in the `guided_flow` must NOT be reset or modified during confusion recovery.
- **Context Preservation:** The assistant must remember the current context to help the user continue from the same point.
- **Help User Continue:** Once confusion is resolved, the assistant must explicitly prompt: "Now that we've cleared that up, shall we continue from where we were?"

---

## 5. Implementation Rules (Execution Guards)

- **Anti-Repetition:** The system must track the `last_response_type` and `last_explanation_method` to ensure the same logic isn't used twice in a row.
- **Adaptive Depth:** If a user triggers confusion signals twice on the same topic, the assistant must automatically switch to "Beginner" mode for that specific interaction, regardless of the initial `user_profile`.
- **Tier 3: Super-Simple Fallback:** If a user remains confused after two adaptation attempts, the assistant must switch to a "single-sentence summary" mode with a direct recommendation to move to a different topic.
- **No Dead Ends:** Every confusion response must provide at least one "Actionable Next Step" for the user.
