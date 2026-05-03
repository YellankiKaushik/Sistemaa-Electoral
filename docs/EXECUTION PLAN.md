# EXECUTION PLAN —  Sistemaa  Electoral 

\## 1. Purpose
This document defines the step-by-step execution process to build the Election Education Assistant system.
It works together with the PRD:
- PRD defines WHAT to build (logic,  behavior , flow) 
\- Execution Plan defines HOW to build it step-by-step
\---
\## 2. Execution Approach
The system will be built using:
\- Antigravity as the execution engine
\- PRD as the source of truth
\- Execution Plan as the task controller
\---
\## 3. Execution Method
\- Work will be done in small steps
\- Each step will:

  - Define a specific task

  - Be executed by Antigravity

  - Return a structured output/report

\- After each step:

  - Output will be reviewed

  - Approved or refined

  - Then next step will begin
\---
\## 4. Rules
\- Always follow PRD strictly
\- Do not skip steps
\- Do not build beyond current step
\- Keep outputs simple and structured
\- Avoid unnecessary complexity
\---
\## 5. Current Status
\- PRD: Completed
\- Setup (Repo + Git): Completed
\- Execution: Starting from Step 1

\## 6. Execution Phases
The system will be built in structured phases.
\---
\### Phase A — Setup
\- Step 1: Repository Setup
\- Step 2: Environment Setup (Antigravity connection)
\---
\### Phase B — Core System Build
\- Step 3: Build Assistant Core Logic (Brain)
\- Step 4: Build Entry Experience
\- Step 5: Build Onboarding Logic
\- Step 6: Implement Intent Detection
\- Step 7: Build Guided Flow System
\- Step 8: Implement Free Chat Handling
\- Step 9: Apply Personalization Logic
\- Step 10: Implement Confusion Handling
\- Step 11: Define Response Structure
\---
\### Phase C — Integration
\- Step 12: Integrate Google Services (Cloud Run, optional Firebase/Vertex AI)
\---
\### Phase D — Testing
\- Step 13: Test Core Scenarios
\- Step 14: Improve and Fix Issues
\---
\### Phase E — Deployment
\- Step 15: Deploy Application
\---
\### Phase F — Submission
\- Step 16: Prepare README
\- Step 17: Create LinkedIn Post
\- Step 18: Final Submission

## 7. Step Execution Rules
Each step must be executed using the following rules:
---
### Rule 1 — Follow PRD
- Always use PRD as the source of truth
- Do not add or assume extra logic
- Do not deviate from defined behavior

---

### Rule 2 — Execute One Step Only

- Focus only on the current step
- Do not build future steps
- Do not combine multiple steps

---

### Rule 3 — Output Requirements

Each execution must return:
- What was built
- How it aligns with PRD
- Any assumptions made
- Any limitations or missing parts

---

### Rule 4 — Keep Output Structured

- Use clear sections
- Avoid long paragraphs
- Keep explanations simple

---

### Rule 5 — No Overbuilding

- Do not create UI unless required in step
- Do not add unnecessary features
- Keep implementation minimal and focused

---

### Rule 6 — Validation

- Ensure output matches:
  - PRD logic
  - Current step requirement

---

### Rule 7 — Stop After Step

- Do not continue automatically
- Wait for next instruction


## 8. Step Definitions

---

### Step 3 — Build Assistant Core Logic (Brain)

#### Objective

Build the core logic and behavior of the assistant based on the PRD.

---

#### Scope

This step must define:

- Assistant role and purpose
- Behavior rules
- Interaction style (guided + free chat)
- Personalization logic
- Response structure

---

#### What to Build

- How the assistant:
  - Understands user input
  - Responds to users
  - Guides step-by-step
  - Adapts to different users

---

#### Constraints

- Do NOT build UI
- Do NOT build full application
- Do NOT move to next steps
- Focus only on logic and behavior

---

#### Output Requirements

The output must include:

- Assistant role definition
- Behavior rules
- Interaction logic
- Personalization rules
- Response format structure

---

#### Completion Criteria

This step is complete when:

- Assistant behavior is clearly defined
- Logic aligns with PRD
- Response structure is consistent

---

### Step 4 — Build Entry Experience

#### Objective

Define how the assistant interacts with the user at the start.

---

#### Scope

This step must define:

- Initial interaction when user opens the assistant
- Available options for the user
- How the assistant guides the user to start

---

#### What to Build

- A clear starting interface or message that includes:

  - Learn election basics  
  - Understand full process  
  - View timeline  
  - Ask a question  

- The assistant should:

  - Present options clearly  
  - Help user choose a starting point  
  - Reduce confusion at entry  

---

#### Constraints

- Do NOT build full UI design
- Do NOT move to onboarding yet
- Keep it simple and clear

---

#### Output Requirements

The output must include:

- Entry interaction structure
- List of options presented to user
- How assistant prompts user to choose

---

#### Completion Criteria

This step is complete when:

- Entry flow is clearly defined
- User can easily choose what to do
- Interaction is simple and intuitive


---

### Step 5 — Build Onboarding Logic

#### Objective

Define how the assistant gathers initial information about the user to provide personalized guidance.

---

#### Scope

This step must define:

- What questions the assistant asks initially
- How it identifies user type
- How it determines user knowledge level
- How it selects interaction mode

---

#### What to Build

The assistant must ask key onboarding questions such as:

- Are you a first-time voter?
- What do you want to learn today?
- How much do you already know?
  - Nothing
  - Some basics
  - Good understanding
- Do you prefer:
  - Step-by-step guidance
  - Quick answers

---

#### Logic

Based on user responses, define:

- user_profile = {
    level: beginner / intermediate / advanced,
    type: first_time / confused / aware,
    mode: guided / free
  }

- The assistant must:
  - Store this information
  - Use it in future responses

---

#### Constraints

- Do NOT move into detailed explanation yet
- Do NOT build UI
- Focus only on user understanding

---

#### Output Requirements

The output must include:

- List of onboarding questions
- Structure of user_profile
- Explanation of how responses affect behavior

---

#### Completion Criteria

This step is complete when:

- Assistant can identify user type
- User preferences are captured
- Personalization foundation is ready

---

### Step 6 — Implement Intent Detection

#### Objective

Define how the assistant identifies what the user wants based on their input.

---

#### Scope

This step must define:

- Types of user intents
- How user input is categorized
- How intent influences next action

---

#### What to Build

Define the following intent categories:

- basics → user wants to understand what elections are
- timeline → user wants to know stages of elections
- process → user wants step-by-step explanation
- action_guidance → user wants to know what to do next
- question → user asks a specific query
- confusion → user does not understand or is stuck

---

#### Logic

- The assistant must:
  - Analyze user input
  - Map it to one of the intent categories

- Simple keyword or pattern-based mapping is sufficient

---

#### Behavior Based on Intent

- basics → start with simple explanation
- timeline → explain stages clearly
- process → give step-by-step breakdown
- action_guidance → suggest next actions
- question → answer directly
- confusion → simplify and guide

---

#### Constraints

- Do NOT build advanced NLP system
- Do NOT overcomplicate logic
- Keep detection simple and clear

---

#### Output Requirements

The output must include:

- List of intent categories
- Mapping logic (how input → intent)
- Behavior rules for each intent

---

#### Completion Criteria

This step is complete when:

- User input can be categorized into defined intents
- Assistant can decide next action based on intent


---

### Step 7 — Build Guided Flow System

#### Objective

Define the structured, step-by-step learning flow that the assistant uses to guide users through the election process.

---

#### Scope

This step must define:

- The sequence of learning steps
- How the assistant moves from one step to another
- How user progress is tracked

---

#### What to Build

Define the guided flow steps:

1. Basics → What is an election  
2. Importance → Why elections matter  
3. Timeline → Stages of elections  
4. Process → Step-by-step election process  
5. Actions → What the user should do  

---

#### Flow Logic

- The assistant must:
  - Start from the appropriate step based on user intent or onboarding
  - Move sequentially unless user changes direction
  - Allow users to:
    - Skip steps
    - Jump to specific topics
    - Ask questions anytime

---

#### Progress Tracking

Define:

- current_step = 1 to 5

- The assistant should:
  - Track which step the user is in
  - Move forward after completion
  - Revisit steps if needed

---

#### Interaction Behavior

- After each step, the assistant should:
  - Ask if user wants to continue
  - Suggest next step
  - Allow user to switch topics

---

#### Constraints

- Do NOT make the flow rigid
- Do NOT block user interaction
- Keep flow flexible and user-driven

---

