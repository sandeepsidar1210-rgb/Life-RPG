import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ATTRIBUTE_OPTIONS = [
  { id: 'focus', name: 'Focus', icon: '🎯', color: 'bg-cozy-stats-focus', text: 'Deep work & study' },
  { id: 'discipline', name: 'Discipline', icon: '⏳', color: 'bg-cozy-stats-discipline', text: 'Daily habits & routines' },
  { id: 'vitality', name: 'Vitality', icon: '🌿', color: 'bg-cozy-stats-vitality', text: 'Health & movement' },
  { id: 'creativity', name: 'Creativity', icon: '🎨', color: 'bg-cozy-stats-creativity', text: 'Writing, arts & coding' },
];

export function QuestList({ quests, onComplete, onCreate, onEdit, onDelete, completingId }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attributeType, setAttributeType] = useState('focus');
  const [focusPoints, setFocusPoints] = useState(30);
  const [cozyCoins, setCozyCoins] = useState(15);
  const [titleError, setTitleError] = useState('');

  // Editing state
  const [editingQuest, setEditingQuest] = useState(null);

  // Completed toggle state
  const [showCompleted, setShowCompleted] = useState(false);

  const activeQuests = quests.filter(q => q.status === 'active');
  const completedQuests = quests.filter(q => q.status === 'completed');

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!title || !title.trim()) {
      setTitleError('Quest title cannot be empty or just spaces.');
      return;
    }
    if (title.trim().length < 2) {
      setTitleError('Quest title must be at least 2 characters.');
      return;
    }

    setTitleError('');
    await onCreate({
      title: title.trim(),
      description: description.trim() || null,
      attribute_type: attributeType,
      focus_points_reward: Number(focusPoints) || 25,
      cozy_coins_reward: Number(cozyCoins) || 10,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setFocusPoints(30);
    setCozyCoins(15);
    setShowCreateForm(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingQuest.title || !editingQuest.title.trim()) {
      return;
    }

    await onEdit(editingQuest.id, {
      title: editingQuest.title.trim(),
      description: editingQuest.description ? editingQuest.description.trim() : null,
      attribute_type: editingQuest.attribute_type,
      focus_points_reward: editingQuest.focus_points_reward,
      cozy_coins_reward: editingQuest.cozy_coins_reward,
    });

    setEditingQuest(null);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Quest Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-pixel text-cozy-brown-dark flex items-center gap-2">
            <span>📜</span> Study Quests ({activeQuests.length} Active)
          </h2>
          <p className="text-xs text-cozy-brown-medium">
            Complete real-world tasks to level up your character stats
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setTitleError('');
          }}
          className="pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs sm:text-sm px-3.5 py-2 rounded-pixel font-bold flex items-center gap-1.5 shadow-pixel-sm transition"
        >
          <span>{showCreateForm ? '✕ Close' : '➕ New Quest'}</span>
        </button>
      </div>

      {/* Quest Creation Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreateSubmit}
            className="pixel-box bg-cozy-card p-5 rounded-pixel shadow-pixel border-2 border-cozy-brown-dark space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between border-b border-cozy-border pb-2">
              <h3 className="font-pixel text-base text-cozy-brown-dark flex items-center gap-1.5">
                <span>✍️</span> Inscribe a New Quest
              </h3>
              <span className="text-[11px] font-pixel text-cozy-brown-medium">
                Rewards are calculated automatically
              </span>
            </div>

            {/* Title Input */}
            <div>
              <label className="block font-pixel text-xs text-cozy-brown-dark mb-1">
                Quest Title <span className="text-cozy-terracotta-dark">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Complete Chapter 4 Study Notes, Drink 2L water, 30m Workout..."
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (titleError) setTitleError('');
                }}
                className={`w-full bg-cozy-parchment/50 border-2 rounded-pixel px-3 py-2 text-sm text-cozy-brown-dark focus:outline-none transition ${
                  titleError
                    ? 'border-cozy-terracotta-dark focus:ring-2 focus:ring-cozy-terracotta/40'
                    : 'border-cozy-brown-dark/70 focus:border-cozy-sage-dark focus:ring-2 focus:ring-cozy-sage/40'
                }`}
              />
              {titleError && (
                <p className="text-xs text-cozy-terracotta-dark font-medium mt-1 flex items-center gap-1">
                  <span>⚠️</span> {titleError}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-pixel text-xs text-cozy-brown-dark mb-1">
                Optional Notes &amp; Objectives
              </label>
              <textarea
                rows={2}
                placeholder="Add subtasks or notes for this quest..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-cozy-parchment/50 border-2 border-cozy-brown-dark/70 rounded-pixel px-3 py-2 text-sm text-cozy-brown-dark focus:outline-none focus:border-cozy-sage-dark focus:ring-2 focus:ring-cozy-sage/40 transition"
              />
            </div>

            {/* Attribute Selector */}
            <div>
              <label className="block font-pixel text-xs text-cozy-brown-dark mb-1.5">
                Target Attribute to Level Up
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ATTRIBUTE_OPTIONS.map((attr) => (
                  <button
                    key={attr.id}
                    type="button"
                    onClick={() => setAttributeType(attr.id)}
                    className={`pixel-box p-2.5 rounded-pixel text-left transition flex items-center gap-2 ${
                      attributeType === attr.id
                        ? 'bg-cozy-parchment border-2 border-cozy-brown-dark shadow-pixel-sm font-bold'
                        : 'bg-cozy-card opacity-70 hover:opacity-100 border border-cozy-border'
                    }`}
                  >
                    <span className="text-lg">{attr.icon}</span>
                    <div>
                      <div className="font-pixel text-xs text-cozy-brown-dark">{attr.name}</div>
                      <div className="text-[10px] text-cozy-brown-medium">{attr.text}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reward Sliders/Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="pixel-box bg-cozy-parchment/60 p-3 rounded-pixel">
                <div className="flex justify-between items-center text-xs mb-1 font-pixel">
                  <span className="text-cozy-sage-dark font-bold flex items-center gap-1">
                    <span>✨</span> Focus Points (XP)
                  </span>
                  <span className="text-sm font-bold text-cozy-brown-dark">+{focusPoints} FP</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={focusPoints}
                  onChange={(e) => setFocusPoints(Number(e.target.value))}
                  className="w-full accent-cozy-sage cursor-pointer"
                />
              </div>

              <div className="pixel-box bg-cozy-parchment/60 p-3 rounded-pixel">
                <div className="flex justify-between items-center text-xs mb-1 font-pixel">
                  <span className="text-cozy-gold-dark font-bold flex items-center gap-1">
                    <span>🪙</span> Cozy Coins
                  </span>
                  <span className="text-sm font-bold text-cozy-brown-dark">+{cozyCoins} Coins</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={cozyCoins}
                  onChange={(e) => setCozyCoins(Number(e.target.value))}
                  className="w-full accent-cozy-gold-base cursor-pointer"
                />
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-cozy-border">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 font-pixel text-xs text-cozy-brown-medium hover:text-cozy-brown-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="pixel-box-interactive bg-cozy-sage text-white font-pixel text-xs sm:text-sm px-4 py-2 rounded-pixel font-bold shadow-pixel-sm"
              >
                📜 Create Quest
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Active Quests List */}
      <div className="space-y-3">
        {activeQuests.length === 0 ? (
          <div className="pixel-box bg-cozy-card p-8 rounded-pixel text-center space-y-2 border-dashed border-2 border-cozy-brown-light/40">
            <span className="text-3xl select-none">🪶</span>
            <h3 className="font-pixel text-base text-cozy-brown-dark">No active quests right now</h3>
            <p className="text-xs text-cozy-brown-medium max-w-sm mx-auto">
              Your study scroll is clear! Inscribe a task above to gain Focus Points, level up your stats, and earn Cozy Coins.
            </p>
          </div>
        ) : (
          activeQuests.map((quest) => {
            const attr = ATTRIBUTE_OPTIONS.find(a => a.id === quest.attribute_type) || ATTRIBUTE_OPTIONS[0];
            const isCompleting = completingId === quest.id;

            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="pixel-box bg-cozy-card p-4 sm:p-5 rounded-pixel shadow-pixel-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-cozy-brown-dark hover:border-cozy-brown-dark transition"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-pixel font-bold bg-cozy-parchment text-cozy-brown-dark border border-cozy-border flex items-center gap-1">
                      <span>{attr.icon}</span> {attr.name}
                    </span>
                    <h3 className="font-medium text-sm sm:text-base text-cozy-brown-dark">
                      {quest.title}
                    </h3>
                  </div>

                  {quest.description && (
                    <p className="text-xs text-cozy-brown-medium leading-relaxed pl-1">
                      {quest.description}
                    </p>
                  )}

                  {/* Rewards preview */}
                  <div className="flex items-center gap-3 text-[11px] font-pixel text-cozy-brown-medium pl-1">
                    <span className="text-cozy-sage-dark font-bold">+{quest.focus_points_reward} FP</span>
                    <span>•</span>
                    <span className="text-cozy-gold-dark font-bold">+{quest.cozy_coins_reward} Coins</span>
                    <span>•</span>
                    <span>+1 {attr.name}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setEditingQuest(quest)}
                    className="pixel-box bg-cozy-parchment hover:bg-cozy-brown-subtle text-cozy-brown-dark px-2.5 py-1.5 rounded-pixel font-pixel text-xs transition"
                    title="Edit quest"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(quest.id)}
                    className="pixel-box bg-cozy-card hover:bg-cozy-terracotta-subtle text-cozy-brown-medium hover:text-cozy-terracotta-dark px-2 py-1.5 rounded-pixel text-xs transition"
                    title="Delete quest"
                  >
                    🗑️
                  </button>
                  <button
                    disabled={isCompleting}
                    onClick={() => onComplete(quest.id)}
                    className="pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-xs sm:text-sm px-4 py-2 rounded-pixel font-bold shadow-pixel-sm transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isCompleting ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <span>✓ Complete</span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Completed Quests Section (Collapsible) */}
      {completedQuests.length > 0 && (
        <div className="border-t-2 border-cozy-border pt-4">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center justify-between w-full font-pixel text-sm text-cozy-brown-medium hover:text-cozy-brown-dark transition py-1"
          >
            <span className="flex items-center gap-2">
              <span>📜</span> Completed Quests ({completedQuests.length})
            </span>
            <span>{showCompleted ? '▲ Hide' : '▼ View'}</span>
          </button>

          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {completedQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="pixel-box bg-cozy-parchment/40 p-3 rounded-pixel flex items-center justify-between opacity-75 border-cozy-border"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-cozy-sage-dark text-sm">✓</span>
                      <div>
                        <p className="text-xs text-cozy-brown-dark line-through font-medium">
                          {quest.title}
                        </p>
                        <p className="text-[10px] text-cozy-brown-medium">
                          Completed {new Date(quest.completed_at).toLocaleDateString()} • +{quest.focus_points_reward} FP • +{quest.cozy_coins_reward} Coins
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-pixel bg-cozy-sage-subtle text-cozy-sage-dark px-2 py-0.5 rounded border border-cozy-sage-light">
                      Earned
                    </span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Quest Modal */}
      {editingQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.form
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onSubmit={handleEditSubmit}
            className="w-full max-w-md pixel-box bg-cozy-card p-6 rounded-pixel shadow-pixel-lg border-2 border-cozy-brown-dark space-y-4"
          >
            <h3 className="font-pixel text-lg text-cozy-brown-dark flex items-center gap-2">
              <span>✏️</span> Edit Quest
            </h3>
            <div>
              <label className="block font-pixel text-xs text-cozy-brown-dark mb-1">Quest Title</label>
              <input
                type="text"
                required
                value={editingQuest.title}
                onChange={(e) => setEditingQuest({ ...editingQuest, title: e.target.value })}
                className="w-full bg-cozy-parchment/50 border-2 border-cozy-brown-dark/70 rounded-pixel px-3 py-2 text-sm text-cozy-brown-dark"
              />
            </div>
            <div>
              <label className="block font-pixel text-xs text-cozy-brown-dark mb-1">Notes</label>
              <textarea
                rows={2}
                value={editingQuest.description || ''}
                onChange={(e) => setEditingQuest({ ...editingQuest, description: e.target.value })}
                className="w-full bg-cozy-parchment/50 border-2 border-cozy-brown-dark/70 rounded-pixel px-3 py-2 text-sm text-cozy-brown-dark"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-cozy-border">
              <button
                type="button"
                onClick={() => setEditingQuest(null)}
                className="px-4 py-2 font-pixel text-xs text-cozy-brown-medium hover:text-cozy-brown-dark"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="pixel-box-interactive bg-cozy-sage text-white font-pixel text-xs px-4 py-2 rounded-pixel font-bold"
              >
                Save Changes
              </button>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}
