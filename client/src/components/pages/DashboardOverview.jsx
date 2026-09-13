import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScholar } from '../../context/ScholarContext.jsx';

export function DashboardOverview() {
  const {
    character,
    streak,
    spirit,
    quests,
    inventory,
    activeRoom,
    completingId,
    handleCompleteQuest,
    playSound
  } = useScholar();

  const activeQuests = quests.filter((q) => q.status === 'active');
  const completedQuestsCount = quests.filter((q) => q.status === 'completed').length;
  const equippedCount = inventory.filter((i) => i.equipped).length;

  const xpPercent = Math.min(
    100,
    Math.round((character.current_xp / (character.xp_to_next_level || 100)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-cozy-border">
        <div>
          <h2 className="text-2xl sm:text-3xl font-pixel text-cozy-brown-dark tracking-wide">
            Scholar's Hearth
          </h2>
          <p className="text-xs sm:text-sm text-cozy-brown-medium font-pixel">
            Welcome back to your cozy sanctuary of habit and knowledge.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/quests"
            onClick={() => playSound('click')}
            className="touch-target pixel-box-interactive bg-cozy-card hover:bg-cozy-sage-subtle text-cozy-brown-dark font-pixel text-xs px-3 py-1.5 rounded-pixel flex items-center gap-1.5 font-bold"
          >
            <span>📜</span>
            <span>Study Quests</span>
          </Link>
          <Link
            to="/room"
            onClick={() => playSound('click')}
            className="touch-target pixel-box-interactive bg-cozy-card hover:bg-cozy-parchment text-cozy-brown-dark font-pixel text-xs px-3 py-1.5 rounded-pixel flex items-center gap-1.5 font-bold"
          >
            <span>🛋️</span>
            <span>My Room</span>
          </Link>
        </div>
      </div>

      {/* Character Progression & Non-linear Level Card */}
      <section 
        aria-labelledby="char-stats-heading"
        className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark bg-gradient-to-br from-white to-cozy-parchment/60"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 id="char-stats-heading" className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark">
                Level {character.level} Scholar
              </h3>
              <span className="text-[11px] bg-cozy-sage text-white px-2 py-0.5 rounded-pixel font-pixel font-bold">
                Active Journey
              </span>
            </div>
            <p className="text-xs text-cozy-brown-medium">
              Focus Points: <span className="font-bold text-cozy-brown-dark">{character.current_xp}</span> / {character.xp_to_next_level} FP
            </p>
          </div>

          <div className="text-right sm:text-left text-xs text-cozy-brown-medium font-pixel">
            <span>Next Threshold: </span>
            <span className="font-bold text-cozy-sage-dark">{character.xp_to_next_level - character.current_xp} FP Needed</span>
          </div>
        </div>

        {/* Focus Points Progress Bar */}
        <div className="space-y-1.5">
          <div 
            role="progressbar"
            aria-valuenow={character.current_xp}
            aria-valuemin={0}
            aria-valuemax={character.xp_to_next_level}
            aria-label="Focus Points Progression to next level"
            aria-valuetext={`${character.current_xp} of ${character.xp_to_next_level} Focus Points, ${xpPercent} percent`}
            className="w-full bg-cozy-brown-subtle h-4 rounded-pixel border-2 border-cozy-brown-dark overflow-hidden p-0.5"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 120 }}
              className="h-full bg-gradient-to-r from-cozy-sage-light via-cozy-sage to-cozy-sage-dark rounded-sm"
            />
          </div>
          <div className="flex justify-between text-[11px] font-pixel text-cozy-brown-medium">
            <span>{xpPercent}% Progress to Level {character.level + 1}</span>
            <span>Formula: 100 × LVL^1.5</span>
          </div>
        </div>

        {/* 4 Core Character Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-cozy-border">
          {[
            { id: 'focus', name: 'Focus', val: character.focus, icon: '🎯' },
            { id: 'discipline', name: 'Discipline', val: character.discipline, icon: '⏳' },
            { id: 'vitality', name: 'Vitality', val: character.vitality, icon: '🌿' },
            { id: 'creativity', name: 'Creativity', val: character.creativity, icon: '🎨' },
          ].map((stat) => (
            <motion.div
              key={stat.id}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 0.3 }}
              className="pixel-box bg-cozy-parchment/80 p-2.5 rounded-pixel flex items-center justify-between border-cozy-border"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-base" aria-hidden="true">{stat.icon}</span>
                <span className="font-pixel text-xs text-cozy-brown-dark font-bold">{stat.name}</span>
              </div>
              <span className="font-pixel text-xs font-bold px-2 py-0.5 bg-white rounded border border-cozy-border shadow-pixel-sm">
                LVL {stat.val}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Grid: Active Quests Preview & Companion / Sanctuary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Quests Preview (2 cols on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="pixel-box bg-cozy-card p-5 rounded-pixel border-2 border-cozy-brown-dark">
            <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-cozy-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">📜</span>
                <h3 className="font-pixel text-lg text-cozy-brown-dark font-bold">
                  Active Study Quests
                </h3>
                <span className="px-2 py-0.5 bg-cozy-terracotta-subtle text-cozy-terracotta-dark text-xs font-pixel rounded-full font-bold">
                  {activeQuests.length} Remaining
                </span>
              </div>
              <Link
                to="/quests"
                onClick={() => playSound('click')}
                className="text-xs font-pixel text-cozy-sage-dark hover:underline font-bold flex items-center gap-1"
              >
                <span>View Full Scroll</span>
                <span>→</span>
              </Link>
            </div>

            {activeQuests.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <div className="text-3xl">✨</div>
                <p className="font-pixel text-sm text-cozy-brown-dark font-bold">
                  All active quests are complete!
                </p>
                <p className="text-xs text-cozy-brown-medium">
                  Inscribe a new study goal to keep your flame alive.
                </p>
                <div className="pt-2">
                  <Link
                    to="/quests"
                    onClick={() => playSound('click')}
                    className="touch-target inline-flex items-center gap-1.5 pixel-box-interactive bg-cozy-sage text-white font-pixel text-xs px-4 py-2 rounded-pixel"
                  >
                    <span>➕ Inscribe New Quest</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuests.slice(0, 3).map((quest) => (
                  <div
                    key={quest.id}
                    className="pixel-box bg-cozy-parchment/60 p-3 rounded-pixel flex items-center justify-between gap-3 border border-cozy-border"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-pixel text-xs px-1.5 py-0.5 bg-cozy-card rounded border border-cozy-border capitalize text-cozy-brown-dark">
                          {quest.attribute}
                        </span>
                        <span className="text-xs font-pixel text-cozy-brown-medium capitalize">
                          {quest.category} • {quest.difficulty}
                        </span>
                      </div>
                      <h4 className="font-pixel text-sm text-cozy-brown-dark font-bold truncate">
                        {quest.title}
                      </h4>
                      {quest.description && (
                        <p className="text-xs text-cozy-brown-medium truncate mt-0.5">
                          {quest.description}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={completingId === quest.id}
                      onClick={() => handleCompleteQuest(quest.id)}
                      className="shrink-0 touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs px-3 py-2 rounded-pixel font-bold flex items-center gap-1.5 shadow-pixel-sm disabled:opacity-50"
                    >
                      <span>✓</span>
                      <span>{completingId === quest.id ? 'Attuning...' : 'Complete'}</span>
                    </button>
                  </div>
                ))}

                {activeQuests.length > 3 && (
                  <div className="text-center pt-2">
                    <Link
                      to="/quests"
                      onClick={() => playSound('click')}
                      className="text-xs font-pixel text-cozy-brown-medium hover:text-cozy-brown-dark underline"
                    >
                      + {activeQuests.length - 3} more quests waiting in your scroll
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Companion & Room Cards */}
        <div className="space-y-4">
          {/* Study Spirit Card */}
          <div className="pixel-box bg-cozy-card p-5 rounded-pixel border-2 border-cozy-brown-dark space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-cozy-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-pixel text-base text-cozy-brown-dark font-bold">
                  Study Spirit
                </h3>
              </div>
              <Link
                to="/spirit"
                onClick={() => playSound('click')}
                className="text-xs font-pixel text-cozy-sage-dark hover:underline font-bold"
              >
                Attune →
              </Link>
            </div>

            {spirit ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-2xl border border-cozy-brown-dark shadow-pixel-xs">
                    {spirit.species?.attribute_type === 'focus' ? '🏮' :
                     spirit.species?.attribute_type === 'discipline' ? '🗿' :
                     spirit.species?.attribute_type === 'vitality' ? '🌱' : '🖋️'}
                  </div>
                  <div>
                    <h4 className="font-pixel text-sm text-cozy-brown-dark font-bold">
                      {spirit.current_stage?.name || spirit.species?.name}
                    </h4>
                    <p className="text-[11px] font-pixel text-cozy-brown-medium">
                      Stage {spirit.current_stage?.stage_number || 1} • {spirit.species?.aesthetic_theme}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-cozy-brown-medium italic bg-cozy-parchment/40 p-2 rounded-pixel border border-cozy-border">
                  "{spirit.current_stage?.quote || 'Whispers of quiet determination linger in the air.'}"
                </p>
              </div>
            ) : (
              <p className="text-xs text-cozy-brown-medium">
                No spirit attuned yet. Level up to welcome your companion!
              </p>
            )}
          </div>

          {/* Study Sanctuary Preview Card */}
          <div className="pixel-box bg-cozy-card p-5 rounded-pixel border-2 border-cozy-brown-dark space-y-3">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-cozy-border">
              <div className="flex items-center gap-2">
                <span className="text-xl">🛋️</span>
                <h3 className="font-pixel text-base text-cozy-brown-dark font-bold">
                  Study Sanctuary
                </h3>
              </div>
              <Link
                to="/room"
                onClick={() => playSound('click')}
                className="text-xs font-pixel text-cozy-sage-dark hover:underline font-bold"
              >
                Enter →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center font-pixel">
                <span className="text-cozy-brown-medium">Current Chamber:</span>
                <span className="font-bold text-cozy-brown-dark">
                  {activeRoom?.name || 'Default Study Sanctuary'}
                </span>
              </div>
              <div className="flex justify-between items-center font-pixel">
                <span className="text-cozy-brown-medium">Active Items:</span>
                <span className="font-bold text-cozy-sage-dark">
                  {equippedCount} placed
                </span>
              </div>
              <Link
                to="/room"
                onClick={() => playSound('click')}
                className="w-full touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-cream text-cozy-brown-dark font-pixel text-xs py-2 px-3 rounded-pixel font-bold flex items-center justify-center gap-1.5 shadow-pixel-xs mt-2"
              >
                <span>Enter 3D Sanctuary</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Scholar Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '🔥', label: 'Day Streak', value: `${streak.current_streak} Days`, sub: `Best: ${streak.longest_streak}` },
          { icon: '🪙', label: 'Cozy Coins', value: `${character.cozy_coins}`, sub: 'Ready for Emporium' },
          { icon: '✅', label: 'Quests Inscribed', value: `${completedQuestsCount}`, sub: 'Completed in scroll' },
          { icon: '🏆', label: 'Scholar Level', value: `LVL ${character.level}`, sub: `${xpPercent}% to next` },
        ].map((m, i) => (
          <div key={i} className="pixel-box bg-cozy-card p-3.5 rounded-pixel border-2 border-cozy-brown-dark">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{m.icon}</span>
              <span className="font-pixel text-xs text-cozy-brown-medium">{m.label}</span>
            </div>
            <p className="font-pixel text-base sm:text-lg text-cozy-brown-dark font-bold">
              {m.value}
            </p>
            <p className="text-[10px] font-pixel text-cozy-brown-medium truncate">
              {m.sub}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
