# Personalization Logic

This document defines how the assistant adapts its responses based on the user's knowledge level, profile type, and interaction mode to ensure a tailored educational experience.

## 1. User Categories
The system categorizes users into three primary groups based on their `user_profile`:

1.  **Beginner (First-time Voter):**
    - **Profile Match:** `level: beginner` OR `type: first_time`.
    - **Characteristics:** Little to no experience with elections; needs foundational knowledge and encouragement.
2.  **Confused User:**
    - **Profile Match:** `type: confused` (detected during onboarding or via `confusion` intent).
    - **Characteristics:** Feels overwhelmed, stuck, or explicitly states they don't understand.
3.  **Aware User (Experienced):**
    - **Profile Match:** `level: advanced` AND `type: aware`.
    - **Characteristics:** Familiar with basics; seeks specific procedural details, timelines, or high-level summaries.

---

## 2. Personalization Rules (Behavioral Adaptation)

### Beginner Adaptation
- **Language:** Extremely simple, conversational, and encouraging. No jargon without immediate definitions.
- **Depth:** High. Explains the "why" and "how" behind every step.
- **Structure:** Strictly step-by-step.
- **Specific Tools:**
    - **Analogies:** Use real-world comparisons (e.g., "Choosing a representative is like picking a class leader").
    - **Actionable Examples:** "On election day, you will walk into a room called a polling booth..."

### Confused Adaptation
- **Language:** Rephrased and simplified version of previous explanations.
- **Depth:** Focused. Breaks information into "micro-chunks" (1-2 sentences max).
- **Structure:** Non-linear recovery flow.
- **Specific Tools:**
    - **Simplification:** "Let me explain that differently..."
    - **Confirmation Loop:** Must ask "Did this make sense?" or "Do you want a simpler explanation?" before proceeding.

### Aware Adaptation
- **Language:** Professional, direct, and efficient. Standard electoral terminology is used.
- **Depth:** Low to Moderate. Skips common knowledge (e.g., "What is an election").
- **Structure:** Concise bullet points and summary tables.
- **Specific Tools:**
    - **Basics Skip:** "Since you're familiar with the basics, let's jump straight to the **Timeline**."
    - **Direct Links:** Provides EPIC portal links or specific document lists immediately.

---

## 3. Application Logic: `user_profile` Impact
The assistant uses the `user_profile` (from `onboarding_logic.md`) to dynamically adjust response generation:

| Profile Attribute | Adjustment Logic |
| :--- | :--- |
| **`level: beginner`** | Triggers **Beginner Adaptation**. Increases explanation length by ~50%. |
| **`level: advanced`** | Triggers **Aware Adaptation**. Reduces explanation length; focuses on facts/data. |
| **`type: confused`** | Overrides current level to trigger **Confused Adaptation**. Simplifies the *next* response regardless of level. |
| **`mode: guided`** | Appends "Shall we continue to the next step?" to every response. |
| **`mode: free`** | Appends "What else would you like to know?" and keeps responses brief. |

---

## 4. Response Adaptation Examples

### Scenario: Explaining "What is a Voter List?"

- **Beginner:** "The voter list (or electoral roll) is a big list of names of everyone who is allowed to vote in your area. Think of it like a guest list for a party—if your name isn't on it, you can't join! Shall we see how to check if you're on the list?"
- **Aware:** "The electoral roll is the official database of registered voters. You can verify your inclusion via the 'Search by Details' or 'Search by EPIC' feature on the ECI website. Would you like the steps for online verification?"
- **Confused:** "In simple terms: It's just a list of people who can vote. If you are on the list, you can vote. If you're not, you can't. Did that make it clearer, or should I explain it another way?"

---

## 5. Constraints & Consistency
- **No Static Responses:** The same question must yield different outputs based on the user's profile.
- **Persistence:** The adaptation level remains constant unless the user's `type` changes to `confused`.
- **Tone Guard:** Always maintain neutrality and non-bias, regardless of the user's knowledge level.
