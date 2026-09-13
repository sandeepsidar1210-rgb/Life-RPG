import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { QuestList } from './QuestList.jsx';
import { ShopCatalog } from './ShopCatalog.jsx';
import { RoomSkeleton } from './MyRoom/RoomSkeleton.jsx';
import { CelebrationModal } from './CelebrationModal.jsx';
import { ToastContainer } from './Toast.jsx';

// Lazy-load the 3D Room component so Three.js & R3F don't bloat the initial bundle
const MyRoom = React.lazy(() => import('./MyRoom.jsx'));

export function Dashboard({ defaultTab = 'quests' }) {
  const { user, token, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active tab from URL path or default prop
  const getTabFromPath = () => {
    if (location.pathname.includes('/room')) return 'room';
    if (location.pathname.includes('/shop')) return 'shop';
    return defaultTab || 'quests';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'room') {
      navigate('/dashboard/room');
    } else if (tab === 'shop') {
      navigate('/dashboard/shop');
    } else {
      navigate('/dashboard');
    }
  };

  // State
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interaction loading states
  const [completingId, setCompletingId] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);
  const [equippingId, setEquippingId] = useState(null);

  // Level-up celebration state & trigger ref
  const [celebrationData, setCelebrationData] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const activeTriggerRef = useRef(null);

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

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Helper for offline & friendly error messaging
  const getFriendlyErrorMessage = (err) => {
    if (
      (typeof navigator !== 'undefined' && !navigator.onLine) ||
      err?.message?.includes('Failed to fetch') ||
      err?.message?.includes('NetworkError') ||
      err?.message?.includes('network') ||
      err?.name === 'TypeError'
    ) {
      return "You're offline or connection was lost. Please check your internet connection and try again.";
    }
    return err?.message || 'Something went wrong. Please try again.';
  };

  // Fetch initial profile, quests, inventory, and catalog
  useEffect(() => {
    let isSubscribed = true;

    async function loadDashboardData() {
      if (!token) return;
      setLoading(true);
      try {
        const headers = { 'Authorization': `Bearer ${token}` };

        const [meRes, questsRes, itemsRes, invRes] = await Promise.all([
          fetch(`${apiUrl}/api/me`, { headers }),
          fetch(`${apiUrl}/api/quests`, { headers }),
          fetch(`${apiUrl}/api/items`),
          fetch(`${apiUrl}/api/inventory`, { headers })
        ]);

        if (!meRes.ok) throw new Error('Could not fetch profile');
        const meData = await meRes.json();

        let questsData = { quests: [] };
        if (questsRes.ok) questsData = await questsRes.json();

        let itemsData = { items: [] };
        if (itemsRes.ok) itemsData = await itemsRes.json();

        let invData = { inventory: [] };
        if (invRes.ok) invData = await invRes.json();

        if (isSubscribed) {
          setProfile(meData);
          setQuests(questsData.quests || []);
          setItems(itemsData.items || []);
          setInventory(invData.inventory || meData.inventory || []);
        }
      } catch (err) {
        console.error('[Dashboard Load Error]', err);
        addToast(getFriendlyErrorMessage(err), 'error');
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
      addToast(getFriendlyErrorMessage(err), 'error');
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
      addToast(getFriendlyErrorMessage(err), 'error');
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
      addToast(getFriendlyErrorMessage(err), 'error');
    }
  };

  // 4. Complete Quest
  const handleCompleteQuest = async (questId) => {
    // Prevent rapid double-clicking
    if (completingId) return;
    setCompletingId(questId);
    activeTriggerRef.current = document.activeElement;

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
        setQuests((prev) => prev.map((q) => (q.id === questId ? { ...q, status: 'completed' } : q)));
        return;
      }

      if (!res.ok) throw new Error(data.message || 'Failed to complete quest');

      setQuests((prev) => prev.map((q) => (q.id === questId ? data.quest : q)));
      setProfile((prev) => ({
        ...prev,
        character: data.character,
        streak: data.streak
      }));

      addToast(
        `Quest completed! +${data.rewards.focus_points} Focus Points, +${data.rewards.cozy_coins} Coins, +1 ${data.rewards.attribute.toUpperCase()}`,
        'success'
      );

      if (data.leveledUp) {
        setCelebrationData({
          levelsGained: data.levelsGained,
          newLevel: data.character.level,
          rewards: data.rewards
        });
        setShowCelebration(true);
      }

      if (data.streakIncreased) {
        addToast(`🔥 Day Streak increased to ${data.streak.current_streak}!`, 'success');
      }
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setCompletingId(null);
    }
  };

  // 5. Purchase Item from Shop
  const handlePurchaseItem = async (item) => {
    // Prevent rapid duplicate purchases
    if (purchasingId) return;
    setPurchasingId(item.id);
    try {
      const res = await fetch(`${apiUrl}/api/items/${item.id}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Purchase failed');

      // Update coins & inventory
      setProfile((prev) => ({
        ...prev,
        character: data.character
      }));
      setInventory((prev) => [...prev, data.inventory]);

      addToast(`Adopted "${item.name}"! Coins remaining: ${data.character.cozy_coins}`, 'success');
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  // 6. Equip / Unequip Item (with Optimistic UI and rollback)
  const handleToggleEquip = async (inventoryId) => {
    if (equippingId) return;
    setEquippingId(inventoryId);

    // Save previous inventory for rollback
    const previousInventory = [...inventory];
    const targetItem = previousInventory.find((i) => i.id === inventoryId);
    if (!targetItem) {
      setEquippingId(null);
      return;
    }

    // Toggle: if currently true -> false; if currently false -> true
    const targetEquipped = !targetItem.equipped;
    const category = targetItem?.item?.category;

    // Optimistic UI update
    setInventory((prev) =>
      prev.map((inv) => {
        if (inv.id === inventoryId) {
          return { ...inv, equipped: targetEquipped };
        }
        // Auto-unequip other companions if equipping a companion
        if (targetEquipped && category === 'companion' && inv.item?.category === 'companion') {
          return { ...inv, equipped: false };
        }
        return inv;
      })
    );

    try {
      const res = await fetch(`${apiUrl}/api/inventory/${inventoryId}/equip`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ equipped: targetEquipped })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update equipment');

      // Sync with server response
      setInventory((prev) =>
        prev.map((inv) => {
          if (inv.id === inventoryId) return data.inventory;
          if (targetEquipped && category === 'companion' && inv.item?.category === 'companion' && inv.id !== inventoryId) {
            return { ...inv, equipped: false };
          }
          return inv;
        })
      );

      addToast(data.message, 'success');
    } catch (err) {
      // Rollback optimistic update
      setInventory(previousInventory);
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setEquippingId(null);
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

  // Find all equipped badges across the whole app
  const equippedBadges = inventory.filter((inv) => inv.equipped && inv.item?.category === 'badge');

  const xpPercent = Math.min(100, Math.round((char.current_xp / (char.xp_to_next_level || 100)) * 100));

  return (
    <div className="min-h-screen bg-cozy-cream text-cozy-brown-dark flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-cozy-terracotta-subtle">
      {/* Skip to Content Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Level-Up Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        levelData={celebrationData}
        triggerRef={activeTriggerRef}
      />

      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Top HUD Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-cozy-brown-dark pb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-2xl shadow-pixel-sm border-2 border-cozy-brown-dark select-none"
              aria-hidden="true"
            >
              ☕
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-pixel text-cozy-brown-dark tracking-wide">
                  Life RPG
                </h1>
                <span className="px-2 py-0.5 bg-cozy-sage-subtle text-cozy-sage-dark text-[11px] font-pixel rounded border border-cozy-sage-light">
                  LVL {char.level} Scholar
                </span>

                {/* Equipped Badges Displayed in Header Across the App */}
                {equippedBadges.map((b) => (
                  <motion.span
                    key={b.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    title={`Equipped Badge: ${b.item?.name}`}
                    className="px-2 py-0.5 bg-cozy-gold-light text-cozy-gold-dark text-[11px] font-pixel rounded border border-cozy-gold-base flex items-center gap-1 shadow-pixel-sm"
                  >
                    <span>{b.item?.name === 'Dawn Scholar Badge' ? '🌅' : '🌙'}</span>
                    <span className="hidden sm:inline font-bold">{b.item?.name}</span>
                  </motion.span>
                ))}
              </div>
              <p className="text-xs text-cozy-brown-medium truncate max-w-[220px] sm:max-w-xs">
                Scholar: <span className="font-semibold text-cozy-brown-dark">{user?.email}</span>
              </p>
            </div>
          </div>

          {/* HUD Counters & Logout */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Coins */}
            <motion.div
              key={char.cozy_coins}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              aria-label={`Cozy Coins: ${char.cozy_coins}`}
              className="touch-target pixel-box bg-cozy-parchment px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-sm border-2 border-cozy-brown-dark"
            >
              <span className="text-base" role="img" aria-label="Coins icon">🪙</span>
              <span className="font-pixel text-sm font-bold text-cozy-gold-dark">
                {char.cozy_coins} <span className="font-sans text-[11px] font-normal text-cozy-brown-medium hidden sm:inline">Coins</span>
              </span>
            </motion.div>

            {/* Streak */}
            <motion.div
              key={streak.current_streak}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              aria-label={`Daily Streak: ${streak.current_streak} days`}
              className="touch-target pixel-box bg-cozy-terracotta-subtle px-3 py-1.5 rounded-pixel flex items-center gap-1.5 shadow-pixel-sm border-2 border-cozy-terracotta-dark"
            >
              <span className="text-base" role="img" aria-label="Streak flame icon">🔥</span>
              <span className="font-pixel text-sm font-bold text-cozy-terracotta-dark">
                {streak.current_streak} <span className="font-sans text-[11px] font-normal text-cozy-brown-medium hidden sm:inline">Day Streak</span>
              </span>
            </motion.div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Log out of Life RPG session"
              className="touch-target pixel-box-interactive bg-cozy-card hover:bg-cozy-terracotta-subtle hover:text-cozy-terracotta-dark text-cozy-brown-dark font-pixel text-xs sm:text-sm px-4 py-2 rounded-pixel font-semibold transition flex items-center gap-1.5 shadow-pixel-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
            >
              <span aria-hidden="true">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Character Progress & Non-Linear Level Stats */}
        <section aria-labelledby="char-stats-heading" className="pixel-box bg-cozy-card p-5 sm:p-6 rounded-pixel shadow-pixel border-2 border-cozy-brown-dark bg-gradient-to-br from-white to-cozy-parchment">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="char-stats-heading" className="font-pixel text-xl sm:text-2xl text-cozy-brown-dark">
                  Level {char.level} Scholar
                </h2>
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

          {/* Accessible Focus Points Progress Bar */}
          <div className="space-y-1.5">
            <div 
              role="progressbar"
              aria-valuenow={char.current_xp}
              aria-valuemin={0}
              aria-valuemax={char.xp_to_next_level}
              aria-label="Focus Points Progression to next level"
              aria-valuetext={`${char.current_xp} of ${char.xp_to_next_level} Focus Points, ${xpPercent} percent`}
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
                aria-label={`${stat.name} attribute level ${stat.val}`}
                className="pixel-box bg-cozy-parchment/70 p-3 rounded-pixel flex items-center justify-between border-cozy-border"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg" aria-hidden="true">{stat.icon}</span>
                  <span className="font-pixel text-xs text-cozy-brown-dark font-bold">{stat.name}</span>
                </div>
                <span className="font-pixel text-xs font-bold px-2 py-0.5 bg-white rounded border border-cozy-border shadow-pixel-sm">
                  LVL {stat.val}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* View Switcher: Nav Element with Quests, My Room, and Shop */}
        <nav aria-label="Study Haven Views" className="flex items-center gap-2 border-b-2 border-cozy-brown-dark pb-2 overflow-x-auto">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'quests'}
            onClick={() => handleTabSwitch('quests')}
            className={`touch-target pixel-box px-4 py-2.5 rounded-pixel font-pixel text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
              activeTab === 'quests'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span aria-hidden="true">📜</span>
            <span>Study Quests ({quests.filter(q => q.status === 'active').length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'room'}
            onClick={() => handleTabSwitch('room')}
            className={`touch-target pixel-box px-4 py-2.5 rounded-pixel font-pixel text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
              activeTab === 'room'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span aria-hidden="true">🛋️</span>
            <span>My Room ({inventory.filter(i => i.equipped).length} Active)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'shop'}
            onClick={() => handleTabSwitch('shop')}
            className={`touch-target pixel-box px-4 py-2.5 rounded-pixel font-pixel text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
              activeTab === 'shop'
                ? 'bg-cozy-card text-cozy-brown-dark shadow-pixel-sm border-2 border-cozy-brown-dark'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            <span aria-hidden="true">🛒</span>
            <span>Study Emporium ({items.length} Items)</span>
          </button>
        </nav>

        {/* Main Content Area */}
        <main id="main-content" tabIndex={-1} className="focus:outline-none">
          {activeTab === 'quests' && (
            <QuestList
              quests={quests}
              onComplete={handleCompleteQuest}
              onCreate={handleCreateQuest}
              onEdit={handleEditQuest}
              onDelete={handleDeleteQuest}
              completingId={completingId}
            />
          )}

          {activeTab === 'room' && (
            <React.Suspense fallback={<RoomSkeleton />}>
              <MyRoom
                inventory={inventory}
                onToggleEquip={handleToggleEquip}
                equippingId={equippingId}
                onNavigateToShop={() => handleTabSwitch('shop')}
              />
            </React.Suspense>
          )}

          {activeTab === 'shop' && (
            <ShopCatalog
              items={items}
              inventory={inventory}
              userCoins={char.cozy_coins}
              onPurchase={handlePurchaseItem}
              purchasingId={purchasingId}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto text-center text-xs text-cozy-brown-medium border-t border-cozy-border pt-4 mt-8">
        Life RPG • Personalized Study Room Scene • Real-Time Inventory &amp; Badge Display
      </footer>
    </div>
  );
}
