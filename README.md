# Sistemaa Electoral 🗳️
### Your AI-Powered Guided Election Assistant

**Sistemaa Electoral** is an intelligent assistant designed to educate citizens, especially first-time voters, about the Indian election process. It provides a simple, structured, and interactive way to build confidence and participation in the democratic process.

---

## 🌟 Key Features

- **Guided Learning Path**: A structured 5-step journey covering Basics, Importance, Timeline, Process, and Actionable Steps.
- **Intent-Based Interaction**: Smart detection of user needs, allowing users to jump between topics or ask specific questions at any time.
- **Personalized Experience**: Adapts tone, complexity, and examples based on the user's knowledge level (Beginner vs. Aware) and profile (First-time Voter).
- **Confusion Recovery**: Detects when a user is stuck and automatically simplifies explanations, using analogies and micro-chunking to ensure clarity.
- **Logic-First Design**: A robust, rule-based engine handles core educational content, ensuring high accuracy and non-biased information.
- **AI Fallback Layer**: Seamlessly integrates AI to handle complex or out-of-scope queries while maintaining the guided flow.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- **Deployment**: Google Cloud Run (Dockerized)
- **Architecture**: Modular Service-Oriented Architecture (Intent, Flow, Personalization, Confusion, Formatter services).

---

## 🚀 How It Works

1. **Entry**: Users are presented with a friendly interface and quick-start options.
2. **Analysis**: Every message is processed by the **Logic Engine**, which identifies intent and consults the **Flow Service**.
3. **Personalization**: The response is tailored by the **Personalization Service** to match the user's profile.
4. **Validation**: The **Confusion Service** checks for signs of frustration, simplifying the message if needed.
5. **Formatting**: The **Response Formatter** ensures every message follows the PRD-mandated 6-point structure (Title, Explanation, Steps, Example, Next Suggestion, Confirmation).

---

## 📦 Deployment

The application is containerized using Docker and ready for deployment on **Google Cloud Run**.

### Local Setup
1. Clone the repository.
2. Run `npm install`.
3. Start the server: `npm start`.
4. Open `http://localhost:3000` in your browser.

---

## 📄 License
This project is developed for the **Prompt Wars Challenge 2**.

**Author**: Kaushik Yellanki