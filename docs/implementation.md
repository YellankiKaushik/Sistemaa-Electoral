# IMPLEMENTATION PLAN — Sistemaa Electoral

## 1. Purpose

This document defines how the Election Education Assistant system will be built into a working application.

- PRD.md → defines system logic and behavior
- EXECUTION.md → defines step-by-step system design
- IMPLEMENTATION.md → defines how to convert logic into code

---

## 2. Implementation Approach

The system will follow a hybrid architecture:

- Rule-based logic (Primary system)
- AI API (Fallback system)

---

## 3. System Architecture

### 3.1 Core Layers

The system will consist of:

1. Input Layer
   - Receives user query

2. Logic Engine (Primary)
   - Intent detection
   - Guided flow handling
   - Personalization
   - Confusion handling

3. API Layer (Fallback)
   - Used ONLY when logic cannot handle query

4. Response Engine
   - Formats response based on structure rules

5. Output Layer
   - Sends response to user (UI / API response)

---

## 4. Decision Flow

1. User sends input
2. System checks:
   - Does it match predefined logic?
     - YES → Handle using logic engine
     - NO → Send to AI API
3. Response is formatted
4. Sent back to user

---

## 5. Rules

- Logic-first system (API is fallback only)
- No unnecessary API calls
- Maintain PRD behavior strictly
- Keep system simple and modular

---

## 6. Tech Stack

The system will use a simple and efficient stack:

### Backend
- Node.js (JavaScript runtime)
- Express.js (API framework)

### Frontend
- Basic HTML, CSS, JavaScript
- Simple chat interface (no heavy frameworks)

### AI API (Fallback Only)
- OpenAI / Gemini (to be integrated later if required)

### Deployment
- Google Cloud Run

---

## 7. Project Structure

The project will be organized as follows:

/project
├── app/                # Frontend (UI)
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── server/             # Backend (API)
│   ├── server.js
│   ├── routes/
│   │   └── chat.js
│   └── services/
│       ├── logicEngine.js
│       ├── intentService.js
│       ├── flowService.js
│       ├── personalizationService.js
│       ├── confusionService.js
│       └── apiFallback.js
│
├── logic/              # Existing logic (.md files)
├── docs/               # PRD + EXECUTION + IMPLEMENTATION
├── README.md


---

## 8. Backend Core Setup

### 8.1 Objective

Set up the backend server and create the main API endpoint to handle user queries.

---

### 8.2 Server Setup

- Create a Node.js server using Express.js
- Server will:
  - Accept incoming requests
  - Process user input
  - Return structured responses

---

### 8.3 API Endpoint

Create a main endpoint:

POST /chat

---

### 8.4 Request Format

The API will receive:

{
  "message": "User input text",
  "user_profile": {
    "level": "beginner/intermediate/advanced",
    "type": "first_time/confused/aware",
    "mode": "guided/free"
  },
  "current_step": 1
}

---

### 8.5 Response Format

The API will return:

{
  "response": "Formatted assistant response",
  "next_step": 2,
  "status": "success"
}

---

### 8.6 Responsibilities

The server will:

- Receive user input
- Pass input to logic engine
- Get processed response
- Return formatted output

---

### 8.7 Constraints

- Do NOT include business logic inside server.js
- Keep server as a routing layer only
- All logic must go into services/

---

## 9. Logic Engine

### 9.1 Objective

Create a central logic engine that connects all system components and processes user input.

---

### 9.2 Core Responsibility

The logic engine will:

- Receive user input from server
- Detect intent
- Apply guided flow logic
- Apply personalization
- Handle confusion (if detected)
- Decide response source (logic or API)
- Return final structured response

---

### 9.3 Flow of Execution

1. Receive:
   - message
   - user_profile
   - current_step

2. Detect intent:
   - Use intentService

3. Check:
   - If intent is supported by logic:
     - YES → proceed with logic flow
     - NO → trigger API fallback

4. Apply:
   - Guided flow (if in guided mode)
   - Free chat handling (if in free mode)

5. Apply:
   - Personalization rules

6. Apply:
   - Confusion handling (if needed)

7. Format:
   - Response using response structure

8. Return:
   - response
   - next_step

---

### 9.4 Connected Services

The logic engine will use:

- intentService.js
- flowService.js
- personalizationService.js
- confusionService.js
- apiFallback.js

---

### 9.5 Decision Rule

- Logic-first system:
  - Always try logic
  - Use API ONLY if logic fails

---

### 9.6 Constraints

- Keep logic modular
- Do NOT mix responsibilities
- Each service handles one role

---

## 10. Intent Service

### 10.1 Objective

Implement intent detection logic in code using simple keyword/pattern matching.

---

### 10.2 Supported Intents

The system must detect:

- basics
- timeline
- process
- action_guidance
- question
- confusion

---

### 10.3 Detection Logic

- Use simple keyword matching (no NLP)

Example:

- basics → ["what is election", "meaning", "election kya hai"]
- timeline → ["when", "timeline", "dates"]
- process → ["how to vote", "steps", "process"]
- action_guidance → ["what should I do", "documents", "where to vote"]
- confusion → ["i don’t understand", "confusing", "not clear"]
- question → default fallback

