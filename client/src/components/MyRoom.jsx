import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ITEM_RENDER_INFO = {
  'Warm Desk Lamp': {
    icon: '💡',
    position: 'desk-left',
    glow: true,
    label: 'Warm Amber Desk Lamp'
  },
  'Ceremonial Matcha Bowl': {
    icon: '🍵',
    position: 'desk-center',
    steaming: true,
    label: 'Steaming Ceremonial Matcha'
  },
  'Lo-Fi Cassette Player': {
    icon: '📼',
    position: 'desk-right',
    musical: true,
    label: 'Lo-Fi Study Beats Player'
  },
  'Potted Succulent': {
    icon: '🪴',
    position: 'window-sill',
    label: 'Sunlit Desk Succulent'
  },
  'Zen Bonsai Tree': {
    icon: '🌳',
    position: 'floor-pedestal',
    label: 'Zen Bonsai Tree'
  },
  'Oak Bookshelf': {
    icon: '📚',
    position: 'wall-shelf',
    label: 'Oak Wall Bookshelf'
  },
  'Sleepy Calico Cat': {
    icon: '🐱',
    position: 'companion-rug',
    companion: true,
    animation: 'breathing',
    label: 'Sleepy Calico Cat'
  },
  'Wise Study Owl': {
    icon: '🦉',
    position: 'companion-perch',
    companion: true,
    animation: 'bobbing',
    label: 'Wise Study Owl'
  },
  'Dawn Scholar Badge': {
    icon: '🌅',
    category: 'badge',
    label: 'Dawn Scholar Badge'
  },
  'Midnight Oil Badge': {
    icon: '🌙',
    category: 'badge',
    label: 'Midnight Oil Badge'
  }
};

