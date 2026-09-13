import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholar } from '../../context/ScholarContext.jsx';

export function SettingsPage() {
  const navigate = useNavigate();
  const {
    user,
    character,
    signOut,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    playSound,
    addToast
  } = useScholar();

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleThemeChange = (newTheme) => {
    playSound('click');
    setTheme(newTheme);
    addToast(`Theme switched to ${newTheme === 'dark' ? 'Cozy Evening' : 'Cozy Cream'}`, 'info');
  };

  const handleSoundToggle = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    if (nextVal) {
      playSound('quest_complete');
      addToast('Sound effects enabled', 'success');
    } else {
      addToast('Sound effects muted', 'info');
    }
  };

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value);
    setSoundVolume(val);
  };

  const handleTestSound = (type) => {
    playSound(type);
    addToast(`Played synthesized ${type.replace('_', ' ')} chime!`, 'info');
  };

  const handleLogout = async () => {
    playSound('click');
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="pb-2 border-b border-cozy-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-pixel text-cozy-brown-dark tracking-wide">
            Sanctuary Settings
          </h2>
          <p className="text-xs sm:text-sm text-cozy-brown-medium font-pixel">
            Personalize your study atmosphere, acoustics, and scholar session.
          </p>
        </div>
        <span className="px-3 py-1 bg-cozy-parchment text-cozy-brown-dark font-pixel text-xs rounded border border-cozy-brown-dark self-start sm:self-auto font-bold shadow-pixel-xs">
          ⚙️ Preferences
        </span>
      </div>

      {/* 1. Theme & Visual Atmosphere */}
      <section className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-cozy-border">
          <span className="text-xl">🎨</span>
          <h3 className="font-pixel text-lg text-cozy-brown-dark font-bold">
            Sanctuary Atmosphere (Theme)
          </h3>
        </div>

        <p className="text-xs text-cozy-brown-medium">
          Choose the ambient lighting for your study scrolls and chambers. Changes persist automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => handleThemeChange('light')}
            className={`text-left p-4 rounded-pixel border-2 transition relative flex flex-col justify-between ${
              theme !== 'dark'
                ? 'bg-cozy-parchment border-cozy-brown-dark shadow-pixel ring-2 ring-cozy-sage'
                : 'bg-cozy-cream/70 border-cozy-border hover:border-cozy-brown-medium'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-pixel text-sm font-bold text-cozy-brown-dark flex items-center gap-1.5">
                  <span>☀️</span>
                  <span>Cozy Cream &amp; Parchment</span>
                </span>
                {theme !== 'dark' && (
                  <span className="px-1.5 py-0.5 bg-cozy-sage text-white text-[10px] font-pixel rounded font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-cozy-brown-medium">
                Daylight study vibe with warm ivory tones, soft sage accents, and high-contrast ink.
              </p>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-cozy-border/60">
              <span className="text-[10px] font-pixel text-cozy-brown-medium">Palette:</span>
              <div className="w-5 h-5 rounded-full bg-[#FDFBF7] border border-[#2C1E17]" title="Cream" />
              <div className="w-5 h-5 rounded-full bg-[#F3ECE1] border border-[#2C1E17]" title="Parchment" />
              <div className="w-5 h-5 rounded-full bg-[#355E3B]" title="Sage Green" />
              <div className="w-5 h-5 rounded-full bg-[#A03E22]" title="Terracotta" />
            </div>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => handleThemeChange('dark')}
            className={`text-left p-4 rounded-pixel border-2 transition relative flex flex-col justify-between ${
              theme === 'dark'
                ? 'bg-cozy-parchment border-cozy-brown-dark shadow-pixel ring-2 ring-cozy-sage'
                : 'bg-cozy-cream/70 border-cozy-border hover:border-cozy-brown-medium'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-pixel text-sm font-bold text-cozy-brown-dark flex items-center gap-1.5">
                  <span>🌙</span>
                  <span>Cozy Evening Hearth</span>
                </span>
                {theme === 'dark' && (
                  <span className="px-1.5 py-0.5 bg-cozy-sage text-white text-[10px] font-pixel rounded font-bold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-cozy-brown-medium">
                Midnight plum hearth with muted night slate cards, gentle ivory text, and comforting glow.
              </p>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-cozy-border/60">
              <span className="text-[10px] font-pixel text-cozy-brown-medium">Palette:</span>
              <div className="w-5 h-5 rounded-full bg-[#18141F] border border-[#4D3F63]" title="Midnight Plum" />
              <div className="w-5 h-5 rounded-full bg-[#2E253D] border border-[#4D3F63]" title="Slate Card" />
              <div className="w-5 h-5 rounded-full bg-[#529E60]" title="Night Sage" />
              <div className="w-5 h-5 rounded-full bg-[#E5A83B]" title="Candle Gold" />
            </div>
          </button>
        </div>
      </section>

      {/* 2. Acoustics & Web Audio Synthesizer */}
      <section className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-cozy-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔔</span>
            <h3 className="font-pixel text-lg text-cozy-brown-dark font-bold">
              Study Acoustics &amp; Sound Effects
            </h3>
          </div>
          <button
            type="button"
            onClick={handleSoundToggle}
            className={`touch-target pixel-box-interactive px-3 py-1.5 rounded-pixel font-pixel text-xs font-bold flex items-center gap-1.5 ${
              soundEnabled
                ? 'bg-cozy-sage text-white'
                : 'bg-cozy-parchment text-cozy-brown-medium'
            }`}
          >
            <span>{soundEnabled ? '🔊 Sound On' : '🔇 Sound Muted'}</span>
          </button>
        </div>

        <p className="text-xs text-cozy-brown-medium">
          Zero-latency sound effects synthesized in real time via the browser's Web Audio API without loading external media files.
        </p>

        {/* Volume Slider */}
        <div className="space-y-2 bg-cozy-parchment/60 p-4 rounded-pixel border border-cozy-border">
          <div className="flex items-center justify-between text-xs font-pixel">
            <label htmlFor="sound-volume-slider" className="font-bold text-cozy-brown-dark">
              Synthesizer Volume: {soundVolume}%
            </label>
            <span className="text-cozy-brown-medium">
              {soundVolume === 0 ? 'Muted' : soundVolume < 40 ? 'Soft' : soundVolume < 80 ? 'Cozy' : 'Loud'}
            </span>
          </div>

          <input
            id="sound-volume-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={soundVolume}
            disabled={!soundEnabled}
            onChange={handleVolumeChange}
            className="w-full accent-cozy-sage cursor-pointer disabled:opacity-50"
          />
        </div>

        {/* Test Chimes Preview Bar */}
        <div className="space-y-2">
          <p className="text-xs font-pixel font-bold text-cozy-brown-dark">
            Audition Synthesized Chimes:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!soundEnabled}
              onClick={() => handleTestSound('quest_complete')}
              className="touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-cream text-cozy-brown-dark font-pixel text-xs px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-xs disabled:opacity-40"
            >
              <span>📜</span>
              <span>Quest Complete</span>
            </button>
            <button
              type="button"
              disabled={!soundEnabled}
              onClick={() => handleTestSound('level_up')}
              className="touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-cream text-cozy-brown-dark font-pixel text-xs px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-xs disabled:opacity-40"
            >
              <span>🎺</span>
              <span>Level Up Fanfare</span>
            </button>
            <button
              type="button"
              disabled={!soundEnabled}
              onClick={() => handleTestSound('purchase')}
              className="touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-cream text-cozy-brown-dark font-pixel text-xs px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-xs disabled:opacity-40"
            >
              <span>🪙</span>
              <span>Coin Purchase</span>
            </button>
            <button
              type="button"
              disabled={!soundEnabled}
              onClick={() => handleTestSound('spirit_spin')}
              className="touch-target pixel-box-interactive bg-cozy-parchment hover:bg-cozy-cream text-cozy-brown-dark font-pixel text-xs px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-xs disabled:opacity-40"
            >
              <span>✨</span>
              <span>Spirit Swirl</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Account Details & Session Management */}
      <section className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel border-2 border-cozy-brown-dark space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-cozy-border">
          <span className="text-xl">📜</span>
          <h3 className="font-pixel text-lg text-cozy-brown-dark font-bold">
            Scholar Identity &amp; Session
          </h3>
        </div>

        <div className="bg-cozy-parchment/60 p-4 rounded-pixel border border-cozy-border space-y-2 text-xs">
          <div className="flex justify-between items-center font-pixel">
            <span className="text-cozy-brown-medium">Scholar Email:</span>
            <span className="font-bold text-cozy-brown-dark">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center font-pixel">
            <span className="text-cozy-brown-medium">Current Status:</span>
            <span className="font-bold text-cozy-sage-dark">Level {character.level} Scholar</span>
          </div>
          <div className="flex justify-between items-center font-pixel">
            <span className="text-cozy-brown-medium">Session Security:</span>
            <span className="font-bold text-cozy-brown-dark">Active Authenticated Bearer Token</span>
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-cozy-border">
          <div>
            <h4 className="font-pixel text-sm text-cozy-brown-dark font-bold">
              Leave Life RPG Session
            </h4>
            <p className="text-xs text-cozy-brown-medium">
              Safely seal your parchment and log out of this device.
            </p>
          </div>

          {confirmLogout ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLogout}
                className="touch-target pixel-box-interactive bg-cozy-terracotta text-white font-pixel text-xs px-4 py-2 rounded-pixel font-bold shadow-pixel-sm"
              >
                Confirm Logout
              </button>
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="touch-target pixel-box bg-cozy-card text-cozy-brown-dark font-pixel text-xs px-3 py-2 rounded-pixel"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmLogout(true)}
              className="touch-target pixel-box-interactive bg-cozy-card hover:bg-cozy-terracotta-subtle hover:text-cozy-terracotta-dark text-cozy-brown-dark font-pixel text-xs px-4 py-2 rounded-pixel font-bold border-2 border-cozy-brown-dark flex items-center gap-2 shadow-pixel-sm"
            >
              <span>🚪</span>
              <span>Log Out of Life RPG</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
