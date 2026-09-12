import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [serverStatus, setServerStatus] = useState({ checking: true, ok: false, data: null, error: null })

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        const res = await fetch(`${apiUrl}/health`)
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        const data = await res.json()
        setServerStatus({ checking: false, ok: true, data, error: null })
      } catch (err) {
        setServerStatus({ checking: false, ok: false, data: null, error: err.message })
      }
    }
    checkBackend()
  }, [])

  return (
    <div className="min-h-screen bg-cozy-cream text-cozy-brown-dark flex flex-col items-center justify-between p-6 sm:p-10 font-sans selection:bg-cozy-terracotta-subtle selection:text-cozy-brown-dark">
      {/* Top Bar / HUD */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b-2 border-cozy-brown-dark pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none" role="img" aria-label="study room icon">📖</span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-pixel text-cozy-brown-dark tracking-wide">
              Life RPG
            </h1>
            <p className="text-xs sm:text-sm text-cozy-brown-medium font-medium">
              Cozy Pixel Study Room Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Currency: Cozy Coins */}
          <div className="pixel-box bg-cozy-parchment px-3 py-1.5 rounded-pixel flex items-center gap-2">
            <span className="text-base" role="img" aria-label="coin">🪙</span>
            <span className="font-pixel text-sm sm:text-base font-bold text-cozy-gold-dark">
              100 <span className="font-sans text-xs font-normal text-cozy-brown-medium">Cozy Coins</span>
            </span>
          </div>

          {/* XP: Focus Points */}
          <div className="pixel-box bg-cozy-sage-subtle px-3 py-1.5 rounded-pixel flex items-center gap-2">
            <span className="text-base" role="img" aria-label="sparkles">✨</span>
            <span className="font-pixel text-sm sm:text-base font-bold text-cozy-sage-dark">
              0 <span className="font-sans text-xs font-normal text-cozy-brown-medium">Focus Points</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-4xl my-8 space-y-8">
        {/* Welcome Banner */}
        <motion.section 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pixel-box bg-cozy-card p-6 sm:p-8 rounded-pixel bg-gradient-to-br from-white to-cozy-parchment"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="inline-block px-2.5 py-1 bg-cozy-terracotta-subtle text-cozy-terracotta-dark text-xs font-semibold rounded-pixel mb-2 border border-cozy-terracotta-light">
                Initial Scaffold v0.1.0
              </span>
              <h2 className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark mb-1">
                Welcome to your Study Haven
              </h2>
              <p className="text-sm text-cozy-brown-medium max-w-lg leading-relaxed">
                Transform mundane daily routines into rewarding RPG Quests. Earn Focus Points, level up character attributes, and unlock peaceful study decor.
              </p>
            </div>

            {/* Backend Health Check Badge */}
            <div className="pixel-box bg-cozy-parchment p-3 rounded-pixel text-xs min-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${serverStatus.checking ? 'bg-cozy-gold animate-pulse' : serverStatus.ok ? 'bg-cozy-sage' : 'bg-cozy-terracotta'}`}></span>
                <span className="font-semibold text-cozy-brown-dark font-pixel">Server Status</span>
              </div>
              <p className="text-cozy-brown-medium">
                {serverStatus.checking && 'Pinging Express /health...'}
                {serverStatus.ok && (
                  <span className="text-cozy-sage-dark font-medium">
                    Online ({JSON.stringify(serverStatus.data)})
                  </span>
                )}
                {serverStatus.error && (
                  <span className="text-cozy-terracotta-dark">
                    Offline ({serverStatus.error})
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Character Attributes Preview */}
        <section>
          <h3 className="text-lg font-pixel text-cozy-brown-dark mb-3 flex items-center gap-2">
            <span>📊</span> Character Attributes
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Focus', color: 'bg-cozy-stats-focus', border: 'border-blue-900/20', desc: 'Deep work & study' },
              { name: 'Discipline', color: 'bg-cozy-stats-discipline', border: 'border-amber-900/20', desc: 'Habits & routines' },
              { name: 'Vitality', color: 'bg-cozy-stats-vitality', border: 'border-green-900/20', desc: 'Health & movement' },
              { name: 'Creativity', color: 'bg-cozy-stats-creativity', border: 'border-red-900/20', desc: 'Art & exploration' },
            ].map((stat) => (
              <div key={stat.name} className="pixel-box bg-cozy-card p-4 rounded-pixel">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-sm font-semibold text-cozy-brown-dark">{stat.name}</span>
                  <span className="text-xs font-pixel text-cozy-brown-medium">LVL 1</span>
                </div>
                <div className="w-full bg-cozy-brown-subtle h-2 rounded-full overflow-hidden border border-cozy-brown-light/40">
                  <div className={`h-full ${stat.color} w-1/4 rounded-full`}></div>
                </div>
                <p className="text-[11px] text-cozy-brown-medium mt-2">{stat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quests Preview */}
        <section>
          <h3 className="text-lg font-pixel text-cozy-brown-dark mb-3 flex items-center gap-2">
            <span>📜</span> Active Quests
          </h3>
          <div className="pixel-box bg-cozy-card p-5 rounded-pixel flex items-center justify-between border-dashed">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                readOnly 
                className="w-5 h-5 accent-cozy-sage rounded cursor-pointer"
              />
              <div>
                <p className="font-medium text-sm text-cozy-brown-dark">Set up Life RPG scaffold</p>
                <p className="text-xs text-cozy-brown-medium">+50 Focus Points • +20 Cozy Coins</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-cozy-sage-subtle text-cozy-sage-dark text-xs font-pixel rounded border border-cozy-sage-light">
              Scaffold Quest
            </span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center text-xs text-cozy-brown-medium border-t border-cozy-border pt-4">
        Life RPG • Warm Cream &amp; Sage Palette • Vite + React + Express + Supabase Architecture
      </footer>
    </div>
  )
}

export default App
