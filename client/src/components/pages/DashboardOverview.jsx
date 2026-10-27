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
    <div className="space-y-8 select-none">
      {/* =================================================================== */}
      {/* HERO BANNER - "SOMETHING BIG!" COMIC STYLE                          */}
      {/* =================================================================== */}
      <section className="text-center py-4 space-y-3">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          <h1 className="comic-title-gradient text-4xl sm:text-6xl md:text-7xl tracking-wider leading-none">
            SOMETHING BIG!
          </h1>
        </motion.div>
        <p className="text-sm sm:text-base text-white/90 max-w-2xl mx-auto font-medium leading-relaxed font-sans px-2">
          The Scholar team is in the lab brewing an electrifying non-stop study schedule with midnight sprints, mystery challenges, and epic multiverse habit quests.
        </p>

        {/* Quick Action Navigation Buttons with Hover Uplift */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/quests"
            onClick={() => playSound('click')}
            className="pixel-box-interactive bg-[#00f0ff] hover:bg-[#5ef4ff] text-black font-bangers text-base px-5 py-2 rounded-xl flex items-center gap-2 border-3 border-black shadow-comic-sm tracking-wide"
          >
            <span>📜</span>
            <span>STUDY QUESTS ({activeQuests.length})</span>
          </Link>
          <Link
            to="/room"
            onClick={() => playSound('click')}
            className="pixel-box-interactive bg-[#ff70a6] hover:bg-[#ff85a1] text-black font-bangers text-base px-5 py-2 rounded-xl flex items-center gap-2 border-3 border-black shadow-comic-sm tracking-wide"
          >
            <span>🛋️</span>
            <span>3D SANCTUARY</span>
          </Link>
          <Link
            to="/spirit"
            onClick={() => playSound('click')}
            className="pixel-box-interactive bg-[#ffe600] hover:bg-[#fef08a] text-black font-bangers text-base px-5 py-2 rounded-xl flex items-center gap-2 border-3 border-black shadow-comic-sm tracking-wide"
          >
            <span>✨</span>
            <span>ATTUNE SPIRIT</span>
          </Link>
        </div>
      </section>

      {/* =================================================================== */}
      {/* THE 4 GRAND COMIC PANELS (EXACTLY AS IN SCREENSHOT 1)               */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANEL 1: BUBBLEGUM PINK CARD */}
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="comic-panel-pink p-5 flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="comic-tab-pill">
                SECRET LAB • DAY {String(streak.current_streak || 1).padStart(2, '0')}
              </span>
              <span className="text-xl">🧪</span>
            </div>

            {/* Inner White Speech Bubble */}
            <div className="comic-speech-bubble">
              <span className="comic-speaker text-[#e11d48]">
                HEAD CHEF // ORGANIZER:
              </span>
              <p className="text-sm sm:text-base font-bold text-black font-sans leading-snug">
                "Simmer down! We are loading 36 hours of radioactive problem statements, study workshops, and surprise midnight power-ups!"
              </p>
            </div>
          </div>

          {/* Badges / Stickers Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-2xl">
              <span>👨‍🍳</span>
              <span>🍳</span>
              <span>⚡</span>
            </div>
            <span className="comic-sticker comic-sticker-yellow">
              SIZZLE!
            </span>
          </div>

          {/* Bottom Black Pill Bar */}
          <div className="comic-bottom-bar">
            ORGANIZERS ARE PREPARING THE BIGGEST STUDY SPRINT OF 2026.
          </div>
        </motion.div>

        {/* PANEL 2: ELECTRIC CYAN CARD */}
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="comic-panel-cyan p-5 flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="comic-tab-pill">
                WAR ROOM • KITCHEN
              </span>
              <span className="text-xl">🔥</span>
            </div>

            {/* Inner White Speech Bubble */}
            <div className="comic-speech-bubble">
              <span className="comic-speaker text-[#0284c7]">
                CORE COMMITTEE:
              </span>
              <p className="text-sm sm:text-base font-bold text-black font-sans leading-snug">
                "Upgrading to 36 non-stop hours with high-energy fuel and industry titan mentors!"
              </p>
            </div>
          </div>

          {/* Badges / Code Block Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="comic-sticker comic-sticker-orange">
              BOILING!
            </span>
            <div className="bg-black text-[#00f0ff] font-mono text-[11px] px-3 py-1.5 rounded-lg border-2 border-black">
              <div>duration = "36_HOURS_NON_STOP"</div>
              <div>status = "ORGANISER_COOKING_BIG"</div>
            </div>
          </div>

          {/* Bottom Black Pill Bar */}
          <div className="comic-bottom-bar">
            THE CEILING CANNOT HOLD WHAT IS COMING NEXT.
          </div>
        </motion.div>

        {/* PANEL 3: VIVID FLAME ORANGE CARD */}
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="comic-panel-orange p-5 flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="comic-tab-pill">
                RECIPE SPECS • 36 HOURS
              </span>
              <span className="text-xl">📜</span>
            </div>

            {/* Inner White Speech Bubble */}
            <div className="comic-speech-bubble">
              <span className="comic-speaker text-[#c2410c]">
                LEAD MENTOR:
              </span>
              <p className="text-sm sm:text-base font-bold text-black font-sans leading-snug">
                "When the stove is hot, only the best developers shine. 300+ hackers on campus will feast on pure innovation!"
              </p>
            </div>
          </div>

          {/* Stat Boxes Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-black text-white p-2 rounded-lg border-2 border-black text-center">
              <div className="font-bangers text-lg sm:text-xl text-[#ffe600]">
                {streak.current_streak}
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider font-sans text-white/80">
                DAYS STREAK
              </div>
            </div>
            <div className="bg-black text-white p-2 rounded-lg border-2 border-black text-center">
              <div className="font-bangers text-lg sm:text-xl text-[#00f0ff]">
                {character.cozy_coins}+
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider font-sans text-white/80">
                COINS IN VAULT
              </div>
            </div>
            <div className="bg-black text-white p-2 rounded-lg border-2 border-black text-center">
              <div className="font-bangers text-lg sm:text-xl text-[#ff007f]">
                {completedQuestsCount}+
              </div>
              <div className="text-[9px] font-bold uppercase tracking-wider font-sans text-white/80">
                FINAL SQUADS
              </div>
            </div>
          </div>

          {/* Bottom Black Pill Bar */}
          <div className="comic-bottom-bar">
            TIMELINE REVEAL IMMINENT. KEEP YOUR NOTIFICATIONS ON.
          </div>
        </motion.div>

        {/* PANEL 4: NEON MAGENTA CARD */}
        <motion.div
          whileHover={{ y: -6, scale: 1.015 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="comic-panel-magenta p-5 flex flex-col justify-between space-y-4 cursor-pointer"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="comic-tab-pill">
                FINAL PLATING • ATAL NAGAR
              </span>
              <span className="text-xl">🕷️</span>
            </div>

            {/* Inner White Speech Bubble */}
            <div className="comic-speech-bubble">
              <span className="comic-speaker text-[#be185d]">
                SPIDER-MAN:
              </span>
              <p className="text-sm sm:text-base font-bold text-black font-sans leading-snug">
                "LET 'EM COOK! THE GRAND 36-HOUR TIMELINE WILL DROP SOON ACROSS ALL CHANNELS!"
              </p>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="comic-sticker comic-sticker-yellow">
              POP!
            </span>
            <div className="bg-black text-[#10b981] font-bangers text-sm px-3 py-1.5 rounded-lg border-2 border-black flex items-center gap-1.5">
              <span>✓</span>
              <span>SOMETHING HUGE IN THE OVEN</span>
            </div>
          </div>

          {/* Bottom Black Pill Bar */}
          <div className="comic-bottom-bar">
            HACK-A-SOL 5.0: STAGED AT IIIT NAYA RAIPUR CAMPUS.
          </div>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* 4 FEATURE CARDS (FROM SCREENSHOT 2)                                 */}
      {/* =================================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '⚡', title: 'CLOUD CREDITS', desc: 'Compute & API quotas for 36-hour live deployments' },
          { icon: '🛡️', title: 'MENTOR GUIDANCE', desc: 'Industry veterans and tech leads in the war room' },
          { icon: '🎗️', title: 'EXCLUSIVE SWAG', desc: 'Spider-Verse & tech titan collector packs' },
          { icon: '⭐', title: 'FAST-TRACK ROLES', desc: 'Hiring pipelines & direct interview access' },
        ].map((feat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            className="comic-box bg-[#121622] p-4 flex items-center gap-3.5 border-3 border-black shadow-comic cursor-pointer"
          >
            <div className="w-12 h-12 shrink-0 bg-[#ffe600] rounded-xl border-2 border-black flex items-center justify-center text-xl shadow-sm text-black">
              {feat.icon}
            </div>
            <div>
              <h4 className="font-bangers text-white text-base tracking-wide leading-tight">
                {feat.title}
              </h4>
              <p className="text-[11px] text-white/70 font-sans leading-tight mt-0.5 font-medium">
                {feat.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* =================================================================== */}
      {/* BIG CYAN SPONSOR CTA BANNER (FROM SCREENSHOT 2)                    */}
      {/* =================================================================== */}
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        className="comic-box bg-[#00f0ff] p-6 text-center border-4 border-black shadow-comic-lg cursor-pointer"
      >
        <h2 className="comic-title text-3xl sm:text-5xl text-black tracking-wider leading-none">
          BECOME A MULTIVERSE SPONSOR
        </h2>
        <p className="text-xs sm:text-sm font-bangers text-black/90 tracking-wider mt-1.5 uppercase">
          PARTNER WITH HACK-A-SOL 5.0 • REACH 2800+ TOP STUDENT DEVELOPERS
        </p>
      </motion.div>

      {/* =================================================================== */}
      {/* COMIC SECTION BREAK (FROM SCREENSHOT 2)                             */}
      {/* =================================================================== */}
      <div className="pt-4 pb-2 space-y-1">
        <span className="comic-sticker comic-sticker-orange text-xs py-1 px-3">
          COMIC 05
        </span>
        <h3 className="comic-title-pink text-3xl sm:text-5xl tracking-wider">
          TO BE CONTINUED IN HACK-A-SOL 5.0...
        </h3>
      </div>

      {/* =================================================================== */}
      {/* COMIC PANELS: ACTIVE QUESTS (PANEL A) & COMPANION (PANEL B)         */}
      {/* =================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANEL A: ORANGE COMIC CARD */}
        <motion.div
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="comic-panel-orange p-5 flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="comic-tab-pill">
                PANEL A // HQ COORDINATES
              </span>
              <span className="text-xl">📜</span>
            </div>

            {/* Speech Bubble */}
            <div className="comic-speech-bubble space-y-2">
              <span className="comic-speaker text-[#ea580c]">
                SPIDER-MAN:
              </span>
              <p className="text-sm font-bold text-black font-sans leading-snug">
                "With great code comes great responsibility. Complete your active study quests to conquer the multiverse!"
              </p>

              {/* Active Quests Preview */}
              <div className="pt-2 border-t-2 border-black/10 space-y-2">
                {activeQuests.length === 0 ? (
                  <p className="text-xs font-bold text-black/70 italic">
                    All quests completed! Inscribe a new mission in your scroll.
                  </p>
                ) : (
                  activeQuests.slice(0, 2).map((q) => (
                    <div
                      key={q.id}
                      className="bg-black/5 p-2 rounded-lg border-2 border-black flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <p className="text-xs font-bold text-black truncate font-sans">
                          {q.title}
                        </p>
                        <p className="text-[10px] text-black/60 uppercase font-mono">
                          +{q.focus_points_reward || 25} FP • +{q.cozy_coins_reward || 10} Coins
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={completingId === q.id}
                        onClick={() => handleCompleteQuest(q.id)}
                        className="shrink-0 pixel-box-interactive bg-[#10b981] hover:bg-[#059669] text-white font-bangers text-xs px-2.5 py-1 rounded-md border-2 border-black shadow-sm"
                      >
                        {completingId === q.id ? 'COOKING...' : 'DONE ✓'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <Link
            to="/quests"
            onClick={() => playSound('click')}
            className="comic-bottom-bar block hover:bg-black/90 transition text-center"
          >
            VIEW FULL QUEST SCROLL ({activeQuests.length} ACTIVE) →
          </Link>
        </motion.div>

        {/* PANEL B: PINK COMIC CARD */}
        <motion.div
          whileHover={{ y: -5, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
          className="comic-panel-pink p-5 flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="comic-tab-pill">
                PANEL B // HERO EMERGENCY HOTLINE
              </span>
              <span className="text-xl">✨</span>
            </div>

            {/* Speech Bubble */}
            <div className="comic-speech-bubble space-y-2">
              <span className="comic-speaker text-[#e11d48]">
                LEAD ORGANIZERS:
              </span>
              <p className="text-sm font-bold text-black font-sans leading-snug">
                "Have queries or need assistance? Reach out to your study spirit companion and enter the 3D sanctuary directly!"
              </p>

              {/* Spirit Info Preview */}
              <div className="pt-2 border-t-2 border-black/10 flex items-center gap-3">
                <div className="w-12 h-12 bg-[#ffe600] rounded-xl border-2 border-black flex items-center justify-center text-2xl shadow-sm">
                  {spirit?.species?.attribute_type === 'focus' ? '🏮' :
                   spirit?.species?.attribute_type === 'discipline' ? '🗿' :
                   spirit?.species?.attribute_type === 'vitality' ? '🌱' : '✨'}
                </div>
                <div className="truncate">
                  <h5 className="font-bangers text-black text-base truncate">
                    {spirit?.current_stage?.name || spirit?.species?.name || 'STUDY COMPANION'}
                  </h5>
                  <p className="text-[10px] text-black/70 font-sans font-bold uppercase">
                    STAGE {spirit?.current_stage?.stage_number || 1} • {activeRoom?.name || 'SANCTUARY'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            to="/room"
            onClick={() => playSound('click')}
            className="comic-bottom-bar block hover:bg-black/90 transition text-center"
          >
            ENTER 3D SANCTUARY CHAMBER ({equippedCount} PLACED) →
          </Link>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* CHARACTER STATS PROGRESSION COMIC STRIP                             */}
      {/* =================================================================== */}
      <section className="comic-box bg-[#141824] p-5 sm:p-6 border-3 border-black shadow-comic-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bangers text-2xl sm:text-3xl text-white tracking-wide">
                LEVEL {character.level} SCHOLAR HERO
              </h3>
              <span className="comic-tab-pill bg-[#00f0ff] text-black">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-white/70 font-mono mt-0.5">
              FOCUS POINTS: <span className="font-bold text-[#ffe600]">{character.current_xp}</span> / {character.xp_to_next_level} FP
            </p>
          </div>

          <div className="text-xs text-white/70 font-mono">
            NEXT THRESHOLD: <span className="font-bold text-[#00f0ff]">{character.xp_to_next_level - character.current_xp} FP NEEDED</span>
          </div>
        </div>

        {/* Focus Points Progress Bar */}
        <div className="w-full bg-black h-5 rounded-xl border-3 border-black overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="h-full bg-gradient-to-r from-[#00f0ff] via-[#ffe600] to-[#ff007f] rounded-lg"
          />
        </div>

        {/* 4 Core Attributes Grid with Hover Uplift */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { id: 'focus', name: 'FOCUS', val: character.focus, icon: '🎯', bg: 'bg-[#00f0ff]', text: 'text-black' },
            { id: 'discipline', name: 'DISCIPLINE', val: character.discipline, icon: '⏳', bg: 'bg-[#ffe600]', text: 'text-black' },
            { id: 'vitality', name: 'VITALITY', val: character.vitality, icon: '🌿', bg: 'bg-[#10b981]', text: 'text-white' },
            { id: 'creativity', name: 'CREATIVITY', val: character.creativity, icon: '🎨', bg: 'bg-[#ff007f]', text: 'text-white' },
          ].map((stat) => (
            <motion.div
              key={stat.id}
              whileHover={{ y: -4, scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className={`comic-box ${stat.bg} ${stat.text} p-3 rounded-xl flex items-center justify-between border-2 border-black shadow-comic-sm cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{stat.icon}</span>
                <span className="font-bangers text-sm tracking-wide">{stat.name}</span>
              </div>
              <span className="bg-black text-white px-2 py-0.5 rounded-md font-bangers text-xs border border-black">
                LVL {stat.val}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