#### Output Requirements

The output must include:

- List of guided steps
- Flow movement logic
- Progress tracking structure
- Interaction behavior between steps

---

#### Completion Criteria

This step is complete when:

- Full learning flow is clearly defined
- Assistant can guide user step-by-step
- Flow remains flexible and interactive

---

### Step 8 — Implement Free Chat Handling

#### Objective

Define how the assistant handles user questions outside the guided flow while maintaining continuity.

---

#### Scope

This step must define:

- How the assistant responds to random user queries
- How it integrates free chat with guided flow
- How it maintains context

---

#### What to Build

The assistant must:

- Allow users to ask questions at any time
- Answer questions directly and clearly
- After answering:
  - Suggest continuing guided flow
  - Provide next step recommendation

---

#### Behavior Logic

- If user asks a question:
  - Detect intent
  - Respond accordingly

- After response:
  - Ask:
    - “Do you want to continue step-by-step guidance?”
  - Suggest relevant next step

---

#### Flow Integration

- The assistant must:

  - Maintain current_step (if in guided flow)
  - Return user to flow after answering
  - Allow user to:
    - Stay in free mode
    - Switch back to guided mode

---

#### Constraints

- Do NOT ignore guided flow
- Do NOT force user into flow
- Keep interaction flexible

---

#### Output Requirements

The output must include:

- Free chat handling logic
- How assistant responds to random queries
- How flow continuity is maintained

---

#### Completion Criteria

This step is complete when:

- Assistant can handle free questions
- Guided flow is not broken
- User can move between modes smoothly

---

### Step 9 — Apply Personalization Logic

#### Objective

Define how the assistant adapts its responses based on user type, knowledge level, and behavior.

---

#### Scope

This step must define:

- Different user types
- How responses change based on user type
- How personalization is applied during interaction

---

#### What to Build

Define user categories:

1. Beginner (First-time voter)
2. Confused user
3. Aware/experienced user

---

#### Personalization Rules

- Beginner:
  - Use very simple language
  - Provide step-by-step explanations
  - Include examples and analogies

- Confused user:
  - Break explanations into smaller parts
  - Rephrase content
  - Ask confirmation:
    - “Did this make sense?”
    - “Do you want a simpler explanation?”

- Aware user:
  - Skip basic explanations
  - Provide concise and structured responses
  - Focus on timeline and actions

---

#### Application Logic

- Use user_profile (from onboarding):

  user_profile = {
    level: beginner / intermediate / advanced,
    type: first_time / confused / aware,
    mode: guided / free
  }

- The assistant must:
  - Adjust response complexity
  - Adjust explanation depth
  - Adjust interaction style

---

#### Constraints

- Do NOT give same response to all users
- Do NOT overcomplicate logic
- Keep personalization clear and consistent

---

#### Output Requirements

The output must include:

- User categories
- Personalization rules
- How personalization is applied in responses

---

#### Completion Criteria

This step is complete when:

- Assistant adapts based on user type
- Responses feel tailored to the user
- Interaction becomes more effective

---

### Step 10 — Implement Confusion Handling

#### Objective

Define how the assistant detects user confusion and responds to resolve it effectively.

---

#### Scope

This step must define:

- How confusion is detected
- How the assistant responds to confusion
- How the assistant recovers the user back to understanding

---

#### What to Build

Define confusion detection signals:

- User says:
  - “I don’t understand”
  - “This is confusing”
- Repeated questions
- Irrelevant or mismatched responses

---

#### Response Logic

When confusion is detected, the assistant must:

- Simplify the explanation
- Break content into smaller parts
- Use examples or analogies
- Rephrase the explanation

---

#### Recovery Behavior

The assistant must:

- Ask confirmation:
  - “Did this make sense?”
  - “Do you want a simpler explanation?”

- Offer options:
  - Repeat explanation
  - Move to a different topic
  - Continue step-by-step

---

#### Integration with Flow

- Maintain current_step
- Do NOT reset user progress
- Help user continue from where they got stuck

---

#### Constraints

- Do NOT ignore confusion signals
- Do NOT repeat the same explanation without change
- Always adapt response

---

#### Output Requirements

The output must include:

- Confusion detection signals
- Response handling logic
- Recovery flow

---

#### Completion Criteria

This step is complete when:

- Assistant can detect confusion
- Assistant adapts response effectively
- User can recover and continue learning


