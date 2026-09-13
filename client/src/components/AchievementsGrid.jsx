import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const CRITERIA_LABELS = {
  quest_count: 'Quests Completed',
  streak_length: 'Day Streak',
  level: 'Character Level',
  attribute_value: 'Attribute Level',
  item_count: 'Items Collected',
};

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All', icon: '🏆' },
  { key: 'quest_count', label: 'Quests', icon: '📜' },
  { key: 'streak_length', label: 'Streaks', icon: '🔥' },
  { key: 'level', label: 'Level', icon: '⭐' },
  { key: 'attribute_value', label: 'Attributes', icon: '🎯' },
  { key: 'item_count', label: 'Collection', icon: '🧺' },
];

function AchievementCard({ achievement }) {
  const { unlocked, name, description, icon, criteria_type, criteria_value, criteria_attribute, reward_coins, unlocked_at } = achievement;

  const criteriaLabel = CRITERIA_LABELS[criteria_type] || criteria_type;
  const displayLabel = criteria_type === 'attribute_value' && criteria_attribute
    ? `${criteria_attribute.charAt(0).toUpperCase() + criteria_attribute.slice(1)} ${criteria_value}`
    : `${criteriaLabel}: ${criteria_value}`;

  const unlockedDate = unlocked_at
    ? new Date(unlocked_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      aria-label={`${name} achievement — ${unlocked ? 'unlocked' : 'locked'}`}
      className={`relative pixel-box rounded-pixel border-2 p-4 flex flex-col gap-3 transition-all duration-200 ${
        unlocked
          ? 'bg-gradient-to-br from-cozy-parchment via-white to-cozy-sage-subtle border-cozy-sage-dark shadow-pixel'
          : 'bg-cozy-parchment/50 border-cozy-border opacity-70'
      }`}
    >
      {/* Locked overlay shimmer */}
      {!unlocked && (
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-pixel overflow-hidden pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-cozy-cream/40" />
        </div>
      )}

      {/* Icon & Unlock Badge */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`text-3xl w-12 h-12 flex items-center justify-center rounded-pixel border-2 shadow-pixel-sm transition-all ${
            unlocked
              ? 'border-cozy-sage-dark bg-cozy-sage-subtle'
              : 'border-cozy-border bg-cozy-cream grayscale'
          }`}
          aria-hidden="true"
        >
          {unlocked ? icon : '🔒'}
        </div>

        {unlocked ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cozy-sage text-white text-[10px] font-pixel rounded border border-cozy-sage-dark shadow-pixel-sm">
            <span aria-hidden="true">✓</span>
            <span>Unlocked</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cozy-brown-subtle text-cozy-brown-medium text-[10px] font-pixel rounded border border-cozy-border">
            <span aria-hidden="true">🔒</span>
            <span>Locked</span>
          </span>
        )}
      </div>

      {/* Name & Description */}
      <div className="space-y-1 flex-1">
        <h3 className={`font-pixel text-sm leading-tight ${unlocked ? 'text-cozy-brown-dark' : 'text-cozy-brown-medium'}`}>
          {name}
        </h3>
        <p className="text-[11px] text-cozy-brown-medium leading-relaxed">
          {description}
        </p>
      </div>

      {/* Footer: criteria & reward */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-cozy-border">
        <span className="text-[10px] font-pixel text-cozy-brown-medium bg-cozy-cream px-1.5 py-0.5 rounded border border-cozy-border">
          {displayLabel}
        </span>

        {reward_coins > 0 && (
          <span
            className={`text-[10px] font-pixel flex items-center gap-1 ${unlocked ? 'text-cozy-sage-dark' : 'text-cozy-brown-medium'}`}
            aria-label={`Reward: ${reward_coins} Cozy Coins`}
          >
            <span aria-hidden="true">🪙</span>
            {reward_coins}
          </span>
        )}
      </div>

      {/* Unlock date */}
      {unlocked && unlockedDate && (
        <p className="text-[10px] text-cozy-sage-dark font-pixel">
          Unlocked {unlockedDate}
        </p>
      )}
    </motion.article>
  );
}

export function AchievementsGrid({ externalAchievements = null, onRefresh }) {
  const { token } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${apiUrl}/api/achievements`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || 'Failed to load achievements');
      }
      const data = await res.json();
      setAchievements(data.achievements || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [token]);

  // Allow parent to push fresh achievements after quest completion
  useEffect(() => {
    if (externalAchievements && externalAchievements.length > 0) {
      setAchievements((prev) => {
        const updated = [...prev];
        for (const newAch of externalAchievements) {
          const idx = updated.findIndex((a) => a.id === newAch.id);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], unlocked: true, unlocked_at: newAch.unlocked_at ?? new Date().toISOString() };
          }
        }
        return updated;
      });
    }
  }, [externalAchievements]);

  const filtered = filter === 'all'
    ? achievements
    : achievements.filter((a) => a.criteria_type === filter);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="pixel-box bg-cozy-card p-10 rounded-pixel text-center space-y-4 border-2 border-cozy-brown-dark shadow-pixel-sm animate-pulse"
      >
        <div className="text-3xl select-none" aria-hidden="true">🏆</div>
        <p className="font-pixel text-sm text-cozy-brown-dark">Loading Achievements Scroll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="pixel-box bg-cozy-terracotta-subtle border-2 border-cozy-terracotta-dark p-6 rounded-pixel text-center space-y-3"
      >
        <p className="font-pixel text-sm text-cozy-terracotta-dark">⚠️ {error}</p>
        <button
          type="button"
          onClick={fetchAchievements}
          className="pixel-box-interactive bg-cozy-card hover:bg-cozy-terracotta-subtle text-cozy-brown-dark font-pixel text-xs px-4 py-2 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section aria-labelledby="achievements-heading">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 id="achievements-heading" className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark">
            Scholar Achievements
          </h2>
          <p className="text-xs text-cozy-brown-medium mt-0.5">
            {unlockedCount} of {total} unlocked
          </p>
        </div>

        {/* Overall progress bar */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <div
            role="progressbar"
            aria-valuenow={unlockedCount}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`${unlockedCount} of ${total} achievements unlocked`}
            className="flex-1 bg-cozy-brown-subtle h-3 rounded-pixel border-2 border-cozy-brown-dark overflow-hidden p-0.5"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: total > 0 ? `${Math.round((unlockedCount / total) * 100)}%` : '0%' }}
              transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-cozy-sage-light to-cozy-sage-dark rounded-sm"
            />
          </div>
          <span className="font-pixel text-xs text-cozy-brown-medium whitespace-nowrap">
            {total > 0 ? Math.round((unlockedCount / total) * 100) : 0}%
          </span>
        </div>
      </div>

      {/* Category filter tabs */}
      <div
        role="tablist"
        aria-label="Filter achievements by category"
        className="flex gap-2 flex-wrap mb-5"
      >
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.key}
            type="button"
            role="tab"
            aria-selected={filter === cat.key}
            onClick={() => setFilter(cat.key)}
            className={`pixel-box px-3 py-1.5 rounded-pixel font-pixel text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
              filter === cat.key
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark border-2 border-transparent'
            }`}
          >
            <span aria-hidden="true">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="pixel-box bg-cozy-card p-10 rounded-pixel text-center border-2 border-cozy-border shadow-pixel-sm space-y-3">
          <p className="text-3xl" aria-hidden="true">🔍</p>
          <p className="font-pixel text-sm text-cozy-brown-dark">No achievements in this category yet.</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((ach) => (
              <AchievementCard key={ach.id} achievement={ach} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