---

### 10.4 Priority Rules

- confusion → highest priority  
- question → second priority  
- others → normal flow  

---

### 10.5 Output Format

Return:

{
  "intent": "detected_intent"
}

---

### 10.6 Constraints

- Keep logic simple
- Avoid overfitting patterns
- Do NOT use external libraries

---

## 11. Flow Service

### 11.1 Objective

Implement the guided flow system to control step-by-step learning and navigation.

---

### 11.2 Flow Steps

Define steps:

1. Basics  
2. Importance  
3. Timeline  
4. Process  
5. Actions  

---

### 11.3 Step Control Logic

- Use:
  current_step (1–5)

- Behavior:
  - Move to next step → current_step + 1
  - Stay on step → if user asks related question
  - Jump step → based on intent

---

### 11.4 Input Handling

Based on:

- intent  
- user_profile.mode (guided / free)

---

### 11.5 Output

Return:

{
  "content": "step explanation",
  "next_step": number
}

---

### 11.6 Flow Rules

- Guided mode:
  - Follow sequence
  - Suggest next step

- Free mode:
  - Do not force step order
  - Allow jumping

---

### 11.7 Constraints

- Do NOT make flow rigid
- Allow user flexibility
- Maintain current_step properly

---

## 12. Personalization Service

### 12.1 Objective

Adapt assistant responses based on user_profile to improve clarity and relevance.

---

### 12.2 User Types

The system must handle:

- Beginner (first-time voter)
- Confused user
- Aware user

---

### 12.3 Input

Uses:

- user_profile.level
- user_profile.type
- user_profile.mode

---

### 12.4 Adaptation Logic

#### Beginner
- Use simple language
- Explain step-by-step
- Include examples

#### Confused
- Break into small parts (1–2 sentences)
- Rephrase explanations
- Ask confirmation frequently

#### Aware
- Use concise language
- Skip basics
- Use bullet points

---

### 12.5 Output Behavior

Modify:

- Response length
- Explanation depth
- Tone (simple vs concise)

---

### 12.6 Constraints

- Do NOT give same response for all users
- Keep logic consistent
- Maintain neutrality
---

## 13. Confusion Service

### 13.1 Objective

Detect and handle user confusion by simplifying responses and guiding recovery.

---

### 13.2 Detection Signals

Detect confusion when:

- User says:
  - "I don't understand"
  - "This is confusing"
  - "Not clear"
- Repeated similar queries
- Irrelevant or mismatched responses

---

### 13.3 Handling Logic

When confusion is detected:

- Simplify language
- Break response into smaller parts
- Rephrase explanation
- Use examples or analogies

---

### 13.4 Recovery Behavior

After simplifying:

- Ask confirmation:
  - "Did this make sense?"
  - "Do you want a simpler explanation?"

- Offer options:
  - Repeat explanation
  - Change topic
  - Continue to next step

---

### 13.5 Flow Integration

- Maintain current_step
- Do NOT reset user progress
- Allow user to continue from same point

---

### 13.6 Constraints

- Do NOT repeat same explanation
- Always adapt response
- Keep responses short and clear

---

## 14. API Fallback Service

### 14.1 Objective

Handle user queries that cannot be answered using predefined logic by using an AI API.

---

### 14.2 When to Trigger API

Call API ONLY when:

- Intent is:
  - question (generic)
  - not matched in logic

- OR:
  - No relevant response from logic engine

---

### 14.3 API Behavior

- Send:
  - User message
  - Context (optional: user_profile)

- Receive:
  - AI-generated response

---

### 14.4 Integration Logic

Inside logic engine:

- If logic fails:
  → call apiFallback.js  
- Else:
  → use system logic  

---

### 14.5 Constraints

- Do NOT call API for:
  - basics
  - timeline
  - process
  - action_guidance
  - confusion

- Minimize API usage

---

### 14.6 Output Handling

- API response must:
  - Follow response structure
  - Be simplified if needed
  - Pass through personalization layer

---

### 14.7 API Key Requirement

- Requires:
  - API key (to be added later)

---

### 14.8 Error Handling

If API fails:

- Return:
  - "Sorry, I couldn't fetch that. Let's continue with guided steps."


  ---

## 15. Response Formatter

### 15.1 Objective

Format all assistant responses into a consistent, structured output as defined in PRD.

---

### 15.2 Standard Response Structure

Every response must include:

1. Title  
2. Simple Explanation  
3. Steps (if applicable)  
4. Example (if needed)  
5. Next Suggestion  
6. Confirmation  

---

### 15.3 Input

Receives:

- Raw response content (from logic or API)
- user_profile
- current_step

---

### 15.4 Formatting Logic

- Convert raw content into structured format
- Apply:
  - Simple language
  - Short sections
  - Bullet points

---

### 15.5 Adaptive Behavior

- Beginner:
  - Include examples
  - Use simple language

- Confused:
  - Smaller chunks
  - Add confirmation

- Aware:
  - Keep concise
  - Skip unnecessary details

---

### 15.6 Output Format

Return final response as:

