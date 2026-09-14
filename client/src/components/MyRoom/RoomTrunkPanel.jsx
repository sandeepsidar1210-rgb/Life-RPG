import React, { useState, useMemo } from 'react';

const ITEM_ICONS = {
  'Warm Desk Lamp': '💡',
  'Ceremonial Matcha Bowl': '🍵',
  'Lo-Fi Cassette Player': '📼',
  'Potted Succulent': '🪴',
  'Zen Bonsai Tree': '🌳',
  'Oak Bookshelf': '📚',
  'Sleepy Calico Cat': '🐱',
  'Wise Study Owl': '🦉',
  'Loyal Shiba Inu': '🐕',
  'Grandfather Clock': '🕰️',
  'Velvet Reading Armchair': '🛋️',
  'Vintage Brass Astrolabe': '🧭',
  'Monstera Deliciosa': '🌿',
  'Starlight Candle Trio': '🕯️',
  'Cozy Floor Pouf': '🧶',
  'Antique Gramophone': '🎺',
  'Terracotta Herb Planter': '🌱',
  'Woven Persian Rug': '🧶',
  'Dawn Scholar Badge': '🌅',
  'Midnight Oil Badge': '🌙',
  'Master Archivist Badge': '📜',
  'Celestial Horizon Badge': '✨'
};

