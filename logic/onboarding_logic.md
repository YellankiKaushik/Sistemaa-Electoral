# Onboarding Logic

This document defines how the assistant gathers information to personalize the learning experience.

## 1. Onboarding Questions
The assistant asks these questions sequentially to build the user's profile.

1.  **First-time Voter?**
    *   *Question:* "Is this your first time participating in an election?"
    *   *Options:* [Yes, I'm a first-timer] / [No, I've voted before]

2.  **Learning Goal?**
    *   *Question:* "What would you like to focus on today?"
    *   *Options:* [Learn the basics] / [Understand the full process] / [See the timeline] / [Ask a specific question]

3.  **Knowledge Level?**
    *   *Question:* "How much do you already know about the election process?"
    *   *Options:* [Nothing] / [Some basics] / [Good understanding]

4.  **Interaction Preference?**
    *   *Question:* "How do you prefer to receive information?"
    *   *Options:* [Step-by-step guidance] / [Quick answers]

---

## 2. User Profile Structure
The data captured above is stored in a `user_profile` object:

```json
{
  "level": "beginner | intermediate | advanced",
  "type": "first_time | aware | confused",
  "mode": "guided | free"
}
```

### Mapping Logic:
- **`level`**:
    - "Nothing" → `beginner`
    - "Some basics" → `intermediate`
    - "Good understanding" → `advanced`
- **`type`**:
    - First-time voter = Yes → `first_time`
    - First-time voter = No AND Knowledge Level = Good → `aware`
    - (Default or if user indicates confusion later) → `confused`
- **`mode`**:
    - "Step-by-step guidance" → `guided`
    - "Quick answers" → `free`

---

## 3. Behavioral Impact
The `user_profile` directly affects how the assistant interacts:

| Profile Attribute | Impact on Assistant Behavior |
| :--- | :--- |
| **Beginner Level** | Uses simpler language, more analogies, and requires confirmation after every step. |
| **Advanced Level** | Skips basic definitions, uses more technical/procedural terms, and provides concise summaries. |
| **First-time Type** | Adds encouraging tone, highlights "What to do on Election Day" early, and explains voting booth mechanics. |
| **Aware Type** | Focuses on timelines, latest updates, and specific procedural nuances. |
| **Guided Mode** | Strictly follows the 5-step learning flow unless interrupted by a question. |
| **Free Mode** | Prioritizes answering direct questions and only suggests the flow as a secondary option. |

---

## 4. Constraints Alignment
- **No UI:** Logic is defined purely by content and structure.
- **No Explanations:** The assistant does not start teaching content during this phase.
- **Focus:** The entire flow is dedicated to capturing user attributes for personalization.
