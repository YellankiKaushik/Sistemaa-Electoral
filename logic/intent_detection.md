# Intent Detection Logic

This document defines how the assistant identifies user intent based on their input to decide the appropriate response or action.

## 1. Intent Categories
The system recognizes six primary intent categories:

1.  **`basics`**: User wants a high-level understanding of what an election is.
2.  **`timeline`**: User wants to know the stages and dates of the election cycle.
3.  **`process`**: User wants a detailed, step-by-step explanation of how the voting process works.
4.  **`action_guidance`**: User wants specific instructions on what they need to do to participate.
5.  **`question`**: User has a specific, direct query that may fall outside the guided flow.
6.  **`confusion`**: User indicates they are lost, stuck, or find the information difficult to understand.

---

## 2. Mapping Logic (Keyword/Pattern Based)
The system maps user input to intents using a set of representative keywords and phrases.

| Intent | Keywords / Trigger Phrases |
| :--- | :--- |
| **basics** | what is, why vote, meaning of, election basics, overview, intro |
| **timeline** | when, dates, schedule, stages, phase, start to finish, steps of cycle |
| **process** | how to, procedure, system, step by step, mechanism, how it works |
| **action_guidance** | what should I do, how do I vote, where to go, documents, ID proof, registration |
| **question** | can I, is it possible, who, where, specific question markers (?, tell me about) |
| **confusion** | don't understand, confusing, lost, what?, too complex, simplify, stuck |

---

## 3. Behavior Rules
Once an intent is detected, the assistant follows these behavior rules:

| Intent | Assistant Behavior |
| :--- | :--- |
| **basics** | Provide a simple high-level summary + Analogies (if beginner). Ask if they want to see the timeline next. |
| **timeline** | Present the election stages in order (Announcement → Polling → Counting → Results). |
| **process** | Initiate/Continue the guided step-by-step breakdown of casting a vote. |
| **action_guidance** | Provide specific lists: "What you need" (Docs) and "Where you go" (Booth). |
| **question** | Answer the question directly and concisely. Then ask: "Shall we continue with the guided flow?" |
| **confusion** | Immediately pivot using strategies in [confusion_handling.md](file:///c:/Users/YellankiKaushik/Desktop/Projects/Prompt%20wars/Challange%202/Coding%20Files/Sistemaa%20Electoral/logic/confusion_handling.md): Simplify, use different analogies, and offer recovery options (Repeat, Change Topic, Continue Flow). |

---

## 4. Prioritization Logic
If multiple intents are detected in a single input:
1.  **Confusion** always takes top priority (must resolve friction first).
2.  **Question** takes second priority (answer specific needs before continuing).
3.  **Basics/Timeline/Process/Action** follow the logical order of the guided flow.

---

## 5. Constraints Alignment
- **Simple Logic:** Uses a transparent keyword-matching approach rather than complex NLP.
- **No UI:** Purely logical mapping and behavior definitions.
- **Focus:** Dedicated strictly to intent identification and the resulting response strategy.
