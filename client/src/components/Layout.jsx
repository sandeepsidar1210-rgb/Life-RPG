import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useScholar } from '../context/ScholarContext.jsx';
import { CelebrationModal } from './CelebrationModal.jsx';
import { SpiritEvolutionModal } from './SpiritEvolutionModal.jsx';
import { RoomUnlockModal } from './RoomUnlockModal.jsx';
import { AchievementBanner } from './AchievementBanner.jsx';
import { ToastContainer } from './Toast.jsx';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Overview', icon: '🏠', badgeKey: null },
  { path: '/quests', label: 'Study Quests', icon: '📜', badgeKey: 'quests' },
  { path: '/room', label: 'My Sanctuary', icon: '🛋️', badgeKey: null },
  { path: '/shop', label: 'Emporium', icon: '🛒', badgeKey: null },
  { path: '/spirit', label: 'Study Spirit', icon: '✨', badgeKey: 'spirit' },
  { path: '/achievements', label: 'Achievements', icon: '🏆', badgeKey: null },
  { path: '/profile', label: 'Scholar Journey', icon: '📊', badgeKey: null },
  { path: '/settings', label: 'Settings', icon: '⚙️', badgeKey: null },
];

export function Layout() {
  const {
    user,
    signOut,
    character,
    streak,
    equippedBadges,
    spirit,
    quests,
    theme,
    setTheme,
    playSound,
    // Modals
    celebrationData,
    showCelebration,
    handleCelebrationClose,
    currentSpiritEvolution,
    handleSpiritEvolutionClose,
    currentUnlockedRoom,
    handleRoomUnlockClose,
    achievementQueue,
    currentAchievement,
    handleAchievementDismiss,
    activeTriggerRef,
    // Toasts
    toasts,
    removeToast,
    handleSelectRoom
  } = useScholar();

  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeQuestCount = quests.filter((q) => q.status === 'active').length;

  const handleLogout = async () => {
    playSound('click');
    await signOut();
    navigate('/login', { replace: true });
  };

  const toggleTheme = () => {
    playSound('click');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-cozy-cream text-cozy-brown-dark font-sans selection:bg-cozy-terracotta-subtle flex flex-col md:flex-row">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Level-Up Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCelebrationClose}
        levelData={celebrationData}
        triggerRef={activeTriggerRef}
      />

      {/* Spirit Evolution Celebration Modal */}
      {!showCelebration && (
        <SpiritEvolutionModal
          isOpen={Boolean(currentSpiritEvolution)}
          onClose={handleSpiritEvolutionClose}
          evolutionData={currentSpiritEvolution}
          onInspectSpirit={() => {
            handleSpiritEvolutionClose();
            navigate('/spirit');
          }}
        />
      )}

      {/* Room Unlock Celebration Modal */}
      {!showCelebration && !currentSpiritEvolution && (
        <RoomUnlockModal
          isOpen={Boolean(currentUnlockedRoom)}
          onClose={handleRoomUnlockClose}
          room={currentUnlockedRoom}
          onNavigateToRoom={(room) => {
            handleSelectRoom(room);
            navigate('/room');
          }}
        />
      )}

      {/* Achievement Unlock Banner */}
      {!showCelebration && !currentSpiritEvolution && !currentUnlockedRoom && (
        <AchievementBanner
          achievement={currentAchievement}
          onDismiss={handleAchievementDismiss}
        />
      )}

      {/* =================================================================== */}
      {/* DESKTOP SIDEBAR                                                     */}
      {/* =================================================================== */}
      <aside 
        aria-label="Desktop Navigation Sidebar"
        className="hidden md:flex flex-col w-64 shrink-0 bg-cozy-parchment border-r-2 border-cozy-brown-dark sticky top-0 h-screen overflow-y-auto select-none"
      >
        {/* Brand Header */}
        <div className="p-4 border-b-2 border-cozy-brown-dark flex items-center gap-3">
          <div 
            className="w-10 h-10 pixel-box bg-cozy-cream rounded-pixel flex items-center justify-center text-xl shadow-pixel-sm border-2 border-cozy-brown-dark"
            aria-hidden="true"
          >
            ☕
          </div>
          <div>
            <h1 className="text-xl font-pixel text-cozy-brown-dark tracking-wide leading-none">
              Life RPG
            </h1>
            <p className="text-[11px] font-pixel text-cozy-brown-medium mt-1">
              Cozy Habit Sanctuary
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            let badge = null;
            if (item.badgeKey === 'quests' && activeQuestCount > 0) {
              badge = (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-pixel rounded-full bg-cozy-terracotta text-white font-bold">
                  {activeQuestCount}
                </span>
              );
            } else if (item.badgeKey === 'spirit' && spirit) {
              badge = (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-pixel rounded bg-cozy-sage-subtle text-cozy-sage-dark border border-cozy-sage-light">
                  St.{spirit.current_stage?.stage_number || 1}
                </span>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => playSound('click')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-pixel font-pixel text-xs sm:text-sm transition ${
                  isActive
                    ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark font-bold translate-x-1'
                    : 'text-cozy-brown-medium hover:bg-cozy-cream/80 hover:text-cozy-brown-dark border-2 border-transparent'
                }`}
              >
                <span className="text-base" aria-hidden="true">{item.icon}</span>
                <span className="truncate">{item.label}</span>
                {badge}
              </NavLink>
            );
          })}
        </nav>

        {/* Scholar Mini Profile & Footer Controls */}
        <div className="p-3 border-t-2 border-cozy-brown-dark bg-cozy-cream/50 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 truncate">
              <span className="text-lg select-none">🧙‍♂️</span>
              <div className="truncate">
                <p className="text-xs font-pixel text-cozy-brown-dark font-bold truncate">
                  {user?.email?.split('@')[0] || 'Scholar'}
                </p>
                <p className="text-[10px] text-cozy-brown-medium font-pixel">
                  LVL {character.level} Scholar
                </p>
              </div>
            </div>

            {/* Quick Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Cozy Evening Dark'} theme`}
              className="touch-target pixel-box-interactive bg-cozy-card text-cozy-brown-dark p-2 rounded-pixel text-xs shadow-pixel-sm"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full touch-target pixel-box-interactive bg-cozy-card hover:bg-cozy-terracotta-subtle hover:text-cozy-terracotta-dark text-cozy-brown-dark font-pixel text-xs py-2 px-3 rounded-pixel font-semibold transition flex items-center justify-center gap-2 shadow-pixel-sm"
          >
            <span aria-hidden="true">🚪</span>
            <span>Leave Haven</span>
          </button>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* MOBILE HEADER & DRAWER                                              */}
      {/* =================================================================== */}
      <div className="md:hidden flex flex-col sticky top-0 z-40 bg-cozy-parchment border-b-2 border-cozy-brown-dark shadow-pixel-sm">
        <div className="flex items-center justify-between p-3 gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playSound('click');
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="touch-target pixel-box-interactive bg-cozy-card text-cozy-brown-dark px-2.5 py-1.5 rounded-pixel text-base font-pixel"
              aria-label="Toggle navigation drawer"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
            <div className="flex items-center gap-1.5">
              <span className="text-xl">☕</span>
              <span className="font-pixel text-lg text-cozy-brown-dark font-bold">Life RPG</span>
            </div>
          </div>

          {/* Quick HUD Counters on Mobile */}
          <div className="flex items-center gap-2">
            <div className="pixel-box bg-cozy-card px-2 py-1 rounded-pixel flex items-center gap-1 text-xs font-pixel text-cozy-gold-dark font-bold">
              <span>🪙</span>
              <span>{character.cozy_coins}</span>
            </div>
            <div className="pixel-box bg-cozy-terracotta-subtle px-2 py-1 rounded-pixel flex items-center gap-1 text-xs font-pixel text-cozy-terracotta-dark font-bold">
              <span>🔥</span>
              <span>{streak.current_streak}</span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="pixel-box-interactive bg-cozy-card p-1.5 rounded-pixel text-xs"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t-2 border-cozy-brown-dark bg-cozy-parchment p-3 space-y-1.5"
              aria-label="Mobile Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      playSound('click');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-pixel font-pixel text-sm transition ${
                      isActive
                        ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark font-bold'
                        : 'text-cozy-brown-medium hover:bg-cozy-cream'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badgeKey === 'quests' && activeQuestCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-pixel rounded-full bg-cozy-terracotta text-white font-bold">
                        {activeQuestCount} active
                      </span>
                    )}
                  </NavLink>
                );
              })}

              <div className="pt-2 border-t border-cozy-border">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full pixel-box-interactive bg-cozy-card text-cozy-terracotta-dark font-pixel text-xs py-2 rounded-pixel font-bold flex items-center justify-center gap-2"
                >
                  <span>🚪</span>
                  <span>Log Out ({user?.email})</span>
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* =================================================================== */}
      {/* MAIN CONTENT WORKSPACE                                              */}
      {/* =================================================================== */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        {/* Persistent Desktop Top HUD Header */}
        <header className="hidden md:flex items-center justify-between gap-4 p-4 lg:px-8 border-b-2 border-cozy-brown-dark bg-cozy-cream/80 backdrop-blur sticky top-0 z-20">
          {/* Active Section & Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-2.5 py-1 bg-cozy-sage-subtle text-cozy-sage-dark text-xs font-pixel rounded border border-cozy-sage-light font-bold">
              LVL {character.level} Scholar
            </span>

            {/* Equipped Badges */}
            {equippedBadges.map((b) => (
              <span
                key={b.id}
                title={`Equipped Badge: ${b.item?.name}`}
                className="px-2 py-0.5 bg-cozy-gold-light text-cozy-gold-dark text-xs font-pixel rounded border border-cozy-gold-base flex items-center gap-1 shadow-pixel-sm font-bold"
              >
                <span>{b.item?.name?.includes('Dawn') ? '🌅' : '🌙'}</span>
                <span>{b.item?.name}</span>
              </span>
            ))}

            {/* Bound Study Spirit Companion Chip */}
            {spirit && (
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  navigate('/spirit');
                }}
                title="View Study Spirit Companion"
                className="px-2.5 py-1 bg-cozy-terracotta-subtle text-cozy-terracotta-dark hover:bg-cozy-terracotta hover:text-white text-xs font-pixel rounded border border-cozy-terracotta flex items-center gap-1.5 shadow-pixel-xs transition active:scale-95"
              >
                <span>✨</span>
                <span className="font-bold">{spirit.current_stage?.name || spirit.species?.name}</span>
                <span className="text-[10px] opacity-80">(St.{spirit.current_stage?.stage_number || 1})</span>
              </button>
            )}
          </div>

          {/* HUD Counters & Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Cozy Coins */}
            <motion.div
              key={character.cozy_coins}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.25 }}
              className="pixel-box bg-cozy-parchment px-3 py-1 rounded-pixel flex items-center gap-2 border-2 border-cozy-brown-dark shadow-pixel-sm"
              title={`${character.cozy_coins} Cozy Coins`}
            >
              <span className="text-base">🪙</span>
              <span className="font-pixel text-sm font-bold text-cozy-gold-dark">
                {character.cozy_coins} <span className="font-sans text-xs font-normal text-cozy-brown-medium">Coins</span>
              </span>
            </motion.div>

            {/* Daily Streak */}
            <motion.div
              key={streak.current_streak}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 0.25 }}
              className="pixel-box bg-cozy-terracotta-subtle px-3 py-1 rounded-pixel flex items-center gap-2 border-2 border-cozy-terracotta-dark shadow-pixel-sm"
              title={`${streak.current_streak} Day Streak`}
            >
              <span className="text-base">🔥</span>
              <span className="font-pixel text-sm font-bold text-cozy-terracotta-dark">
                {streak.current_streak} <span className="font-sans text-xs font-normal text-cozy-brown-medium">Days</span>
              </span>
            </motion.div>
          </div>
        </header>

        {/* Page Content Container with Smooth Page Transitions */}
        <main id="main-content" tabIndex={-1} className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto focus:outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Desktop Footer */}
        <footer className="w-full max-w-6xl mx-auto text-center text-xs text-cozy-brown-medium border-t border-cozy-border pt-4 px-4 hidden md:block">
          Life RPG • Multi-Chamber Study Haven &amp; Companion Evolution System
        </footer>
      </div>

      {/* =================================================================== */}
      {/* MOBILE BOTTOM NAV BAR                                               */}
      {/* =================================================================== */}
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-cozy-parchment border-t-2 border-cozy-brown-dark px-2 py-1 flex items-center justify-around shadow-pixel-lg select-none"
      >
        {[
          { path: '/dashboard', label: 'Home', icon: '🏠' },
          { path: '/quests', label: 'Quests', icon: '📜', badge: activeQuestCount },
          { path: '/room', label: 'Room', icon: '🛋️' },
          { path: '/spirit', label: 'Spirit', icon: '✨' },
          { path: '/profile', label: 'Journey', icon: '📊' },
          { path: '/settings', label: 'Settings', icon: '⚙️' },
        ].map((btn) => {
          const isActive = location.pathname === btn.path || (btn.path !== '/dashboard' && location.pathname.startsWith(btn.path));
          return (
            <NavLink
              key={btn.path}
              to={btn.path}
              onClick={() => playSound('click')}
              className={`flex flex-col items-center justify-center p-1.5 rounded-pixel text-[10px] font-pixel transition relative ${
                isActive
                  ? 'bg-cozy-card text-cozy-brown-dark font-bold shadow-pixel-sm border border-cozy-brown-dark -translate-y-0.5'
                  : 'text-cozy-brown-medium'
              }`}
            >
              <span className="text-base leading-none">{btn.icon}</span>
              <span className="mt-0.5">{btn.label}</span>
              {btn.badge > 0 && (
                <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-cozy-terracotta text-white rounded-full text-[9px] font-bold">
                  {btn.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
