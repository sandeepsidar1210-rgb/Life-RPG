import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useScholar } from '../../context/ScholarContext.jsx';

export function ProfileJourney() {
  const {
    user,
    character,
    streak,
    spirit,
    quests,
    equippedBadges,
    freshAchievements,
    playSound
  } = useScholar();

  const [hoveredDay, setHoveredDay] = useState(null);

  // Derive Scholar Title from level
  const scholarTitle = useMemo(() => {
    const lvl = character.level || 1;
    if (lvl >= 20) return 'Arch-Scholar of the Cosmos';
    if (lvl >= 15) return 'Master of Ancient Tomes';
    if (lvl >= 10) return 'High Scholar of the Haven';
    if (lvl >= 5) return 'Adept Sanctuary Scholar';
    return 'Apprentice Inquirer';
  }, [character.level]);

  // Format Join Date
  const joinDate = useMemo(() => {
    if (user?.created_at) {
      try {
        return new Date(user.created_at).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (_e) {}
    }
    return 'Autumn, 2026';
  }, [user]);

  // Milestones & Metrics
  const completedQuests = useMemo(() => {
    return quests.filter((q) => q.status === 'completed');
  }, [quests]);

  const totalQuestsCount = quests.length;
  const completionRate = totalQuestsCount > 0 
    ? Math.round((completedQuests.length / totalQuestsCount) * 100) 
    : 0;

  // Unlocked achievements ratio (10 total achievements in system)
  const totalSystemAchievements = 10;
  const unlockedAchievementsCount = useMemo(() => {
    // Basic estimation plus any fresh achievements
    const count = Math.min(
      totalSystemAchievements,
      Math.max(
        1,
        (character.level >= 2 ? 1 : 0) +
        (completedQuests.length >= 1 ? 1 : 0) +
        (completedQuests.length >= 5 ? 1 : 0) +
        (streak.current_streak >= 3 ? 1 : 0) +
        (streak.current_streak >= 7 ? 1 : 0) +
        (character.cozy_coins >= 100 ? 1 : 0) +
        freshAchievements.length
      )
    );
    return count;
  }, [character.level, completedQuests.length, streak.current_streak, character.cozy_coins, freshAchievements]);

  // =========================================================================
  // Pure SVG Radar / Spider Chart Calculation
  // =========================================================================
  const radarData = useMemo(() => {
    const stats = [
      { key: 'focus', name: 'Focus', val: character.focus || 1, icon: '🎯', color: 'var(--color-stat-focus)' },
      { key: 'discipline', name: 'Discipline', val: character.discipline || 1, icon: '⏳', color: 'var(--color-stat-discipline)' },
      { key: 'vitality', name: 'Vitality', val: character.vitality || 1, icon: '🌿', color: 'var(--color-stat-vitality)' },
      { key: 'creativity', name: 'Creativity', val: character.creativity || 1, icon: '🎨', color: 'var(--color-stat-creativity)' },
    ];

    const maxVal = Math.max(10, ...stats.map((s) => s.val));
    const cx = 160;
    const cy = 160;
    const radius = 105;

    // Angles: 0 (top: Focus), 1 (right: Discipline), 2 (bottom: Vitality), 3 (left: Creativity)
    const points = stats.map((stat, i) => {
      const angle = -Math.PI / 2 + (i * Math.PI) / 2;
      const r = Math.max(0.18, Math.min(1, stat.val / maxVal)) * radius;
      return {
        ...stat,
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        outerX: cx + radius * Math.cos(angle),
        outerY: cy + radius * Math.sin(angle),
      };
    });

    const polygonPoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    return { cx, cy, radius, maxVal, stats: points, polygonPoints };
  }, [character]);

  // =========================================================================
  // 30-Day Activity Heatmap Calculation
  // =========================================================================
  const heatmapDays = useMemo(() => {
    const days = [];
    const now = new Date();

    // Group completed quests by YYYY-MM-DD
    const countsByDate = {};
    completedQuests.forEach((q) => {
      const dateStr = q.completed_at || q.updated_at || q.created_at;
      if (dateStr) {
        try {
          const d = new Date(dateStr).toISOString().split('T')[0];
          countsByDate[d] = (countsByDate[d] || 0) + 1;
        } catch (_e) {}
      }
    });

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const count = countsByDate[dateKey] || 0;
      days.push({
        dateStr: dateKey,
        formatted: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', weekday: 'short' }),
        count,
        isToday: i === 0,
      });
    }

    return days;
  }, [completedQuests]);

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-cozy-parchment/60 border-cozy-border text-transparent';
    if (count === 1) return 'bg-cozy-sage-subtle border-cozy-sage-light text-cozy-sage-dark';
    if (count === 2) return 'bg-cozy-sage-light border-cozy-sage text-white';
    if (count <= 4) return 'bg-cozy-sage border-cozy-sage-dark text-white font-bold';
    return 'bg-cozy-sage-dark border-cozy-brown-dark text-white font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="pb-2 border-b border-cozy-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-pixel text-cozy-brown-dark tracking-wide">
            Scholar's Journey
          </h2>
          <p className="text-xs sm:text-sm text-cozy-brown-medium font-pixel">
            Chronicles of your habit cultivation, intellectual virtues, and companion growth.
          </p>
        </div>
        <span className="px-3 py-1 bg-cozy-gold-light text-cozy-gold-dark font-pixel text-xs rounded border border-cozy-gold-base self-start sm:self-auto font-bold shadow-pixel-xs">
          📜 Tome of Records
        </span>
      </div>

      {/* Identity Card */}
      <div className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark bg-gradient-to-br from-cozy-card to-cozy-parchment/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-3xl border-2 border-cozy-brown-dark shadow-pixel-sm select-none shrink-0">
              🧙‍♂️
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark font-bold">
                  {user?.email?.split('@')[0] || 'Scholar'}
                </h3>
                <span className="px-2 py-0.5 bg-cozy-sage text-white text-xs font-pixel rounded font-bold shadow-pixel-xs">
                  LVL {character.level}
                </span>
                <span className="px-2 py-0.5 bg-cozy-parchment text-cozy-brown-dark text-xs font-pixel rounded border border-cozy-brown-dark">
                  {scholarTitle}
                </span>
              </div>
              <p className="text-xs text-cozy-brown-medium mt-1 font-sans">
                Scholar ID: <span className="font-semibold text-cozy-brown-dark">{user?.email}</span> • Inscribed into Life RPG on {joinDate}
              </p>
              {equippedBadges.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-pixel text-cozy-brown-medium">Accoutrements:</span>
                  {equippedBadges.map((b) => (
                    <span
                      key={b.id}
                      className="px-2 py-0.5 bg-cozy-gold-light text-cozy-gold-dark text-[11px] font-pixel rounded border border-cozy-gold-base flex items-center gap-1 font-bold shadow-pixel-xs"
                    >
                      <span>{b.item?.name?.includes('Dawn') ? '🌅' : '🌙'}</span>
                      <span>{b.item?.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spirit Companion Info on Identity Card */}
          {spirit && (
            <div className="pixel-box bg-cozy-parchment/80 p-3 rounded-pixel border border-cozy-brown-dark shrink-0 w-full sm:w-auto">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl select-none">✨</span>
                <span className="font-pixel text-xs text-cozy-brown-dark font-bold">
                  Bound Companion
                </span>
                <span className="ml-auto px-1.5 py-0.2 bg-cozy-terracotta-subtle text-cozy-terracotta-dark text-[10px] font-pixel rounded border border-cozy-terracotta">
                  Stage {spirit.current_stage?.stage_number || 1}
                </span>
              </div>
              <p className="font-pixel text-sm text-cozy-brown-dark font-bold">
                {spirit.current_stage?.name || spirit.species?.name}
              </p>
              <p className="text-[11px] text-cozy-brown-medium">
                {spirit.species?.attribute_type?.toUpperCase()} Aspect • {spirit.species?.aesthetic_theme}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones & Career Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '📜', label: 'Completed Quests', val: completedQuests.length, sub: `${completionRate}% completion rate` },
          { icon: '🔥', label: 'Longest Streak', val: `${streak.longest_streak || streak.current_streak} Days`, sub: `Current: ${streak.current_streak} days` },
          { icon: '🏆', label: 'Achievements', val: `${unlockedAchievementsCount} / ${totalSystemAchievements}`, sub: 'Scroll badges earned' },
          { icon: '🪙', label: 'Cozy Coins Stock', val: `${character.cozy_coins}`, sub: 'Emporium purchasing power' },
        ].map((m, idx) => (
          <div key={idx} className="pixel-box bg-cozy-card p-4 rounded-pixel border-2 border-cozy-brown-dark">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{m.icon}</span>
              <span className="font-pixel text-xs text-cozy-brown-medium font-bold">{m.label}</span>
            </div>
            <p className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark font-bold">
              {m.val}
            </p>
            <p className="text-[11px] font-pixel text-cozy-brown-medium mt-0.5">
              {m.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Attributes Radar Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pure SVG Spider / Radar Chart */}
        <div className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between gap-2 pb-2 mb-2 border-b border-cozy-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">🕸️</span>
              <h3 className="font-pixel text-base sm:text-lg text-cozy-brown-dark font-bold">
                Attribute Virtue Radar
              </h3>
            </div>
            <span className="text-xs font-pixel text-cozy-brown-medium">
              Equilibrium View
            </span>
          </div>

          <div className="relative my-2 w-full max-w-[320px] flex items-center justify-center">
            <svg
              viewBox="0 0 320 320"
              className="w-full h-auto overflow-visible select-none"
              role="img"
              aria-label="Radar chart showing levels of Focus, Discipline, Vitality, and Creativity attributes"
            >
              {/* Concentric Grid Polygons (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1.0].map((level, i) => {
                const r = level * radarData.radius;
                const pts = [
                  `${radarData.cx},${radarData.cy - r}`, // Top
                  `${radarData.cx + r},${radarData.cy}`, // Right
                  `${radarData.cx},${radarData.cy + r}`, // Bottom
                  `${radarData.cx - r},${radarData.cy}`, // Left
                ].join(' ');
                return (
                  <polygon
                    key={i}
                    points={pts}
                    fill={i % 2 === 0 ? 'var(--color-parchment)' : 'none'}
                    fillOpacity={0.4}
                    stroke="var(--color-border)"
                    strokeWidth="1.5"
                    strokeDasharray={level < 1 ? '3 3' : 'none'}
                  />
                );
              })}

              {/* Cross Axis Lines */}
              <line
                x1={radarData.cx}
                y1={radarData.cy - radarData.radius}
                x2={radarData.cx}
                y2={radarData.cy + radarData.radius}
                stroke="var(--color-border)"
                strokeWidth="1.5"
              />
              <line
                x1={radarData.cx - radarData.radius}
                y1={radarData.cy}
                x2={radarData.cx + radarData.radius}
                y2={radarData.cy}
                stroke="var(--color-border)"
                strokeWidth="1.5"
              />

              {/* Filled Scholar Polygon */}
              <polygon
                points={radarData.polygonPoints}
                fill="var(--color-sage-base)"
                fillOpacity="0.35"
                stroke="var(--color-sage-dark)"
                strokeWidth="3"
                className="transition-all duration-300"
              />

              {/* Data Vertex Dots */}
              {radarData.stats.map((pt) => (
                <g key={pt.key}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    fill="var(--color-card)"
                    stroke={pt.color}
                    strokeWidth="3"
                    className="cursor-pointer"
                  />
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="2"
                    fill={pt.color}
                  />
                </g>
              ))}

              {/* Axis Corner Labels */}
              {/* Focus (Top) */}
              <text
                x={radarData.cx}
                y={radarData.cy - radarData.radius - 12}
                textAnchor="middle"
                className="font-pixel text-[12px] font-bold fill-current"
                style={{ fill: 'var(--color-brown-dark)' }}
              >
                🎯 Focus: LVL {character.focus}
              </text>

              {/* Discipline (Right) */}
              <text
                x={radarData.cx + radarData.radius + 12}
                y={radarData.cy + 4}
                textAnchor="start"
                className="font-pixel text-[12px] font-bold fill-current"
                style={{ fill: 'var(--color-brown-dark)' }}
              >
                ⏳ Discipline: LVL {character.discipline}
              </text>

              {/* Vitality (Bottom) */}
              <text
                x={radarData.cx}
                y={radarData.cy + radarData.radius + 20}
                textAnchor="middle"
                className="font-pixel text-[12px] font-bold fill-current"
                style={{ fill: 'var(--color-brown-dark)' }}
              >
                🌿 Vitality: LVL {character.vitality}
              </text>

              {/* Creativity (Left) */}
              <text
                x={radarData.cx - radarData.radius - 12}
                y={radarData.cy + 4}
                textAnchor="end"
                className="font-pixel text-[12px] font-bold fill-current"
                style={{ fill: 'var(--color-brown-dark)' }}
              >
                🎨 Creativity: LVL {character.creativity}
              </text>
            </svg>
          </div>

          <p className="text-xs font-pixel text-cozy-brown-medium text-center mt-3">
            Completing tagged quests continuously elevates corresponding virtue levels.
          </p>
        </div>

        {/* Attribute Breakdown & Details */}
        <div className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cozy-border">
            <h3 className="font-pixel text-base sm:text-lg text-cozy-brown-dark font-bold">
              Virtue Manifestations
            </h3>
            <span className="text-xs font-pixel text-cozy-brown-medium">
              4 Foundations
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'focus',
                name: 'Focus',
                val: character.focus,
                icon: '🎯',
                spirit: 'Emberwisp (Steam/Matcha)',
                desc: 'Concentration, deep reading, and unwavering single-task devotion.',
                color: 'text-cozy-stats-focus'
              },
              {
                id: 'discipline',
                name: 'Discipline',
                val: character.discipline,
                icon: '⏳',
                spirit: 'Rootling (Stone/Moss)',
                desc: 'Consistency, morning rituals, punctuality, and unwavering resolve.',
                color: 'text-cozy-stats-discipline'
              },
              {
                id: 'vitality',
                name: 'Vitality',
                val: character.vitality,
                icon: '🌿',
                spirit: 'Sproutling (Leaf/Vine)',
                desc: 'Physical wellness, restful breaks, fresh air, and rejuvenating sleep.',
                color: 'text-cozy-stats-vitality'
              },
              {
                id: 'creativity',
                name: 'Creativity',
                val: character.creativity,
                icon: '🎨',
                spirit: 'Inkling (Ink/Starlight)',
                desc: 'Imaginative writing, synthesis, exploratory sketches, and curiosity.',
                color: 'text-cozy-stats-creativity'
              },
            ].map((stat) => (
              <div
                key={stat.id}
                className="pixel-box bg-cozy-parchment/60 p-3 rounded-pixel border border-cozy-border flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base">{stat.icon}</span>
                    <h4 className={`font-pixel text-sm font-bold ${stat.color}`}>
                      {stat.name} (LVL {stat.val})
                    </h4>
                    <span className="text-[10px] font-pixel text-cozy-brown-medium">
                      • {stat.spirit}
                    </span>
                  </div>
                  <p className="text-xs text-cozy-brown-medium mt-1">
                    {stat.desc}
                  </p>
                </div>
                <span className="font-pixel text-sm px-2 py-1 bg-cozy-card rounded border border-cozy-border shadow-pixel-xs font-bold text-cozy-brown-dark shrink-0">
                  +{stat.val}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 30-Day Activity Heatmap Grid */}
      <div className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-cozy-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <h3 className="font-pixel text-base sm:text-lg text-cozy-brown-dark font-bold">
                30-Day Study Activity Heatmap
              </h3>
            </div>
            <p className="text-xs text-cozy-brown-medium mt-0.5">
              Visual scroll of quests finished across the past month.
            </p>
          </div>

          {/* Hovered Day Details or Legend */}
          <div className="text-xs font-pixel text-cozy-brown-dark bg-cozy-parchment px-3 py-1.5 rounded-pixel border border-cozy-brown-dark">
            {hoveredDay ? (
              <span>
                <span className="font-bold text-cozy-sage-dark">{hoveredDay.formatted}</span>: {hoveredDay.count} {hoveredDay.count === 1 ? 'quest' : 'quests'} completed
              </span>
            ) : (
              <span>Hover any day to inspect completed deeds</span>
            )}
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2 pt-2">
          {heatmapDays.map((day) => (
            <div
              key={day.dateStr}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => {
                playSound('click');
                setHoveredDay(day);
              }}
              className={`h-10 rounded-pixel border flex flex-col items-center justify-center p-1 transition-transform cursor-pointer hover:scale-110 shadow-pixel-xs ${getHeatmapColor(
                day.count
              )} ${day.isToday ? 'ring-2 ring-cozy-terracotta' : ''}`}
              title={`${day.formatted}: ${day.count} quests`}
            >
              <span className="text-[10px] font-pixel font-bold">
                {day.count > 0 ? day.count : ''}
              </span>
              <span className="text-[8px] font-pixel opacity-75">
                {day.dateStr.slice(8)}
              </span>
            </div>
          ))}
        </div>

        {/* Heatmap Color Scale Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-cozy-border text-xs font-pixel text-cozy-brown-medium">
          <span className="italic">
            Tip: Complete daily quests to maintain radiant green flame.
          </span>
          <div className="flex items-center gap-2">
            <span>Less</span>
            <div className="w-3.5 h-3.5 rounded bg-cozy-parchment/60 border border-cozy-border" title="0 quests" />
            <div className="w-3.5 h-3.5 rounded bg-cozy-sage-subtle border border-cozy-sage-light" title="1 quest" />
            <div className="w-3.5 h-3.5 rounded bg-cozy-sage-light border border-cozy-sage" title="2 quests" />
            <div className="w-3.5 h-3.5 rounded bg-cozy-sage border border-cozy-sage-dark" title="3-4 quests" />
            <div className="w-3.5 h-3.5 rounded bg-cozy-sage-dark border border-cozy-brown-dark" title="5+ quests" />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