---

### Step 11 — Define Response Structure

#### Objective

Define a standard format for all assistant responses to ensure clarity, consistency, and ease of understanding.

---

#### Scope

This step must define:

- How every response is structured
- What elements are included in responses
- When to include specific sections (e.g., steps, examples)

---

#### What to Build

Define the standard response format:

1. Title  
2. Simple Explanation  
3. Steps (if applicable)  
4. Example (if needed)  
5. Next suggestion or question  

---

#### Formatting Rules

- Use simple and clear language
- Avoid long paragraphs
- Break content into sections
- Use bullet points where helpful

---

#### Application Logic

- Concept-based queries:
  - Use explanation format

- Process-based queries:
  - Use step-by-step format

- Beginner users:
  - Include examples and analogies

- Advanced users:
  - Keep responses concise

---

#### Interaction Behavior

- Always end with:
  - A suggestion  
  - Or a follow-up question  

Example:
- “Do you want to continue to the next step?”
- “Would you like a simpler explanation?”

---

#### Constraints

- Do NOT give unstructured responses
- Do NOT overload with information
- Maintain readability at all times

---

#### Output Requirements

The output must include:

- Defined response format
- Rules for applying format
- Examples of structured responses

---

#### Completion Criteria

This step is complete when:

- All responses follow a consistent structure
- Information is easy to understand
- Interaction remains engaging


---

### Step 12 — Integrate Google Services

#### Objective

Define how Google Services will be integrated into the system in a meaningful and functional way.

---

#### Scope

This step must define:

- Which Google services are used
- How they are used in the system
- Why they are relevant to the solution

---

#### What to Build

Minimum requirement:

- Cloud Run:
  - Used to deploy the application
  - Provides a live, accessible URL

---

#### Optional Integrations (if feasible)

- Firebase:
  - Store user session or interaction data

- Vertex AI:
  - Use as the underlying AI model for responses

---

#### Integration Logic

- The assistant must:
  - Be deployable using Cloud Run
  - Be accessible via a public URL

- If optional services are used:
  - Clearly define their role
  - Ensure they are actually used (not dummy)

---

#### Constraints

- Do NOT include unused services
- Do NOT add integrations without purpose
- Keep implementation minimal and meaningful

---

#### Output Requirements

The output must include:

- List of Google services used
- Description of how each service is integrated
- Justification of usage

---

#### Completion Criteria

This step is complete when:

- At least one Google service is integrated (Cloud Run)
- The system can be deployed
- Integration is meaningful and functional

---

### Step 13 — Test Core Scenarios

#### Objective

Validate that the assistant behaves correctly across different user scenarios and interactions.

---

#### Scope

This step must define:

- Test scenarios
- Expected assistant behavior
- Validation of logic and flow

---

#### What to Test

Define the following scenarios:

1. First-Time User
   - User has no knowledge
   - Assistant should:
     - Start from basics
     - Use simple language
     - Guide step-by-step

---

2. Confused User
   - User expresses confusion
   - Assistant should:
     - Simplify explanation
     - Rephrase content
     - Ask confirmation

---

3. Aware User
   - User already knows basics
   - Assistant should:
     - Skip basics
     - Provide concise answers
     - Focus on process/timeline

---

4. Free Chat Scenario
   - User asks random questions
   - Assistant should:
     - Answer directly
     - Suggest returning to flow

---

5. Edge Cases
   - “Help me”
   - “I don’t know what to ask”

   Assistant should:
     - Provide options
     - Start guided flow

---

#### Validation Criteria

Check if:

- Responses are clear and simple
- Guided flow works correctly
- Free chat does not break flow
- Personalization is applied
- Confusion handling works

---

#### Constraints

- Do NOT skip testing scenarios
- Do NOT assume correctness without validation

---

#### Output Requirements

The output must include:

- Test scenarios executed
- Observed behavior
- Issues found (if any)
- Suggestions for improvement

---

#### Completion Criteria

This step is complete when:

- All scenarios are tested
- System behaves as expected
- Any issues are identified

---

### Step 14 — Improve and Fix Issues

#### Objective

Refine the assistant based on testing results to improve clarity, logic, and user experience.

---

#### Scope

This step must define:

- How identified issues are fixed
- How system quality is improved
- How consistency is maintained

---

#### What to Improve

