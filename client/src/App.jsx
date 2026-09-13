import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

// Code-split top-level routes to ensure minimal initial bundle for visitors
const AuthScreen = lazy(() => import('./components/AuthScreen.jsx').then(m => ({ default: m.AuthScreen })));
const Dashboard = lazy(() => import('./components/Dashboard.jsx').then(m => ({ default: m.Dashboard })));
const NotFound = lazy(() => import('./components/NotFound.jsx').then(m => ({ default: m.NotFound })));

function RouteLoadingFallback() {
  return (
    <div 
      className="min-h-screen bg-cozy-cream flex flex-col items-center justify-center p-6 text-cozy-brown-dark"
      role="status" 
      aria-live="polite"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 pixel-box bg-cozy-parchment rounded-pixel text-3xl mb-4 shadow-pixel select-none animate-pulse">
        📜
      </div>
      <p className="font-pixel text-base text-cozy-brown-dark tracking-wide">
        Gathering Parchment &amp; Quill...
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteLoadingFallback />}>
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
            <Route
              path="/dashboard/spirit"
              element={
                <ProtectedRoute>
                  <Dashboard defaultTab="spirit" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/achievements"
              element={
                <ProtectedRoute>
                  <Dashboard defaultTab="achievements" />
                </ProtectedRoute>
              }
            />

            {/* Root redirect to Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Themed 404 Route for Unmatched Paths */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