{
  "title": "",
  "explanation": "",
  "steps": [],
  "example": "",
  "next": "",
  "confirmation": ""
}

---

### 15.7 Constraints

- Do NOT return unstructured text
- Do NOT overload content
- Maintain readability

---

## 16. Frontend UI

### 16.1 Objective

Create a simple user interface to interact with the assistant.

---

### 16.2 UI Components

The interface must include:

- Chat display area
- Input text box
- Send button
- Optional:
  - Quick option buttons (Entry step)

---

### 16.3 Entry Experience (UI)

Display initial options:

- Learn election basics
- Understand full process
- View timeline
- Ask a question

---

### 16.4 Interaction Flow

1. User enters message
2. Message sent to backend (/chat API)
3. Receive structured response
4. Display response in chat format

---

### 16.5 Response Rendering

Display:

- Title (bold)
- Explanation (paragraph)
- Steps (bullet points)
- Example (highlighted)
- Next suggestion (prompt)
- Confirmation (question)

---

### 16.6 State Management

Maintain:

- user_profile
- current_step

(on frontend or backend as needed)

---

### 16.7 Constraints

- Keep UI simple
- Do NOT use heavy frameworks
- Focus on functionality over design
---

## 17. Deployment Setup

### 17.1 Objective

Deploy the application using Google Cloud Run to make it accessible via a public URL.

---

### 17.2 Deployment Components

- Application (Frontend + Backend)
- Docker container
- Google Cloud Run service

---

### 17.3 Containerization

- Create a Dockerfile
- Include:
  - Node.js environment
  - Application code
  - Required dependencies

---

### 17.4 Deployment Flow

1. Build Docker image
2. Push image to Artifact Registry
3. Deploy to Cloud Run
4. Get public HTTPS URL

---

### 17.5 Runtime Behavior

- App runs as a container
- Handles API requests (/chat)
- Serves frontend (optional)

---

### 17.6 Configuration

- Set environment variables:
  - PORT
  - API_KEY (if using AI API later)

---

### 17.7 Constraints

- Keep deployment simple
- Ensure app runs without errors
- Do NOT add unnecessary services


---

## 18. Complete Flow Example

### 18.1 Scenario

User:
- Is a first-time voter (beginner)
- Mode is guided

### 18.2 Execution Flow

1. User asks:
   "I want to learn about elections"

2. Intent:
   - basics (detected)

3. Profile:
   - Beginner mode

4. Flow Service:
   - Returns explanation for Step 1 (Basics)

5. Personalization:
   - Simple language
   - Include examples

6. Response:
{
  "title": "What is an Election?",
  "explanation": "...",
  "steps": ["..."],
  "example": "...",
  "next": "Shall we move to Step 2: Importance?",
  "confirmation": "Did that explanation make sense?"
}

---

### 18.3 Second Interaction

User:
- Confused after Step 1
- Asks: "I don't understand the voting process"

### 18.4 Execution Flow

1. Intent:
   - confusion (detected)

2. Confusion Service:
   - Simplifies explanation
   - Rephrases

3. Response:
{
  "title": "Simplified Voting Process",
  "explanation": "In simple terms...",
  "steps": ["..."],
  "example": "...",
  "next": "Would you like another explanation?",
  "confirmation": "Is this clearer?"
}

---

### 18.5 Third Interaction

User:
- Asks unrelated question
- "What is the election date?"

### 18.6 Execution Flow

1. Intent:
   - timeline (detected)

2. Flow Service:
   - Returns Step 3 (Timeline)

3. Response:
{
  "title": "Election Timeline",
  "explanation": "The election will be held on...",
  "next": "Shall we continue?"
}

---

## 19. Validation Rules

### 19.1 Pre-Launch Checklist

Before deployment, verify:

- [ ] Logic engine handles all intents
- [ ] Guided flow works end-to-end
- [ ] Personalization adapts correctly
- [ ] Confusion handling activates when needed
- [ ] API fallback triggers only when logic fails
- [ ] Response structure is consistent
- [ ] Frontend renders correctly
- [ ] All connections work

---

### 19.2 Edge Cases

Test scenarios:

- Empty input
- Very long input
- Mixed Hindi/English
- Multiple questions in one message
- Rapid succession messages
- Gibberish input

---

### 19.3 Testing Requirements

- Test each intent individually
- Test flow in guided mode
- Test flow in free mode
- Test confusion recovery twice
- Test API fallback
- Test all personalization levels
- Test with sample profiles

---

## 20. Monitoring & Maintenance

### 20.1 Logging

Log:

- User inputs
- Detected intents
- Decisions made
- API calls (if any)
- Responses generated

---

### 20.2 Error Handling

If errors occur:

- Return helpful messages to user
- Log error for debugging
- Keep system stable

---

### 20.3 Updates

Future updates can include:

- Adding more intents
- Integrating AI permanently
- Adding new flow steps
- Improving personalization

---

## 21. Constraints Summary

- Logic-first system (API fallback only)
- Keep explanations simple
- Personalize based on user profile
- Handle confusion with adaptation
- Maintain guided flow structure
- Use response format strictly
- Keep implementation modular and clean

