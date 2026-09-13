import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ScholarProvider } from './context/ScholarContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Layout } from './components/Layout.jsx';

// Code-split top-level routes and page components
const AuthScreen = lazy(() => import('./components/AuthScreen.jsx').then(m => ({ default: m.AuthScreen })));
const NotFound = lazy(() => import('./components/NotFound.jsx').then(m => ({ default: m.NotFound })));

// Page views
const DashboardOverview = lazy(() => import('./components/pages/DashboardOverview.jsx').then(m => ({ default: m.DashboardOverview })));
const QuestsPage = lazy(() => import('./components/pages/QuestsPage.jsx').then(m => ({ default: m.QuestsPage })));
const RoomPage = lazy(() => import('./components/pages/RoomPage.jsx').then(m => ({ default: m.RoomPage })));
const ShopPage = lazy(() => import('./components/pages/ShopPage.jsx').then(m => ({ default: m.ShopPage })));
const SpiritPage = lazy(() => import('./components/pages/SpiritPage.jsx').then(m => ({ default: m.SpiritPage })));
const AchievementsPage = lazy(() => import('./components/pages/AchievementsPage.jsx').then(m => ({ default: m.AchievementsPage })));
const ProfileJourney = lazy(() => import('./components/pages/ProfileJourney.jsx').then(m => ({ default: m.ProfileJourney })));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage.jsx').then(m => ({ default: m.SettingsPage })));

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

            {/* Authenticated Application with Scholar Context & Persistent Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <ScholarProvider>
                    <Layout />
                  </ScholarProvider>
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/room" element={<RoomPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/spirit" element={<SpiritPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/profile" element={<ProfileJourney />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Backward compatibility redirects for legacy subpaths */}
              <Route path="/dashboard/quests" element={<Navigate to="/quests" replace />} />
              <Route path="/dashboard/room" element={<Navigate to="/room" replace />} />
              <Route path="/dashboard/shop" element={<Navigate to="/shop" replace />} />
              <Route path="/dashboard/spirit" element={<Navigate to="/spirit" replace />} />
              <Route path="/dashboard/achievements" element={<Navigate to="/achievements" replace />} />
            </Route>

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
