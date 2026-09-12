import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { QuestList } from './QuestList.jsx';
import { ShopCatalog } from './ShopCatalog.jsx';
import { CelebrationModal } from './CelebrationModal.jsx';
import { ToastContainer } from './Toast.jsx';

export function Dashboard() {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();

  // Navigation tab: 'quests' | 'shop'
  const [activeTab, setActiveTab] = useState('quests');

  // Character, streaks, quests, items & inventory state
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction loading states
  const [completingId, setCompletingId] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);

  // Level-up celebration state
  const [celebrationData, setCelebrationData] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Base API URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch initial profile, quests, and catalog
  useEffect(() => {
    let isSubscribed = true;

    async function loadDashboardData() {
      if (!token) return;
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch profile (/api/me), quests (/api/quests), and shop catalog (/api/items)
        const [meRes, questsRes, itemsRes] = await Promise.all([
          fetch(`${apiUrl}/api/me`, { headers }),
          fetch(`${apiUrl}/api/quests`, { headers }),
          fetch(`${apiUrl}/api/items`)
        ]);

        if (!meRes.ok) throw new Error('Could not fetch profile');
        const meData = await meRes.json();

        let questsData = { quests: [] };
        if (questsRes.ok) {
          questsData = await questsRes.json();
        }

        let itemsData = { items: [] };
        if (itemsRes.ok) {
          itemsData = await itemsRes.json();
        }

        if (isSubscribed) {
          setProfile(meData);
          setQuests(questsData.quests || []);
          setItems(itemsData.items || []);
        }
      } catch (err) {
        console.error('[Dashboard Load Error]', err);
        addToast(err.message, 'error');
      } finally {
        if (isSubscribed) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isSubscribed = false;
    };
  }, [token]);

  // 1. Create Quest
  const handleCreateQuest = async (questData) => {
    try {
      const res = await fetch(`${apiUrl}/api/quests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create quest');

      setQuests((prev) => [data.quest, ...prev]);
      addToast(`Quest "${data.quest.title}" inscribed!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // 2. Edit Quest
  const handleEditQuest = async (questId, updates) => {
    try {
      const res = await fetch(`${apiUrl}/api/quests/${questId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update quest');

      setQuests((prev) => prev.map((q) => (q.id === questId ? data.quest : q)));
      addToast('Quest updated successfully.', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // 3. Delete Quest
  const handleDeleteQuest = async (questId) => {
    try {
      const res = await fetch(`${apiUrl}/api/quests/${questId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete quest');
      }

      setQuests((prev) => prev.filter((q) => q.id !== questId));
      addToast('Quest removed from your scroll.', 'info');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // 4. Complete Quest (Core Progression Handler)
  const handleCompleteQuest = async (questId) => {
    setCompletingId(questId);
    try {
      const res = await fetch(`${apiUrl}/api/quests/${questId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.status === 409) {
        addToast('This quest is already completed!', 'error');
        // sync quest status locally
        setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, status: 'completed' } : q)));
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || 'Failed to complete quest');
      }

      // Update quests list
      setQuests((prev) => prev.map((q) => (q.id === questId ? data.quest : q)));

      // Update character & streaks state
      setProfile((prev) => ({
        ...prev,
        character: data.character,
        streak: data.streak
      }));

      // Toast reward summary
      addToast(
        `Quest completed! +${data.rewards.focus_points} Focus Points, +${data.rewards.cozy_coins} Coins, +1 ${data.rewards.attribute.toUpperCase()}`,
        'success'
      );

      // Trigger Celebration Modal if Level Up occurred!
      if (data.leveledUp) {
        setCelebrationData({
          levelsGained: data.levelsGained,
          newLevel: data.character.level,
          rewards: data.rewards
        });
        setShowCelebration(true);
      }

      // Streak celebration
      if (data.streakIncreased) {
        addToast(`🔥 Day Streak increased to ${data.streak.current_streak}!`, 'success');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setCompletingId(null);
    }
  };

  // 5. Purchase Item from Shop
  const handlePurchaseItem = async (item) => {
    setPurchasingId(item.id);
    try {
      const res = await fetch(`${apiUrl}/api/items/${item.id}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Purchase failed');
      }

      // Update character coin balance & inventory
      setProfile((prev) => ({
        ...prev,
        character: data.character,
        inventory: [...(prev.inventory || []), data.inventory]
      }));

      addToast(`Adopted "${item.name}"! Coins remaining: ${data.character.cozy_coins}`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setPurchasingId(null);
    }
  };

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

  const xpPercent = Math.min(100, Math.round((char.current_xp / (char.xp_to_next_level || 100)) * 100));

  return (
    <div className="min-h-screen bg-cozy-cream text-cozy-brown-dark flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-cozy-terracotta-subtle">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Level-Up Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        levelData={celebrationData}
      />

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Top HUD Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-cozy-brown-dark pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-2xl shadow-pixel-sm border-2 border-cozy-brown-dark">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-pixel text-cozy-brown-dark tracking-wide">Life RPG</h1>
                <span className="px-2 py-0.5 bg-cozy-sage-subtle text-cozy-sage-dark text-[11px] font-pixel rounded border border-cozy-sage-light">
                  LVL {char.level} Scholar
                </span>
              </div>
              <p className="text-xs text-cozy-brown-medium truncate max-w-[200px] sm:max-w-xs">
                Scholar: <span className="font-semibold text-cozy-brown-dark">{user?.email}</span>
              </p>
            </div>
          </div>

          {/* HUD Counters & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Coins */}
            <motion.div
              key={char.cozy_coins}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="pixel-box bg-cozy-parchment px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-sm border-2 border-cozy-brown-dark"
            >
              <span className="text-sm">🪙</span>
              <span className="font-pixel text-sm font-bold text-cozy-gold-dark">
                {char.cozy_coins} <span className="font-sans text-[11px] font-normal text-cozy-brown-medium hidden sm:inline">Coins</span>
              </span>
            </motion.div>

            {/* Streak */}
            <motion.div
              key={streak.current_streak}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="pixel-box bg-cozy-terracotta-subtle px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-sm border-2 border-cozy-terracotta-dark"
            >
              <span className="text-sm">🔥</span>
              <span className="font-pixel text-sm font-bold text-cozy-terracotta-dark">
                {streak.current_streak} <span className="font-sans text-[11px] font-normal text-cozy-brown-medium hidden sm:inline">Day Streak</span>
              </span>
            </motion.div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="pixel-box-interactive bg-cozy-card hover:bg-cozy-terracotta-subtle hover:text-cozy-terracotta-dark text-cozy-brown-dark font-pixel text-xs sm:text-sm px-3 py-1.5 rounded-pixel font-semibold transition flex items-center gap-1.5 shadow-pixel-sm"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Character Progress & Non-Linear Level Stats */}
        <section className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel shadow-pixel border-2 border-cozy-brown-dark bg-gradient-to-br from-white to-cozy-parchment">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark">
                  Level {char.level} Scholar
                </span>
                <span className="text-xs bg-cozy-sage text-white px-2 py-0.5 rounded-pixel font-pixel font-bold">
                  Active Journey
                </span>
              </div>
              <p className="text-xs text-cozy-brown-medium">
                Focus Points: {char.current_xp} / {char.xp_to_next_level} FP
              </p>
            </div>

            <div className="text-right sm:text-left text-xs text-cozy-brown-medium font-pixel">
              <span>Next Threshold: </span>
              <span className="font-bold text-cozy-sage-dark">{char.xp_to_next_level - char.current_xp} FP Needed</span>
            </div>
          </div>

          {/* Animated Focus Points Spring Bar */}
          <div className="space-y-1">
            <div className="w-full bg-cozy-brown-subtle h-4 rounded-pixel border-2 border-cozy-brown-dark overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                className="h-full bg-gradient-to-r from-cozy-sage-light via-cozy-sage to-cozy-sage-dark rounded-sm"
              />
            </div>
            <div className="flex justify-between text-[11px] font-pixel text-cozy-brown-medium">
              <span>{xpPercent}% Progress to Level {char.level + 1}</span>
              <span>Formula: 100 * LVL^1.5</span>
            </div>
          </div>

          {/* 4 Core Character Attributes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-cozy-border">
            {[
              { id: 'focus', name: 'Focus', val: char.focus, icon: '🎯', color: 'bg-cozy-stats-focus' },
              { id: 'discipline', name: 'Discipline', val: char.discipline, icon: '⏳', color: 'bg-cozy-stats-discipline' },
              { id: 'vitality', name: 'Vitality', val: char.vitality, icon: '🌿', color: 'bg-cozy-stats-vitality' },
              { id: 'creativity', name: 'Creativity', val: char.creativity, icon: '🎨', color: 'bg-cozy-stats-creativity' },
            ].map((stat) => (
              <motion.div
                key={stat.id}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 0.3 }}
                className="pixel-box bg-cozy-parchment/60 p-2.5 rounded-pixel flex items-center justify-between border-cozy-border"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{stat.icon}</span>
                  <span className="font-pixel text-xs text-cozy-brown-dark">{stat.name}</span>
                </div>
                <span className="font-pixel text-xs font-bold px-1.5 py-0.5 bg-white rounded border border-cozy-border">
                  LVL {stat.val}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* View Switcher: Quests Scroll vs Study Emporium */}
        <div className="flex items-center gap-2 border-b-2 border-cozy-brown-dark pb-2">
          <button
            onClick={() => setActiveTab('quests')}
            className={`pixel-box px-4 py-2 rounded-pixel font-pixel text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'quests'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span>📜</span>
            <span>Study Quests ({quests.filter(q => q.status === 'active').length})</span>
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`pixel-box px-4 py-2 rounded-pixel font-pixel text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span>🛒</span>
            <span>Study Emporium ({items.length} Items)</span>
          </button>
        </div>

        {/* Tab Views */}
        <main>
          {activeTab === 'quests' ? (
            <QuestList
              quests={quests}
              onComplete={handleCompleteQuest}
              onCreate={handleCreateQuest}
              onEdit={handleEditQuest}
              onDelete={handleDeleteQuest}
              completingId={completingId}
            />
          ) : (
            <ShopCatalog
              items={items}
              inventory={profile?.inventory || []}
              userCoins={char.cozy_coins}
              onPurchase={handlePurchaseItem}
              purchasingId={purchasingId}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center text-xs text-cozy-brown-medium border-t border-cozy-border pt-4 mt-8">
        Life RPG • Non-Linear Progression Engine • Real-Time Inventory &amp; Quests
      </footer>
    </div>
  );
}
