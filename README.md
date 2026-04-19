# 🏥 Clinical Sanctuary UI

<p align="center">
  <img src="./public/hero-banner.png" alt="Clinical Sanctuary UI Banner" width="100%">
</p>

![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)
![Frontend](https://img.shields.io/badge/frontend-HTML%20%2B%20JS-blue)
![Tailwind](https://img.shields.io/badge/styling-TailwindCSS-38B2AC?logo=tailwind-css)
![Status](https://img.shields.io/badge/status-live-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

A clean, lightweight frontend for interacting with the **Healthcare ML Prediction API**, deployed on Vercel.

---

## 🚀 Live Demo

👉 https://clinical-sanctuary-web.vercel.app  
👉 Backend: https://healthcare-ml-pipeline.onrender.com  

---

## 📸 Screenshots

### 🏠 Dashboard
<img width="1339" height="695" alt="2026-04-20 02 09 51" src="https://github.com/user-attachments/assets/59b79dd6-fd17-48bc-be76-cac521a31652" />

### 📝 Prediction Form
<img width="989" height="542" alt="2026-04-20 02 25 26" src="https://github.com/user-attachments/assets/bc00d99c-8fef-42da-a273-f8d33c572444" />

### 🔮 Result Output
<img width="1008" height="790" alt="prediction screen" src="https://github.com/user-attachments/assets/46a2e5cc-e94d-4643-9cc1-ae3ee2f518af" />

## 📊 Architecture

```mermaid
graph TD
    A[User] --> B[Frontend UI]
    B --> C[/api/v1/predict]
    C --> D[FastAPI Backend]
    D --> E[ML Model]
    E --> F[Response]
    F --> B
```

---

## ⚙️ Tech Stack

- HTML + JavaScript
- Tailwind CSS
- Vercel Hosting
- FastAPI Backend

---

## 🛠️ Local Setup

```bash
npm install
npm run dev
```

---

## ☁️ Deployment

```bash
npm run deploy
```

---

## 📄 License

MIT
