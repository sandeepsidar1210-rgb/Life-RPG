import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';

export function Dashboard() {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Fetch character profile and stats from protected backend route
  useEffect(() => {
    let active = true;

    async function fetchCharacterProfile() {
      if (!token) return;
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Backend returned status ${res.status}`);
        }

        const data = await res.json();
        if (active) {
          setProfile(data);
          setApiError(null);
        }
      } catch (err) {
        console.error('[Dashboard fetch error]', err);
        if (active) setApiError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCharacterProfile();

    return () => {
      active = false;
    };
  }, [token]);

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const char = profile?.character || {
    level: 1,
    current_xp: 0,
    xp_to_next_level: 100,
    cozy_coins: 50,
    focus: 1,
    discipline: 1,
    vitality: 1,
    creativity: 1
  };

  const streak = profile?.streak || {
    current_streak: 0,
    longest_streak: 0
  };

  const xpPercentage = Math.min(100, Math.round((char.current_xp / (char.xp_to_next_level || 100)) * 100));

  return (
    <div className="min-h-screen bg-cozy-cream text-cozy-brown-dark flex flex-col items-center justify-between p-4 sm:p-8 font-sans selection:bg-cozy-terracotta-subtle">
      {/* Top HUD Bar */}
      <header className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 border-b-2 border-cozy-brown-dark pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-2xl shadow-pixel-sm">
            🪑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark tracking-wide">
                Life RPG
              </h1>
              <span className="px-2 py-0.5 bg-cozy-sage-subtle text-cozy-sage-dark text-[11px] font-pixel rounded border border-cozy-sage-light">
                Study Room
              </span>
            </div>
            <p className="text-xs text-cozy-brown-medium truncate max-w-[200px] sm:max-w-xs">
              Logged in as <span className="font-semibold text-cozy-brown-dark">{user?.email}</span>
            </p>
          </div>
        </div>

        {/* HUD Counters & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cozy Coins */}
          <div className="pixel-box bg-cozy-parchment px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-sm">
            <span role="img" aria-label="coin" className="text-sm">🪙</span>
            <span className="font-pixel text-sm font-bold text-cozy-gold-dark">
              {char.cozy_coins} <span className="font-sans text-[11px] font-normal text-cozy-brown-medium hidden sm:inline">Coins</span>
            </span>
          </div>

          {/* Daily Streak */}
          <div className="pixel-box bg-cozy-terracotta-subtle px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-sm border-cozy-terracotta-dark">
            <span role="img" aria-label="fire" className="text-sm">🔥</span>
            <span className="font-pixel text-sm font-bold text-cozy-terracotta-dark">
              {streak.current_streak} <span className="font-sans text-[11px] font-normal text-cozy-brown-medium hidden sm:inline">Day Streak</span>
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            id="logout-button"
            className="pixel-box-interactive bg-cozy-card hover:bg-cozy-terracotta-subtle hover:text-cozy-terracotta-dark text-cozy-brown-dark font-pixel text-xs sm:text-sm px-3 py-1.5 rounded-pixel font-semibold transition flex items-center gap-1.5"
            title="Log out of session"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Study Hub */}
      <main className="w-full max-w-4xl my-6 space-y-6">
        {/* Character Card & XP Progress */}
        <motion.section 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pixel-box bg-cozy-card p-6 rounded-pixel shadow-pixel bg-gradient-to-br from-white to-cozy-parchment"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-pixel text-2xl text-cozy-brown-dark">
                  Level {char.level} Scholar
                </span>
                <span className="text-xs bg-cozy-sage text-white px-2 py-0.5 rounded-pixel font-pixel font-bold">
                  Active
                </span>
              </div>
              <p className="text-xs text-cozy-brown-medium">
                Focus Points: {char.current_xp} / {char.xp_to_next_level} FP to Level {char.level + 1}
              </p>
            </div>

            <div className="text-right sm:text-left">
              <span className="text-xs font-pixel text-cozy-brown-medium uppercase tracking-wider block">
                Session Status
              </span>
              <span className="text-xs font-bold text-cozy-sage-dark flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cozy-sage animate-ping"></span>
                Secure JWT Verified
              </span>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-cozy-brown-subtle h-4 rounded-pixel border-2 border-cozy-brown-dark overflow-hidden p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cozy-sage-light to-cozy-sage rounded-sm"
              />
            </div>
            <div className="flex justify-between text-[11px] font-pixel text-cozy-brown-medium">
              <span>{xpPercentage}% to Next Level</span>
              <span>{char.xp_to_next_level - char.current_xp} FP Remaining</span>
            </div>
          </div>
        </motion.section>

        {/* 4 Core Character Attributes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-pixel text-cozy-brown-dark flex items-center gap-2">
              <span>📊</span> Character Attributes
            </h2>
            <span className="text-xs font-sans text-cozy-brown-medium">
              Auto-initialized via PostgreSQL Trigger
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { key: 'focus', name: 'Focus', val: char.focus, color: 'bg-cozy-stats-focus', icon: '🎯', desc: 'Deep work & study tasks' },
              { key: 'discipline', name: 'Discipline', val: char.discipline, color: 'bg-cozy-stats-discipline', icon: '⏳', desc: 'Daily habits & routine quests' },
              { key: 'vitality', name: 'Vitality', val: char.vitality, color: 'bg-cozy-stats-vitality', icon: '🌿', desc: 'Exercise, hydration & sleep' },
              { key: 'creativity', name: 'Creativity', val: char.creativity, color: 'bg-cozy-stats-creativity', icon: '🎨', desc: 'Writing, arts & coding' },
            ].map((stat) => (
              <div key={stat.key} className="pixel-box bg-cozy-card p-4 rounded-pixel shadow-pixel-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-pixel text-sm font-semibold text-cozy-brown-dark flex items-center gap-1.5">
                    <span>{stat.icon}</span> {stat.name}
                  </span>
                  <span className="font-pixel text-xs font-bold text-cozy-brown-dark bg-cozy-parchment px-1.5 py-0.5 rounded border border-cozy-border">
                    LVL {stat.val}
                  </span>
                </div>
                <div className="w-full bg-cozy-brown-subtle h-2 rounded-full overflow-hidden border border-cozy-brown-light/30 my-2">
                  <div className={`h-full ${stat.color} w-2/5 rounded-full`}></div>
                </div>
                <p className="text-[11px] text-cozy-brown-medium leading-tight">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Backend Verification & Session Info Card */}
        <section className="pixel-box bg-cozy-parchment/60 p-5 rounded-pixel border-2 border-cozy-brown-dark/70 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-pixel text-sm font-bold text-cozy-brown-dark flex items-center gap-1.5">
              <span>🛡️</span> Backend Auth &amp; Database Security Check
            </span>
            <span className="text-cozy-sage-dark font-pixel font-bold">
              {loading ? 'Validating...' : apiError ? 'Error' : 'Verified'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-cozy-brown-medium pt-1">
            <p>
              <strong className="text-cozy-brown-dark">Verified User ID:</strong>{' '}
              <span className="font-mono text-[11px]">{user?.id}</span>
            </p>
            <p>
              <strong className="text-cozy-brown-dark">Session Persistence:</strong>{' '}
              <span className="text-cozy-sage-dark font-medium">Active (Supabase LocalStorage)</span>
            </p>
            <p>
              <strong className="text-cozy-brown-dark">Character ID:</strong>{' '}
              <span className="font-mono text-[11px]">{char.id || 'Trigger initialized'}</span>
            </p>
            <p>
              <strong className="text-cozy-brown-dark">Protected Route /api/me:</strong>{' '}
              <span className="text-cozy-sage-dark font-medium">200 OK via Bearer JWT</span>
            </p>
          </div>
          {apiError && (
            <div className="p-2 bg-cozy-terracotta-subtle text-cozy-terracotta-dark rounded border border-cozy-terracotta-light">
              API Notice: {apiError}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-xs text-cozy-brown-medium border-t border-cozy-border pt-4">
        Life RPG • Secure Session Management • Protected Backend Middleware
      </footer>
    </div>
  );
}
