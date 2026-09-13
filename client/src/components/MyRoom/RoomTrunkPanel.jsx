import React, { useState } from 'react';

const ITEM_ICONS = {
  'Warm Desk Lamp': '💡',
  'Ceremonial Matcha Bowl': '🍵',
  'Lo-Fi Cassette Player': '📼',
  'Potted Succulent': '🪴',
  'Zen Bonsai Tree': '🌳',
  'Oak Bookshelf': '📚',
  'Sleepy Calico Cat': '🐱',
  'Wise Study Owl': '🦉',
  'Dawn Scholar Badge': '🌅',
  'Midnight Oil Badge': '🌙'
};

const ITEM_HINTS = {
  'Warm Desk Lamp': 'Desk (Amber Point Light)',
  'Ceremonial Matcha Bowl': 'Desk (Steaming Matcha)',
  'Lo-Fi Cassette Player': 'Desk (Spinning Tape Reels)',
  'Potted Succulent': 'Window Sill (Jade Succulent)',
  'Zen Bonsai Tree': 'Display Pedestal (Foliage)',
  'Oak Bookshelf': 'Back Wall (Books & Crystal)',
  'Sleepy Calico Cat': 'Center Rug (Breathing Idle)',
  'Wise Study Owl': 'Rustic Perch (Inquisitive Head)',
  'Dawn Scholar Badge': 'Scholar Profile / Header HUD',
  'Midnight Oil Badge': 'Scholar Profile / Header HUD'
};

export function RoomTrunkPanel({
  inventory = [],
  onToggleEquip,
  equippingId,
  isSimulatingFailure,
  onToggleSimulateFailure
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'decor', label: 'Decor' },
    { id: 'companion', label: 'Companions' },
    { id: 'badge', label: 'Badges' }
  ];

  const filteredItems = inventory.filter((inv) => {
    if (activeCategory === 'all') return true;
    return inv.item?.category === activeCategory;
  });

  return (
    <div className="pixel-box bg-cozy-card p-4 sm:p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cozy-border pb-3">
        <div>
          <h3 className="font-pixel text-base sm:text-lg text-cozy-brown-dark flex items-center gap-2">
            <span aria-hidden="true">🧳</span> Scholar's Trunk
          </h3>
          <p className="text-xs text-cozy-brown-medium">
            Toggle items to animate them into your 3D study sanctuary
          </p>
        </div>

        {/* WebGL Fallback Simulation Button for Testing */}
        <button
          type="button"
          onClick={onToggleSimulateFailure}
          className="text-[10px] font-pixel px-2 py-1 bg-cozy-parchment hover:bg-cozy-terracotta-subtle text-cozy-brown-dark rounded border border-cozy-border transition"
          title="Simulate WebGL Crash to test fallback list view"
        >
          {isSimulatingFailure ? '⚡ Restore 3D' : '🧪 Test Fallback'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`touch-target px-3 py-1.5 text-xs font-pixel rounded transition whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-cozy-brown-dark text-white font-bold shadow-pixel-sm'
                : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {filteredItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-cozy-brown-medium italic bg-cozy-parchment/60 rounded-pixel border border-dashed border-cozy-border">
            No items in this category yet.
          </div>
        ) : (
          filteredItems.map((inv) => {
            const item = inv.item;
            const isEquipped = inv.equipped;
            const isEquipping = equippingId === inv.id;
            const isCompanion = item?.category === 'companion';
            const isBadge = item?.category === 'badge';

            return (
              <div
                key={inv.id}
                className={`p-3 rounded-pixel border-2 transition flex items-center justify-between gap-3 ${
                  isEquipped
                    ? 'bg-cozy-parchment/90 border-cozy-sage-dark shadow-pixel-sm'
                    : 'bg-cozy-parchment/40 border-cozy-border hover:border-cozy-brown-light'
                }`}
              >
                {/* Item Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-pixel flex items-center justify-center text-xl flex-shrink-0 border ${
                      isEquipped
                        ? 'bg-cozy-sage-subtle border-cozy-sage-light'
                        : 'bg-cozy-card border-cozy-border'
                    }`}
                    aria-hidden="true"
                  >
                    {ITEM_ICONS[item?.name] || item?.icon || '📦'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-pixel text-xs font-bold text-cozy-brown-dark truncate">
                        {item?.name}
                      </span>
                      {isEquipped && (
                        <span className="px-1.5 py-0.2 bg-cozy-sage text-white text-[9px] font-pixel rounded uppercase font-bold flex-shrink-0">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-cozy-brown-medium truncate">
                      {item?.description}
                    </p>
                    <p className="text-[10px] text-cozy-sage-dark font-pixel mt-0.5">
                      📍 {ITEM_HINTS[item?.name] || (isBadge ? 'Profile Header' : 'Study Room')}
                    </p>
                  </div>
                </div>

                {/* Equip / Unequip Toggle Button */}
                <button
                  type="button"
                  onClick={() => onToggleEquip(inv.id, isEquipped)}
                  disabled={isEquipping}
                  aria-label={`${isEquipped ? 'Unequip' : 'Equip'} ${item?.name}`}
                  className={`touch-target pixel-box px-3 py-1.5 rounded text-xs font-pixel font-bold transition flex-shrink-0 disabled:opacity-50 ${
                    isEquipped
                      ? 'bg-cozy-terracotta-subtle hover:bg-cozy-terracotta text-cozy-terracotta-dark hover:text-white border border-cozy-terracotta'
                      : 'bg-cozy-sage hover:bg-cozy-sage-dark text-white border border-cozy-sage-dark'
                  }`}
                >
                  {isEquipping ? (
                    <span className="inline-block animate-spin">⏳</span>
                  ) : isEquipped ? (
                    'Unequip'
                  ) : isCompanion ? (
                    'Summon'
                  ) : (
                    'Place'
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Helper Footer */}
      <div className="text-[11px] text-cozy-brown-medium bg-cozy-parchment/60 p-2.5 rounded-pixel border border-cozy-border flex items-start gap-2">
        <span className="text-sm select-none" aria-hidden="true">💡</span>
        <span>
          <strong>Decor</strong> coexists in the 3D room. <strong>Companions</strong> are exclusive (equipping one summons it and rests the other). <strong>Badges</strong> display in your header HUD!
        </span>
      </div>
    </div>
  );
}
