# 🗳️ Sistemaa Electoral — AI Election Assistant

## 📌 Overview

**Sistemaa Electoral** is a smart, multilingual AI assistant designed to simplify and explain the election process in an interactive and user-friendly way.

It helps users understand:
- Election basics  
- Importance of voting  
- Election timeline  
- Step-by-step voting process  
- What actions to take  

This solution is built for **real-world usability**, especially for first-time voters and citizens with limited awareness of electoral systems.

---

## 🎯 Challenge Alignment

**Vertical:** Election Process Education  

This assistant addresses:
- Lack of awareness about elections  
- Confusion around voting procedures  
- Language barriers  
- Need for structured and guided learning  

---

## ⚙️ Tech Stack

- **Backend:** Node.js + Express  
- **Frontend:** HTML, CSS, JavaScript  
- **AI Engine:** Google Gemini (Generative AI)  
- **Translation:** Google Cloud Translation API  
- **Deployment:** Google Cloud Run (Dockerized)

---

## 🧠 How It Works

The system follows a **hybrid intelligence model**:

### 1. Rule-Based Engine (Primary Layer)
- Detects user intent (topic / confusion / navigation)
- Guides users through a **5-step election learning flow**
- Ensures structured and predictable responses

### 2. AI Fallback Layer (Gemini)
- Handles unknown or open-ended queries  
- Provides dynamic explanations  
- Maintains response safety and validation  

### 3. Multilingual Pipeline
- Detects user language automatically  
- Translates input → processes → translates output  
- Supports Hinglish and mixed-language queries  

---

## 🔑 Core Features

- 🧭 Guided step-by-step election learning  
- 🤖 AI-powered fallback for complex questions  
- 🌐 Multilingual support (auto translation)  
- 🧠 Confusion detection & simplification  
- 🔒 Secure input validation & filtering  
- ⚡ Fast response with caching & rate limiting  

---

## 🔐 Security & Reliability

- API keys handled via environment variables  
- Input sanitization and validation  
- Rate limiting to prevent abuse  
- Prompt injection protection  
- Safe fallback responses  

---

## 📦 Deployment

The application is deployed on **Google Cloud Run** using Docker.

👉 **Live URL:**  
https://election-app-116362886136.asia-south1.run.app/

---

## 🧪 Testing

System tested across:

- Structured queries  
- Confusion scenarios  
- Noise inputs  
- Multilingual queries  
- Security edge cases  

---

## ⚠️ Assumptions

- Users may not have prior knowledge of elections  
- Users may input mixed or unclear language  
- System prioritizes clarity over complexity  

---

## 🚀 Outcome

A **production-ready AI assistant** that:
- Educates users about elections  
- Reduces confusion  
- Improves accessibility  
- Demonstrates real-world AI application  

---

## 🔗 Links

- **GitHub Repository:**  
  https://github.com/YellankiKaushik/Sistemaa-Electoral  

- **Live Application:**  
  https://election-app-116362886136.asia-south1.run.app/  