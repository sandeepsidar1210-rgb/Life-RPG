import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext.jsx';
import { playSfx } from '../utils/audio.js';

const ScholarContext = createContext(null);
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function ScholarProvider({ children }) {
  const { user, token, signOut } = useAuth();

  // Core Data
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [spirit, setSpirit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interaction Loading States
  const [completingId, setCompletingId] = useState(null);
  const [purchasingId, setPurchasingId] = useState(null);
  const [equippingId, setEquippingId] = useState(null);

  // Sequenced Celebration Modal Queues
  const [celebrationData, setCelebrationData] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const activeTriggerRef = useRef(null);

  const [spiritEvolutionQueue, setSpiritEvolutionQueue] = useState([]);
  const [currentSpiritEvolution, setCurrentSpiritEvolution] = useState(null);

  const [roomUnlockQueue, setRoomUnlockQueue] = useState([]);
  const [currentUnlockedRoom, setCurrentUnlockedRoom] = useState(null);

  const [achievementQueue, setAchievementQueue] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [freshAchievements, setFreshAchievements] = useState([]);

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // =========================================================================
  // Theme Engine (Light vs Cozy Evening Dark Variant)
  // =========================================================================
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('life_rpg_theme') || 'light';
      } catch (_err) {
        return 'light';
      }
    }
    return 'light';
  });

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_rpg_theme', newTheme);
        if (newTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.removeAttribute('data-theme');
          document.documentElement.classList.remove('dark');
        }
      } catch (_err) {}
    }
  }, []);

  // Initialize theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // =========================================================================
  // Sound Engine (Web Audio API Synthesized SFX)
  // =========================================================================
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('life_rpg_sound_enabled');
        return saved !== null ? saved === 'true' : true;
      } catch (_err) {
        return true;
      }
    }
    return true;
  });

  const [soundVolume, setSoundVolumeState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('life_rpg_sound_volume');
        return saved !== null ? Number(saved) : 75;
      } catch (_err) {
        return 75;
      }
    }
    return 75;
  });

  const setSoundEnabled = useCallback((val) => {
    setSoundEnabledState(val);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_rpg_sound_enabled', String(val));
      } catch (_err) {}
    }
  }, []);

  const setSoundVolume = useCallback((val) => {
    setSoundVolumeState(val);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('life_rpg_sound_volume', String(val));
      } catch (_err) {}
    }
  }, []);

  const playSound = useCallback((type) => {
    playSfx(type, { enabled: soundEnabled, volume: soundVolume });
  }, [soundEnabled, soundVolume]);

  // Helper for friendly error messaging
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

  // =========================================================================
  // Initial Scholar Data Loading
  // =========================================================================
  const loadDashboardData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [meRes, questsRes, itemsRes, invRes, roomsRes, spiritRes] = await Promise.all([
        fetch(`${apiUrl}/api/me`, { headers }),
        fetch(`${apiUrl}/api/quests`, { headers }),
        fetch(`${apiUrl}/api/items`),
        fetch(`${apiUrl}/api/inventory`, { headers }),
        fetch(`${apiUrl}/api/rooms`, { headers }),
        fetch(`${apiUrl}/api/spirit`, { headers })
      ]);

      if (!meRes.ok) throw new Error('Could not fetch profile');
      const meData = await meRes.json();

      let questsData = { quests: [] };
      if (questsRes.ok) questsData = await questsRes.json();

      let itemsData = { items: [] };
      if (itemsRes.ok) itemsData = await itemsRes.json();

      let invData = { inventory: [] };
      if (invRes.ok) invData = await invRes.json();

      let roomsData = { rooms: [] };
      if (roomsRes.ok) roomsData = await roomsRes.json();

      let spiritData = null;
      if (spiritRes && spiritRes.ok) spiritData = await spiritRes.json();

      setProfile(meData);
      setQuests(questsData.quests || []);
      setItems(itemsData.items || []);
      setInventory(invData.inventory || meData.inventory || []);

      if (spiritData) {
        setSpirit(spiritData);
      } else if (meData.spirit) {
        setSpirit(meData.spirit);
      }

      const fetchedRooms = roomsData.rooms || [];
      setRooms(fetchedRooms);

      // Default active room
      if (fetchedRooms.length > 0) {
        let savedRoom = null;
        if (typeof window !== 'undefined') {
          try {
            const savedRoomId = localStorage.getItem('life_rpg_active_room_id');
            savedRoom = fetchedRooms.find((r) => r.id === savedRoomId && r.is_unlocked);
          } catch (_err) {}
        }
        const defaultUnlocked = savedRoom || fetchedRooms.find((r) => r.is_unlocked) || fetchedRooms[0];
        setActiveRoom(defaultUnlocked);
      }
    } catch (err) {
      console.error('[Dashboard Load Error]', err);
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [token, addToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleSelectRoom = useCallback((room) => {
    setActiveRoom(room);
    if (typeof window !== 'undefined' && room?.id) {
      try {
        localStorage.setItem('life_rpg_active_room_id', room.id);
      } catch (_err) {}
    }
  }, []);

  // =========================================================================
  // Sequenced Celebration Modal Queues (Level-Up -> Spirit -> Room -> Ach)
  // =========================================================================
  const handleCelebrationClose = useCallback(() => {
    setShowCelebration(false);
    if (spiritEvolutionQueue.length > 0) {
      const [next, ...rest] = spiritEvolutionQueue;
      setCurrentSpiritEvolution(next);
      setSpiritEvolutionQueue(rest);
    } else if (roomUnlockQueue.length > 0) {
      const [next, ...rest] = roomUnlockQueue;
      setCurrentUnlockedRoom(next);
      setRoomUnlockQueue(rest);
    } else if (achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setCurrentAchievement(next);
      setAchievementQueue(rest);
    }
  }, [spiritEvolutionQueue, roomUnlockQueue, achievementQueue]);

  const handleSpiritEvolutionClose = useCallback(() => {
    setCurrentSpiritEvolution(null);
    if (roomUnlockQueue.length > 0) {
      const [next, ...rest] = roomUnlockQueue;
      setCurrentUnlockedRoom(next);
      setRoomUnlockQueue(rest);
    } else if (achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setCurrentAchievement(next);
      setAchievementQueue(rest);
    }
  }, [roomUnlockQueue, achievementQueue]);

  const handleRoomUnlockClose = useCallback(() => {
    setCurrentUnlockedRoom(null);
    if (achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setCurrentAchievement(next);
      setAchievementQueue(rest);
    }
  }, [achievementQueue]);

  const handleAchievementDismiss = useCallback(() => {
    if (achievementQueue.length > 0) {
      const [next, ...rest] = achievementQueue;
      setCurrentAchievement(next);
      setAchievementQueue(rest);
    } else {
      setCurrentAchievement(null);
    }
  }, [achievementQueue]);

  const addAchievementNotifications = useCallback((newAchs) => {
    if (!newAchs || newAchs.length === 0) return;
    setFreshAchievements((prev) => [...prev, ...newAchs]);
    if (!showCelebration && !currentSpiritEvolution && !currentUnlockedRoom && !currentAchievement) {
      const [first, ...rest] = newAchs;
      setCurrentAchievement(first);
      if (rest.length > 0) {
        setAchievementQueue((prev) => [...prev, ...rest]);
      }
    } else {
      setAchievementQueue((prev) => [...prev, ...newAchs]);
    }
  }, [showCelebration, currentSpiritEvolution, currentUnlockedRoom, currentAchievement]);

  // =========================================================================
  // Quest Actions
  // =========================================================================
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
      playSound('click');
      addToast(`Quest "${data.quest.title}" inscribed!`, 'success');
      return true;
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
      return false;
    }
  };

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
      playSound('click');
      addToast('Quest updated successfully.', 'success');
      return true;
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
      return false;
    }
  };

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
      playSound('click');
      addToast('Quest removed from your scroll.', 'info');
      return true;
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
      return false;
    }
  };

  const handleCompleteQuest = async (questId) => {
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

      // Sound feedback
      if (data.leveledUp) {
        playSound('level_up');
      } else {
        playSound('quest_complete');
      }

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

      // Spirit Evolution handling
      if (data.spiritEvolution?.evolved) {
        setSpirit((prev) => ({
          ...prev,
          current_stage: data.spiritEvolution.stageData || {
            stage_number: data.spiritEvolution.newStage,
            name: data.spiritEvolution.stageData?.name
          },
          spirit: {
            ...(prev?.spirit || {}),
            current_stage: data.spiritEvolution.newStage
          }
        }));
        if (data.leveledUp) {
          setSpiritEvolutionQueue((prev) => [...prev, data.spiritEvolution]);
        } else {
          setCurrentSpiritEvolution(data.spiritEvolution);
        }
      }

      // Room Unlocks handling
      if (data.newlyUnlockedRooms && data.newlyUnlockedRooms.length > 0) {
        setRooms((prev) =>
          prev.map((r) => {
            const matched = data.newlyUnlockedRooms.find((nr) => nr.id === r.id);
            return matched ? { ...r, is_unlocked: true, levels_remaining: 0 } : r;
          })
        );
        if (data.leveledUp || data.spiritEvolution?.evolved) {
          setRoomUnlockQueue((prev) => [...prev, ...data.newlyUnlockedRooms]);
        } else {
          const [firstRoom, ...restRooms] = data.newlyUnlockedRooms;
          setCurrentUnlockedRoom(firstRoom);
          setRoomUnlockQueue(restRooms);
        }
      }

      // Achievements handling
      if (data.newAchievements && data.newAchievements.length > 0) {
        addAchievementNotifications(data.newAchievements);
      }
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setCompletingId(null);
    }
  };

  // =========================================================================
  // Shop Purchase Action
  // =========================================================================
  const handlePurchaseItem = async (item) => {
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

      setProfile((prev) => ({
        ...prev,
        character: data.character
      }));
      setInventory((prev) => [...prev, data.inventory]);

      playSound('purchase');
      addToast(`Adopted "${item.name}"! Coins remaining: ${data.character.cozy_coins}`, 'success');

      if (data.newAchievements && data.newAchievements.length > 0) {
        addAchievementNotifications(data.newAchievements);
      }
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  // =========================================================================
  // Equip / Unequip Item Action
  // =========================================================================
  const handleToggleEquip = async (inventoryId, targetRoomId, targetEquippedOverride) => {
    const itemToToggle = inventory.find((inv) => inv.id === inventoryId);
    if (!itemToToggle || equippingId) return;

    setEquippingId(inventoryId);
    const newEquipped = targetEquippedOverride !== undefined ? targetEquippedOverride : !itemToToggle.equipped;
    const isCompanion = itemToToggle.item?.category === 'companion';
    const resolvedRoomId = isCompanion ? null : targetRoomId || activeRoom?.id || null;

    const previousInventory = [...inventory];

    setInventory((prev) =>
      prev.map((inv) => {
        if (isCompanion && newEquipped && inv.item?.category === 'companion' && inv.id !== inventoryId) {
          return { ...inv, equipped: false, room_id: null };
        }
        if (inv.id === inventoryId) {
          return {
            ...inv,
            equipped: newEquipped,
            room_id: newEquipped ? resolvedRoomId : null
          };
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
        body: JSON.stringify({
          equipped: newEquipped,
          room_id: resolvedRoomId
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update item placement');

      setInventory((prev) =>
        prev.map((inv) => {
          if (isCompanion && newEquipped && inv.item?.category === 'companion' && inv.id !== inventoryId) {
            return { ...inv, equipped: false, room_id: null };
          }
          if (inv.id === inventoryId) {
            return data.inventory;
          }
          return inv;
        })
      );

      playSound('click');
      const actionName = newEquipped ? 'Placed' : 'Stored';
      const chamberText = isCompanion
        ? 'across your study haven'
        : `in ${activeRoom?.name || 'chamber'}`;
      addToast(`${actionName} "${itemToToggle.item?.name}" ${chamberText}!`, 'success');
    } catch (err) {
      setInventory(previousInventory);
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setEquippingId(null);
    }
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

  const equippedBadges = inventory.filter((inv) => inv.equipped && inv.item?.category === 'badge');

  return (
    <ScholarContext.Provider
      value={{
        user,
        token,
        signOut,
        profile,
        character: char,
        streak,
        equippedBadges,
        quests,
        items,
        inventory,
        rooms,
        activeRoom,
        spirit,
        loading,
        completingId,
        purchasingId,
        equippingId,
        // Actions
        handleSelectRoom,
        handleCreateQuest,
        handleCompleteQuest,
        handleEditQuest,
        handleDeleteQuest,
        handlePurchaseItem,
        handleToggleEquip,
        refreshData: loadDashboardData,
        // Celebrations
        celebrationData,
        showCelebration,
        handleCelebrationClose,
        spiritEvolutionQueue,
        currentSpiritEvolution,
        handleSpiritEvolutionClose,
        roomUnlockQueue,
        currentUnlockedRoom,
        handleRoomUnlockClose,
        achievementQueue,
        currentAchievement,
        handleAchievementDismiss,
        freshAchievements,
        activeTriggerRef,
        // Toasts
        toasts,
        addToast,
        removeToast,
        // Theme & Audio
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        soundVolume,
        setSoundVolume,
        playSound
      }}
    >
      {children}
    </ScholarContext.Provider>
  );
}

export function useScholar() {
  const context = useContext(ScholarContext);
  if (!context) {
    throw new Error('useScholar must be used within a ScholarProvider');
  }
  return context;
}