Based on testing results, focus on:

- Clarity of responses
- Flow continuity
- Personalization accuracy
- Confusion handling effectiveness
- Response structure consistency

---

#### Improvement Actions

- Simplify complex explanations
- Fix incorrect or unclear logic
- Improve step transitions in guided flow
- Enhance follow-up questions
- Ensure response format consistency

---

#### Validation After Fixes

- Re-test key scenarios
- Confirm improvements are effective
- Ensure no new issues are introduced

---

#### Constraints

- Do NOT introduce new features
- Do NOT overcomplicate the system
- Focus only on fixing and refining existing behavior

---

#### Output Requirements

The output must include:

- List of issues fixed
- Description of improvements made
- Updated behavior or logic (if changed)

---

#### Completion Criteria

This step is complete when:

- All major issues are resolved
- Responses are clear and consistent
- System behavior aligns with PRD


---

### Step 15 — Deploy Application

#### Objective

Deploy the assistant as a live application using Google Cloud Run.

---

#### Scope

This step must define:

- How the application is deployed
- How it becomes accessible via a public URL
- Basic deployment requirements

---

#### What to Build

- Prepare the application for deployment
- Use Google Cloud Run to host the application
- Ensure the application is accessible via a public URL

---

#### Deployment Requirements

- The system must:
  - Run without errors
  - Be accessible via a browser
  - Respond to user inputs correctly

---

#### Integration Logic

- The deployed application should:
  - Connect to the assistant logic
  - Allow user interaction
  - Maintain defined behavior from PRD

---

#### Constraints

- Do NOT overcomplicate deployment
- Use minimal configuration required
- Ensure stability over complexity

---

#### Output Requirements

The output must include:

- Deployment steps performed
- Live application URL
- Confirmation that system is working

---

#### Completion Criteria

This step is complete when:

- Application is successfully deployed
- Public URL is accessible
- Assistant works correctly in live environment

---

### Step 16 — Prepare README

#### Objective

Create a clear and structured README file that explains the project, its purpose, and how it works.

---

#### Scope

This step must define:

- What information is included in the README
- How the project is explained to others
- How clarity and structure are maintained

---

#### What to Include

The README must contain:

1. Project Title  
   - Name of the project

2. Problem Statement  
   - What problem the system solves

3. Solution Overview  
   - What the assistant does

4. Key Features  
   - Core functionalities of the system

5. How It Works  
   - Explanation of system logic and flow

6. Technology Used  
   - Tools and platforms (e.g., Antigravity, Google Cloud)

7. Assumptions  
   - Any assumptions made during development

---

#### Writing Guidelines

- Keep language simple and clear
- Avoid long paragraphs
- Use bullet points where needed
- Focus on clarity over complexity

---

#### Constraints

- Do NOT include sensitive information
- Do NOT overcomplicate explanations
- Keep it concise and readable

---

#### Output Requirements

The output must include:

- Complete README content
- Proper section structure
- Clear explanations of the system

---

#### Completion Criteria

This step is complete when:

- README clearly explains the project
- Anyone can understand the system by reading it
- Structure is clean and professional

---

### Step 17 — Create LinkedIn Post

#### Objective

Create a clear and professional LinkedIn post to showcase the project and its value.

---

#### Scope

This step must define:

- What content should be included in the post
- How the project is presented
- How clarity and engagement are maintained

---

#### What to Include

The LinkedIn post must contain:

1. Introduction  
   - Brief description of the project

2. Problem Statement  
   - Why this problem matters

3. Solution  
   - What the assistant does

4. Key Highlights  
   - Main features or strengths

5. Visual Content  
   - Screenshot or image of the project

6. Tags and Hashtags  
   - Tag relevant organizations  
   - Use:
     - #BuildWithAI  
     - #PromptWarsVirtual  

---

#### Writing Guidelines

- Keep content simple and engaging
- Avoid long paragraphs
- Highlight impact clearly
- Make it easy to read

---

#### Constraints

- Do NOT include sensitive or private data
- Do NOT make exaggerated claims
- Keep it authentic and professional

---

#### Output Requirements

The output must include:

- Complete LinkedIn post content
- Proper structure and clarity
- Relevant hashtags and tags

---

#### Completion Criteria

This step is complete when:

- Post clearly explains the project
- It is engaging and professional
- It is ready to be published