export function RoomTrunkPanel({
  inventory = [],
  rooms = [],
  activeRoom,
  onToggleEquip,
  equippingId,
  isSimulatingFailure,
  onToggleSimulateFailure,
  placingItemId = null,
  onStartPlacement = () => {},
  onCancelPlacement = () => {}
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

  const roomName = activeRoom?.name || 'Study Desk';
  const activeRoomId = activeRoom?.id;

  // Placed count in this chamber
  const placedCount = useMemo(() => {
    return inventory.filter(
      (inv) => inv.equipped && (inv.room_id === activeRoomId || inv.item?.category === 'companion')
    ).length;
  }, [inventory, activeRoomId]);

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
            Active Chamber: <strong className="text-cozy-brown-dark">{roomName}</strong> • {placedCount} furnishings placed
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

      {/* Category Tabs */}
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

      {/* Free Placement Active Banner (When in placement mode) */}
      {placingItemId && (
        <div className="p-3 bg-amber-100/90 dark:bg-amber-950/40 border-2 border-amber-600/70 rounded-pixel flex items-center justify-between gap-2 text-xs font-pixel text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2 truncate">
            <span className="animate-bounce">🎯</span>
            <span className="truncate">Placement Mode: Click floor in 3D room to place item</span>
          </div>
          <button
            type="button"
            onClick={onCancelPlacement}
            className="touch-target px-2 py-1 bg-white/80 dark:bg-stone-800 text-cozy-brown-dark text-[11px] rounded border border-cozy-border font-bold hover:bg-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Items List */}
      <div 
        role="region"
        aria-label="Trunk items"
        className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1"
      >
        {filteredItems.length === 0 ? (
          <div className="text-center py-6 text-xs text-cozy-brown-medium italic bg-cozy-parchment/60 rounded-pixel border border-dashed border-cozy-border">
            No items in this category yet. Visit the Study Emporium to find more!
          </div>
        ) : (
          filteredItems.map((inv) => {
            const item = inv.item;
            const isEquipped = Boolean(inv.equipped);
            const isEquipping = equippingId === inv.id;
            const isCompanion = item?.category === 'companion';
            const isBadge = item?.category === 'badge';
            const isCurrentlyPlacing = placingItemId === inv.id;

            // Room-scoped states
            const defaultRoomId = (rooms || []).find((r) => r.display_order === 1)?.id || rooms[0]?.id;
            const itemRoomId = inv.room_id || defaultRoomId;
            const isEquippedInThisRoom = isEquipped && itemRoomId === activeRoomId;
            const isEquippedInOtherRoom = isEquipped && itemRoomId !== activeRoomId;
            const otherRoomName = inv.room?.name || (rooms || []).find((r) => r.id === itemRoomId)?.name || 'another chamber';

            let actionText = 'Place';
            let buttonStyle = 'bg-cozy-sage hover:bg-cozy-sage-dark text-white border-cozy-sage-dark shadow-pixel-sm';

            if (isCurrentlyPlacing) {
              actionText = 'Placing...';
              buttonStyle = 'bg-amber-500 text-white border-amber-600 animate-pulse';
            } else if (isCompanion) {
              actionText = isEquipped ? 'Rest' : 'Summon';
              if (isEquipped) {
                buttonStyle = 'bg-cozy-terracotta-subtle hover:bg-cozy-terracotta text-cozy-terracotta-dark hover:text-white border-cozy-terracotta-dark';
              }
            } else if (isBadge) {
              actionText = isEquipped ? 'Hide' : 'Display';
              if (isEquipped) {
                buttonStyle = 'bg-cozy-terracotta-subtle hover:bg-cozy-terracotta text-cozy-terracotta-dark hover:text-white border-cozy-terracotta-dark';
              }
            } else {
              // Decor item
              if (isEquippedInThisRoom) {
                actionText = 'Recall';
                buttonStyle = 'bg-cozy-terracotta-subtle hover:bg-cozy-terracotta text-cozy-terracotta-dark hover:text-white border-cozy-terracotta-dark';
              } else if (isEquippedInOtherRoom) {
                actionText = 'Move Here';
                buttonStyle = 'bg-cozy-parchment hover:bg-cozy-sage text-cozy-brown-dark hover:text-white border-cozy-sage-dark';
              } else {
                actionText = 'Place';
                buttonStyle = 'bg-cozy-sage hover:bg-cozy-sage-dark text-white border-cozy-sage-dark shadow-pixel-sm';
              }
            }

            const handleItemClick = () => {
              if (isCurrentlyPlacing) {
                onCancelPlacement();
                return;
              }

              if (isCompanion || isBadge) {
                onToggleEquip(inv.id, activeRoomId, !isEquipped);
              } else {
                if (isEquippedInThisRoom) {
                  // Recall decor item back into trunk
                  onToggleEquip(inv.id, activeRoomId, false);
                } else {
                  // Enter interactive free click-to-place mode!
                  onStartPlacement(inv);
                }
              }
            };

            return (
              <div
                key={inv.id}
                className={`p-3 rounded-pixel border-2 transition flex items-center justify-between gap-3 ${
                  isCurrentlyPlacing
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                    : isEquippedInThisRoom || (isCompanion && isEquipped)
                    ? 'bg-cozy-parchment/90 border-cozy-sage-dark shadow-pixel-sm'
                    : isEquippedInOtherRoom
                    ? 'bg-cozy-parchment/70 border-cozy-border hover:border-cozy-brown-light'
                    : 'bg-cozy-parchment/40 border-cozy-border hover:border-cozy-brown-light'
                }`}
              >
                {/* Item Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-11 h-11 rounded-pixel flex items-center justify-center text-xl flex-shrink-0 border-2 ${
                      isEquippedInThisRoom || (isCompanion && isEquipped)
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
                      {isEquippedInThisRoom && (
                        <span className="px-1.5 py-0.2 bg-cozy-sage text-white text-[9px] font-pixel rounded uppercase font-bold flex-shrink-0">
                          Placed
                        </span>
                      )}
                      {isEquippedInOtherRoom && (
                        <span className="px-1.5 py-0.2 bg-cozy-brown-light/40 text-cozy-brown-dark text-[9px] font-pixel rounded uppercase font-bold flex-shrink-0" title={`Currently in ${otherRoomName}`}>
                          In {otherRoomName}
                        </span>
                      )}
                      {isCompanion && isEquipped && (
                        <span className="px-1.5 py-0.2 bg-cozy-sage text-white text-[9px] font-pixel rounded uppercase font-bold flex-shrink-0">
                          Summoned
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-cozy-brown-medium truncate">
                      {item?.description}
                    </p>
                    <p className="text-[10px] text-cozy-sage-dark font-pixel mt-0.5">
                      {isEquippedInThisRoom
                        ? (inv.position_x !== null && inv.position_x !== undefined
                            ? `📍 Placed (${inv.position_x.toFixed(1)}, ${inv.position_z?.toFixed(1)}) • Drag in 3D to move`
                            : '📍 Placed in chamber • Drag in 3D to move')
                        : isCurrentlyPlacing
                        ? '🎯 Click floor in 3D room to place'
                        : isCompanion
                        ? '🐾 Companion joins all chambers'
                        : isBadge
                        ? '🎖️ Display on Scholar Profile'
                        : '✨ Click Place, then click anywhere on floor'}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={handleItemClick}
                  disabled={isEquipping}
                  aria-label={`${actionText} ${item?.name}`}
                  className={`touch-target pixel-box px-3.5 py-2 rounded text-xs font-pixel font-bold transition flex-shrink-0 disabled:opacity-50 border-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cozy-brown-dark ${buttonStyle}`}
                >
                  {isEquipping ? (
                    <span className="inline-block animate-spin" aria-label="Processing equipment change">⏳</span>
                  ) : (
                    actionText
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
          <strong>Free Placement</strong>: Click <em>Place</em> on any decor item, then click anywhere on the room floor. You can click &amp; drag placed decor in 3D anytime to reposition it!
        </span>
      </div>
    </section>
  );
}

export default RoomTrunkPanel;
