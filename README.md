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
![Dashboard](./public/screenshots/dashboard.png)

### 📝 Prediction Form
![Form](./public/screenshots/form.png)

### 🔮 Result Output
![Result](./public/screenshots/result.png)

---

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
