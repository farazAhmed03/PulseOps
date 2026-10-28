# 📝 Modern MERN Stack Blog Platform

A production-ready MERN stack blog platform with MVC architecture, JWT authentication, role-based authorization, search, and author workspaces.

## 📁 Repository Structure
- `backend/` - Node.js & Express RESTful API with MongoDB / Mongoose.
- `frontend/` - React 18, Vite, and React Router client application.

## 🚀 Local Development Setup

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm start
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## ☁️ Production Deployment
- **Frontend Build**: `cd frontend && npm run build`
- **Reverse Proxy**: Nginx routing `/` to frontend static build and `/api` to Express on port 5000.
- **Process Manager**: PM2 for backend uptime (`pm2 start server.js --name blog-api`).

