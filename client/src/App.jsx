import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { AuthScreen } from './components/AuthScreen.jsx';
import { Dashboard } from './components/Dashboard.jsx';
import { NotFound } from './components/NotFound.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Authentication Route */}
          <Route path="/login" element={<AuthScreen />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard defaultTab="quests" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/room"
            element={
              <ProtectedRoute>
                <Dashboard defaultTab="room" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/shop"
            element={
              <ProtectedRoute>
                <Dashboard defaultTab="shop" />
              </ProtectedRoute>
            }
          />

          {/* Root redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Themed 404 Route for Unmatched Paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
