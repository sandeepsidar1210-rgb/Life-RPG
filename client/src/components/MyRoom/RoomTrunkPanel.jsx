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
    <section 
      aria-labelledby="trunk-heading"
      className="pixel-box bg-cozy-card p-4 sm:p-5 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cozy-border pb-3">
        <div>
          <h3 id="trunk-heading" className="font-pixel text-base sm:text-lg text-cozy-brown-dark flex items-center gap-2">
            <span aria-hidden="true">🧳</span> Scholar's Trunk
          </h3>
          <p className="text-xs text-cozy-brown-medium">
            Toggle items to animate them into your 3D study sanctuary
          </p>
        </div>

        {/* WebGL Fallback Simulation Button with explicit ARIA label */}
        <button
          type="button"
          onClick={onToggleSimulateFailure}
          aria-label={isSimulatingFailure ? 'Restore 3D study room view' : 'Simulate WebGL failure to test fallback list view'}
          className="touch-target text-xs font-pixel px-3 py-1.5 bg-cozy-parchment hover:bg-cozy-terracotta-subtle text-cozy-brown-dark rounded border-2 border-cozy-brown-dark shadow-pixel-sm transition active:scale-95 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
          title="Simulate WebGL Crash to test fallback list view"
        >
          {isSimulatingFailure ? '⚡ Restore 3D' : '🧪 Test Fallback'}
        </button>
      </div>

      {/* Category Tabs with ARIA and full keyboard support */}
      <div 
        role="tablist" 
        aria-label="Trunk item categories"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isSelected}
              aria-label={`Show ${cat.label}`}
              onClick={() => setActiveCategory(cat.id)}
              className={`touch-target px-3.5 py-2 text-xs font-pixel rounded transition whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
                isSelected
                  ? 'bg-cozy-brown-dark text-white font-bold shadow-pixel-sm'
                  : 'bg-cozy-parchment text-cozy-brown-medium hover:text-cozy-brown-dark border border-cozy-border'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <div 
        role="region"
        aria-label="Trunk items"
        className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1"
      >
        {filteredItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-cozy-brown-medium italic bg-cozy-parchment/60 rounded-pixel border border-dashed border-cozy-border">
            No items in this category yet. Visit the Study Emporium to find more!
          </div>
        ) : (
          filteredItems.map((inv) => {
            const item = inv.item;
            const isEquipped = inv.equipped;
            const isEquipping = equippingId === inv.id;
            const isCompanion = item?.category === 'companion';
            const isBadge = item?.category === 'badge';

            const actionLabel = isEquipped
              ? `Unequip ${item?.name}`
              : isCompanion
              ? `Summon ${item?.name} into 3D study room`
              : isBadge
              ? `Display ${item?.name} in header HUD`
              : `Place ${item?.name} into 3D study room`;

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
                    className={`w-11 h-11 rounded-pixel flex items-center justify-center text-xl flex-shrink-0 border-2 ${
                      isEquipped
                        ? 'bg-cozy-sage-subtle border-cozy-sage-dark'
                        : 'bg-cozy-card border-cozy-border'
                    }`}
                    aria-hidden="true"
                  >
                    {ITEM_ICONS[item?.name] || item?.icon || '📦'}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-pixel text-xs sm:text-sm font-bold text-cozy-brown-dark truncate">
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

                {/* Equip / Unequip Toggle Button with minimum 44px touch target */}
                <button
                  type="button"
                  onClick={() => onToggleEquip(inv.id, isEquipped)}
                  disabled={isEquipping}
                  aria-label={actionLabel}
                  className={`touch-target pixel-box px-3.5 py-2 rounded text-xs font-pixel font-bold transition flex-shrink-0 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cozy-brown-dark ${
                    isEquipped
                      ? 'bg-cozy-terracotta-subtle hover:bg-cozy-terracotta text-cozy-terracotta-dark hover:text-white border-2 border-cozy-terracotta-dark'
                      : 'bg-cozy-sage hover:bg-cozy-sage-dark text-white border-2 border-cozy-sage-dark shadow-pixel-sm'
                  }`}
                >
                  {isEquipping ? (
                    <span className="inline-block animate-spin" aria-label="Processing equipment change">⏳</span>
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
    </section>
  );
}
