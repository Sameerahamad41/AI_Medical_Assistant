<div align="center">
  
# 🏥 AI-Powered Medical Assistant

A highly advanced, full-stack medical application built with **Spring Boot (Java 21)** and **React (Vite + Tailwind CSS)**. 

This platform acts as a 24/7 virtual health companion, empowering users with instant Voice-to-Text medical analysis, Optical Character Recognition (OCR) for decoding complex lab results, and an HTML5 Geolocation-powered Emergency SOS protocol.

</div>

---

## ✨ Core Features

*   🎙️ **Interactive Voice AI Chat:** Talk directly to the medical AI using the native browser **Web Speech API**. The AI processes natural language via the ultra-fast Groq LLM API and replies with text-to-speech audio.
*   📄 **Medical Document OCR (Vision AI):** Upload photos of complex lab results or physical prescriptions. The Groq Vision AI extracts the text and translates complex medical jargon (like `WBC`, `HbA1c`) into simple, layman's terms.
*   🚑 **Emergency SOS Protocol:** A life-saving feature utilizing **HTML5 Geolocation**, **Nominatim Reverse Geocoding**, and **OpenStreetMap Overpass APIs** to instantly locate the user, map nearby hospitals within a 5km radius, and provide 1-click emergency dialing.
*   📅 **Smart Appointment Booking:** The AI dynamically assesses symptom severity and automatically routes users to an Appointment system, pre-recommending the specific medical specialist they need.
*   🔐 **Enterprise-Grade Security:** Fully secured backend using **Spring Security**, stateless **JWT Authentication**, and **Bcrypt** password hashing with Role-Based Access Control (RBAC) for the Admin Dashboard.
*   📊 **Admin Analytics Dashboard:** A secure, protected route for administrators to manage users, view platform usage, and track active doctor appointments.

---

## 🛠️ Technology Stack

### Frontend Architecture
*   **Framework:** React 18, Vite 5
*   **Styling:** Tailwind CSS (Glassmorphism design, mobile-responsive)
*   **State & Routing:** React Hooks, React Router DOM
*   **APIs:** HTML5 Geolocation API, Web Speech API

### Backend Architecture
*   **Core:** Java 21, Spring Boot 3.3
*   **Database & ORM:** MySQL 8, Spring Data JPA, Hibernate
*   **Security:** Spring Security 6, JWT (JJWT)
*   **Integrations:** RestTemplate (for external API calls), OpenPDF (for medical report generation)

### Artificial Intelligence
*   **Text/Chat Generation:** Groq LLM API (`llama-3.3-70b-versatile`)
*   **OCR & Image Analysis:** Groq Vision API (`llama-3.2-11b-vision-preview`)

---

## 🚀 Local Setup & Installation

### Prerequisites
*   Java 21 & Maven
*   Node.js 18+
*   MySQL 8.0 (running locally on port 3306)
*   A free **Groq API key** from [console.groq.com](https://console.groq.com)

### 1. Configure the Backend Environment
Because this project is deployment-ready, it uses Environment Variables. You can either set these in your OS, or temporarily place them in `backend/src/main/resources/application.properties` for local testing:

```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/ai_medical_db?createDatabaseIfNotExist=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:admin}
groq.api.key=${GROQ_API_KEY:your_groq_api_key_here}
```
*(Note: The database `ai_medical_db` is created automatically on startup)*

### 2. Start the Spring Boot Backend
Navigate to the `backend` folder and run:
```bash
cd backend
mvn spring-boot:run
```
*Backend runs on: `http://localhost:8080`*

### 3. Start the React Frontend
Navigate to the `frontend` folder, install dependencies, and run Vite:
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🌐 Production Deployment Guide

This repository is pre-configured for modern, decoupled full-stack deployment.

1.  **Database:** Host a MySQL database on **Aiven** or **Railway**. 
2.  **Backend (Render / Railway):** Connect your GitHub repo to a PaaS provider. Inject your `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `GROQ_API_KEY`, and `JWT_SECRET` securely into the environment variables dashboard.
3.  **Frontend (Vercel / Netlify):** Deploy the `frontend` directory. Add an environment variable named `VITE_API_URL` pointing to your deployed backend (e.g., `https://my-backend.onrender.com/api`).

---

## ⚠️ Medical Disclaimer

This application utilizes artificial intelligence to provide health information for **educational and portfolio demonstration purposes only**. It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional or dial emergency services directly in a crisis.
