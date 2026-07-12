# 🏥 AI Medical Assistant

A full-stack AI-powered medical assistant built with **Spring Boot (Java 21)** + **React (Vite + Tailwind CSS)** using the **Groq API** for ultra-fast AI inference.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure register/login with BCrypt + JWT tokens |
| 💬 AI Health Chat | Real-time medical Q&A via Groq LLaMA 3.3 70B |
| 🩺 Symptom Checker | Multi-symptom analysis with disease & severity info |
| 💊 Medicine Info | Drug uses, dosage, side effects, alternatives |
| 📸 Image Analysis | Skin/eye/tongue image analysis via Groq Vision |
| 📄 PDF Reports | Download professional medical reports via OpenPDF |
| 👨‍💼 Admin Dashboard | User management, analytics charts |

---

## 🚀 Quick Start

### Prerequisites
- Java 21
- Maven (see below)
- MySQL 8.0 (running locally)
- Node.js 18+
- A **Groq API key** (free at [console.groq.com](https://console.groq.com))

---

### 1. Configure the Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Your MySQL password
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Your Groq API key (get free at console.groq.com)
groq.api.key=gsk_YOUR_KEY_HERE
```

The database `ai_medical_db` will be **created automatically** on first run.

---

### 2. Start the Backend

**Option A — If Maven is on your PATH:**
```bash
cd backend
mvn spring-boot:run
```

**Option B — Using full Maven path (Windows):**
```powershell
cd backend
& "C:\ProgramData\chocolatey\bin\mvn.cmd" spring-boot:run
```

**Option C — If you have IntelliJ IDEA:**
Open `backend/` as a Maven project → Run `AiMedicalApplication`

Backend runs on: **http://localhost:8080**

---

### 3. Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

---

## 📁 Project Structure

```
AI_Medical_Assistant/
├── backend/                    ← Spring Boot (Java 21)
│   ├── pom.xml
│   └── src/main/java/com/medical/ai/
│       ├── ai/                 ← GroqService (text + vision)
│       ├── controller/         ← REST endpoints
│       ├── dto/                ← Request/Response DTOs
│       ├── entity/             ← JPA entities (MySQL)
│       ├── exception/          ← Global error handler
│       ├── repository/         ← Spring Data JPA repos
│       ├── security/           ← JWT + Spring Security
│       ├── service/            ← Business logic
│       └── util/               ← File storage
│
└── frontend/                   ← React + Vite + Tailwind
    └── src/
        ├── context/            ← Auth context
        ├── pages/              ← All 8 pages
        ├── components/         ← Reusable UI components
        └── services/           ← Axios API calls
```

---

## 🔌 API Endpoints

| Method | URL | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | ❌ Public |
| POST | `/api/auth/login` | Login user | ❌ Public |
| GET | `/api/user/profile` | Get profile | ✅ JWT |
| POST | `/api/chat/message` | AI chat | ✅ JWT |
| GET | `/api/chat/history` | Chat history | ✅ JWT |
| POST | `/api/symptoms/check` | Symptom analysis | ✅ JWT |
| GET | `/api/medicine/info?name=X` | Medicine info | ✅ JWT |
| POST | `/api/image/analyze` | Image analysis | ✅ JWT |
| POST | `/api/report/generate` | Generate PDF | ✅ JWT |
| GET | `/api/admin/users` | All users | ✅ ADMIN |
| DELETE | `/api/admin/users/{id}` | Delete user | ✅ ADMIN |
| GET | `/api/admin/analytics` | Stats | ✅ ADMIN |

---

## 🤖 AI Models Used (Groq)

| Feature | Model |
|---|---|
| Chat / Symptom / Medicine | `llama-3.3-70b-versatile` |
| Image Analysis | `llama-3.2-11b-vision-preview` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| UI Libraries | Framer Motion, React Icons, React Dropzone, Recharts |
| Backend | Spring Boot 3.3, Java 21, Maven |
| Security | Spring Security 6, JWT (JJWT 0.12.3) |
| Database | MySQL 8 + Spring Data JPA + Hibernate |
| AI | Groq API (LLaMA 3.3 + Vision) |
| PDF | OpenPDF 1.3.30 |

---

## ⚠️ Medical Disclaimer

This application provides AI-generated health information for **educational purposes only**. It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
