import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPrompts from './pages/MyPrompts';
import UserGuide from './pages/UserGuide';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Exploration & Guide */}
              <Route path="/" element={<Home />} />
              <Route path="/guide" element={<UserGuide />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Personal Prompt Workspace */}
              <Route
                path="/my-prompts"
                element={
                  <ProtectedRoute>
                    <MyPrompts />
                  </ProtectedRoute>
                }
              />

              {/* Backward compatibility */}
              <Route
                path="/my-monitors"
                element={
                  <ProtectedRoute>
                    <MyPrompts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-articles"
                element={
                  <ProtectedRoute>
                    <MyPrompts />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Console */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}