export function MyRoom({ inventory, onToggleEquip, equippingId, onNavigateToShop }) {
  const ownedItems = inventory || [];
  const equippedItems = ownedItems.filter((item) => item.equipped);
  const equippedDecor = equippedItems.filter((item) => item.item?.category === 'decor');
  const equippedCompanion = equippedItems.find((item) => item.item?.category === 'companion');

  // Check which decor items are placed
  const isEquipped = (name) => equippedItems.some((inv) => inv.item?.name === name);

  if (ownedItems.length === 0) {
    return (
      <section aria-labelledby="room-empty-heading" className="space-y-6">
        <div className="pixel-box bg-cozy-card p-8 sm:p-12 rounded-pixel text-center space-y-4 border-dashed border-2 border-cozy-brown-light/50">
          <div className="w-20 h-20 mx-auto pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-4xl shadow-pixel-sm select-none" aria-hidden="true">
            🛋️
          </div>
          <h2 id="room-empty-heading" className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark">
            Your Study Room is Waiting to be Filled!
          </h2>
          <p className="text-sm text-cozy-brown-medium max-w-md mx-auto leading-relaxed">
            Your sanctuary currently has just a simple wooden desk and window. Visit the Study Emporium to adopt a purring cat, set up an amber lamp, or cultivate lush study plants!
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onNavigateToShop}
              className="touch-target pixel-box-interactive bg-cozy-sage hover:bg-cozy-sage-dark text-white font-pixel text-sm sm:text-base px-6 py-3 rounded-pixel font-bold shadow-pixel-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark"
            >
              🛒 Visit Study Emporium
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="room-heading" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 id="room-heading" className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark flex items-center gap-2">
            <span aria-hidden="true">🛋️</span> My Study Sanctuary
          </h2>
          <p className="text-xs text-cozy-brown-medium">
            Equip decor and companions from your trunk to personalize your peaceful focus room
          </p>
        </div>

        <div className="text-xs font-pixel bg-cozy-parchment px-3 py-1.5 rounded-pixel border-2 border-cozy-border">
          <span className="text-cozy-sage-dark font-bold">{equippedItems.length}</span> / {ownedItems.length} Items Placed
        </div>
      </div>

      {/* 2D Layered Visual Study Room Scene */}
      <div 
        role="region"
        aria-label="Interactive Study Room Visualizer"
        className="relative w-full h-[360px] sm:h-[420px] rounded-pixel border-4 border-cozy-brown-dark overflow-hidden shadow-pixel-lg bg-gradient-to-b from-[#F2E8DC] via-[#EADBCA] to-[#CBB39C] select-none"
      >
        {/* Wall Planks Pattern */}
        <div className="absolute inset-x-0 top-0 h-[250px] sm:h-[290px] border-b-4 border-[#8B7355]/40 opacity-40 bg-[radial-gradient(#C4B29E_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Study Window with Outdoor View */}
        <div className="absolute top-6 left-8 sm:left-14 w-24 sm:w-32 h-32 sm:h-40 pixel-box bg-gradient-to-b from-[#A4C4D9] to-[#E3EBF0] rounded-pixel border-4 border-[#5E4738] shadow-pixel-sm overflow-hidden">
          {/* Window Sill Plant if Potted Succulent is equipped */}
          <AnimatePresence>
            {isEquipped('Potted Succulent') && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute bottom-1 right-2 text-2xl"
                title="Sunlit Potted Succulent"
                aria-label="Sunlit Potted Succulent"
              >
                🪴
              </motion.div>
            )}
          </AnimatePresence>
          {/* Cloud animation */}
          <motion.div
            animate={{ x: [-20, 100] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute top-4 text-xs opacity-80"
          >
            ☁️
          </motion.div>
          <div className="absolute inset-0 border-t-2 border-b-2 border-l-2 border-r-2 border-[#5E4738]/40 grid grid-cols-2 grid-rows-2 pointer-events-none"></div>
        </div>

        {/* Wall Shelf with Oak Bookshelf */}
        <div className="absolute top-10 right-8 sm:right-16 w-36 sm:w-44">
          <div className="h-3 bg-[#6E4F39] rounded-sm border-2 border-cozy-brown-dark shadow-pixel-sm"></div>
          <AnimatePresence>
            {isEquipped('Oak Bookshelf') && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute -top-7 left-2 flex items-center gap-1 text-2xl"
                title="Oak Bookshelf with ancient tomes"
              >
                <span>📚</span>
                <span className="text-xl">📖</span>
                <span>📜</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floor Baseboard & Wooden Flooring */}
        <div className="absolute inset-x-0 bottom-0 h-[110px] sm:h-[130px] bg-[#9C7A5B] border-t-4 border-[#4A3525]">
          {/* Floor Planks */}
          <div className="w-full h-full opacity-30 bg-[linear-gradient(90deg,#5E4738_2px,transparent_2px)] [background-size:60px_100%]"></div>
        </div>

        {/* Cozy Rug in Room Center */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-56 sm:w-72 h-16 sm:h-20 bg-[#C89B7B] rounded-full border-2 border-[#6D4930] shadow-pixel-sm opacity-90 flex items-center justify-center">
          <div className="w-48 sm:w-60 h-10 sm:h-14 border-2 border-dashed border-[#8B5E3C] rounded-full"></div>
        </div>

        {/* Companion Spot: Resting on Rug */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20">
          <AnimatePresence mode="wait">
            {equippedCompanion && (
              <motion.div
                key={equippedCompanion.item?.name}
                initial={{ scale: 0, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: -10 }}
                transition={{ type: 'spring', damping: 15 }}
                className="flex flex-col items-center group cursor-pointer"
                title={`Equipped Companion: ${equippedCompanion.item?.name}`}
              >
                <motion.span
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl sm:text-5xl select-none filter drop-shadow-md"
                >
                  {equippedCompanion.item?.name === 'Sleepy Calico Cat' ? '🐱' : '🦉'}
                </motion.span>
                <span className="px-2 py-0.5 bg-cozy-parchment/95 text-cozy-brown-dark font-pixel text-[10px] rounded-full border border-cozy-brown-dark shadow-pixel-sm mt-0.5">
                  {equippedCompanion.item?.name}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Zen Bonsai Tree on Floor Pedestal (Left Floor) */}
        <div className="absolute bottom-8 left-6 sm:left-12 z-10">
          <AnimatePresence>
            {isEquipped('Zen Bonsai Tree') && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex flex-col items-center"
                title="Zen Bonsai Tree"
              >
                <span className="text-4xl sm:text-5xl select-none">🌳</span>
                <div className="w-10 h-3 bg-[#5A3E2B] rounded-sm border border-cozy-brown-dark"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main Study Desk Structure (Center-Right) */}
        <div className="absolute bottom-8 right-6 sm:right-16 w-52 sm:w-64 z-10">
          {/* Desk Surface Items */}
          <div className="relative w-full h-8 flex items-end justify-around px-2">
            {/* Lamp (Left Desk) */}
            <AnimatePresence>
              {isEquipped('Warm Desk Lamp') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative flex flex-col items-center -mb-1"
                  title="Warm Amber Desk Lamp"
                >
                  {/* Radial Amber Light Glow */}
                  <div className="absolute -top-12 -left-6 w-20 h-20 bg-amber-300/30 rounded-full blur-md pointer-events-none animate-pulse"></div>
                  <span className="text-3xl select-none z-10 filter drop-shadow">💡</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Matcha Bowl (Center Desk) */}
            <AnimatePresence>
              {isEquipped('Ceremonial Matcha Bowl') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative flex flex-col items-center -mb-1"
                  title="Fresh Ceremonial Matcha"
                >
                  <motion.span
                    animate={{ opacity: [0.3, 0.9, 0.3], y: [-2, -6, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-[10px] text-cozy-sage-dark absolute -top-3"
                  >
                    ♨️
                  </motion.span>
                  <span className="text-2xl select-none">🍵</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Lo-Fi Cassette Player (Right Desk) */}
            <AnimatePresence>
              {isEquipped('Lo-Fi Cassette Player') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative flex flex-col items-center -mb-1"
                  title="Lo-Fi Cassette Player"
                >
                  <motion.span
                    animate={{ rotate: [-8, 8, -8] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-2xl select-none"
                  >
                    📼
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wooden Desk Top & Legs */}
          <div className="w-full h-5 bg-[#7D5A3C] rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm"></div>
          <div className="flex justify-between px-3">
            <div className="w-3 h-14 bg-[#5E422B] border-r-2 border-l-2 border-b-2 border-cozy-brown-dark"></div>
            <div className="w-3 h-14 bg-[#5E422B] border-r-2 border-l-2 border-b-2 border-cozy-brown-dark"></div>
          </div>
        </div>
      </div>

      {/* Wardrobe & Trunk Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-cozy-brown-dark pb-2">
          <div>
            <h3 className="text-lg font-pixel text-cozy-brown-dark flex items-center gap-2">
              <span>🧰</span> Scholar's Trunk &amp; Wardrobe
            </h3>
            <p className="text-xs text-cozy-brown-medium">
              Click an owned item to place it in the room or return it to your trunk
            </p>
          </div>
          <span className="text-[11px] font-pixel text-cozy-brown-medium">
            Companions: 1 active max • Decor: multiple
          </span>
        </div>

        {/* Owned Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ownedItems.map((inv) => {
            const item = inv.item || {};
            const isItemEquipped = inv.equipped;
            const isEquipping = equippingId === inv.id;
            const renderInfo = ITEM_RENDER_INFO[item.name] || {};
            const icon = renderInfo.icon || '🎁';

            return (
              <motion.article
                key={inv.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`pixel-box p-4 rounded-pixel shadow-pixel-sm flex flex-col justify-between border-2 transition ${
                  isItemEquipped
                    ? 'bg-cozy-card border-cozy-brown-dark ring-2 ring-cozy-sage/40'
                    : 'bg-cozy-parchment/70 border-cozy-border opacity-90'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 pixel-box bg-white rounded-pixel flex items-center justify-center text-2xl border-2 border-cozy-brown-dark shadow-pixel-sm select-none">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-pixel text-sm font-bold text-cozy-brown-dark truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-pixel px-1.5 py-0.5 rounded bg-cozy-parchment border border-cozy-border text-cozy-brown-medium uppercase">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-cozy-brown-medium line-clamp-2 leading-tight">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Equip Toggle Button */}
                <div className="border-t border-cozy-border pt-3 mt-3 flex items-center justify-between">
                  <span className="text-xs font-pixel">
                    {isItemEquipped ? (
                      <span className="text-cozy-sage-dark font-bold flex items-center gap-1">
                        <span aria-hidden="true">✓</span> Active in Room
                      </span>
                    ) : (
                      <span className="text-cozy-brown-medium">Stored in Trunk</span>
                    )}
                  </span>

                  <button
                    type="button"
                    disabled={isEquipping}
                    onClick={() => onToggleEquip(inv.id, !isItemEquipped)}
                    aria-label={`${isItemEquipped ? 'Unequip' : 'Equip'} ${item.name}`}
                    className={`touch-target pixel-box-interactive text-xs font-pixel font-bold px-4 py-2 rounded-pixel transition flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark ${
                      isItemEquipped
                        ? 'bg-cozy-terracotta-subtle hover:bg-cozy-terracotta-light text-cozy-terracotta-dark border-cozy-terracotta-dark'
                        : 'bg-cozy-sage hover:bg-cozy-sage-dark text-white shadow-pixel-sm'
                    }`}
                  >
                    {isEquipping ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : isItemEquipped ? (
                      <span>Unequip</span>
                    ) : (
                      <span>Place in Room</span>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
