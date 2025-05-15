# 🏡 Real Estate Analysis Chatbot

This is a web-based chatbot built with **React** (frontend) and **Django** (backend) that allows users to ask questions about real estate trends. While it's designed to support AI features (like ChatGPT), the current version works using **sample CSV data** for responses.

---

## 💡 Features

- Users can type natural language queries like:
  - “Give me analysis of Wakad”
  - “Compare Ambegaon Budruk and Aundh demand trends”
  - “Show price growth for Akurdi over last 3 years”

- The system processes these queries and returns results using:
  - Filtered **CSV data**
  - Predefined rules for **area analysis**, **comparisons**, and **price trends**

---

## 🧠 How It Works

### Frontend (React)
- The UI allows user input via a chatbot interface
- Sends the query to the backend using `ApiService`
- Displays user messages and responses using `Message` and `QueryResult` components
- Auto-scrolls to the latest message

### Backend (Django)
- Receives the user's query
- Interprets it to decide the type of question:
  - Area Analysis
  - Area Comparison
  - Price Growth Over Time
- Loads and filters the real estate data from a CSV file
- Returns the filtered result as a response

> Note: This version does **not use AI yet**, but it's structured to plug in AI easily when needed.

---

## 📦 Project Structure

realstate_ai_project/
├── backend/
│ ├── views.py # Handles incoming query
│ ├── data_processor.py # Filters and analyzes CSV data
│ ├── llm_integration.py # Placeholder for AI (optional)
│ └── Sample_data.csv # Real estate data
└── frontend/
├── App.js # Main chat interface
├── components/
│ ├── ChatInput.js
│ ├── Message.js
│ └── QueryResult.js
└── services/
└── api.js # Sends query to backend






---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/HuzaifaAshfaque/realstate_ai_project.git
cd realstate_ai_project


cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver




cd frontend
npm install
npm start

```


💬 Sample Queries You Can Try
"Compare Wakad and Baner"

"Price trend in Kothrud over last 2 years"

"Demand analysis for Hinjewadi"



🧠 AI Integration (Optional / Future Scope)
To use OpenAI/ChatGPT in the future:

Add your API key in a .env file or Django settings

Modify llm_integration.py to call the LLM




📌 Author
Huzaifa Ashfaque
GitHub: @HuzaifaAshfaque


---

This project is licensed under the MIT License.



