import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Items', icon: '🧺' },
  { id: 'decor', label: 'Decor', icon: '🪴' },
  { id: 'companion', label: 'Companions', icon: '🐾' },
  { id: 'badge', label: 'Badges', icon: '🏅' },
];

const ITEM_ICONS = {
  'Potted Succulent': '🪴',
  'Warm Desk Lamp': '💡',
  'Sleepy Calico Cat': '🐱',
  'Oak Bookshelf': '📚',
  'Ceremonial Matcha Bowl': '🍵',
  'Lo-Fi Cassette Player': '📼',
  'Dawn Scholar Badge': '🌅',
  'Zen Bonsai Tree': '🌳',
};

export function ShopCatalog({ items, inventory, userCoins, onPurchase, purchasingId }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = items.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const ownedItemIds = new Set((inventory || []).map(inv => inv.item_id));

  return (
    <section aria-labelledby="shop-heading" className="space-y-6">
      {/* Header & Balance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 id="shop-heading" className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark flex items-center gap-2">
            <span aria-hidden="true">🛒</span> Cozy Study Emporium
          </h2>
          <p className="text-xs text-cozy-brown-medium">
            Spruce up your study haven with ambient decor, gentle companions, and badges
          </p>
        </div>

        <div 
          className="pixel-box bg-cozy-parchment px-3.5 py-2 rounded-pixel flex items-center gap-2 border-2 border-cozy-brown-dark"
          aria-label={`Current Balance: ${userCoins} Cozy Coins`}
        >
          <span className="text-base" role="img" aria-label="Coin">🪙</span>
          <span className="font-pixel text-sm font-bold text-cozy-gold-dark">
            {userCoins} <span className="font-sans text-xs font-normal text-cozy-brown-medium">Available Coins</span>
          </span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div 
        role="tablist" 
        aria-label="Shop categories"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {CATEGORY_TABS.map(tab => {
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls="catalog-items-grid"
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`touch-target pixel-box px-3.5 py-2 rounded-pixel font-pixel text-xs transition flex items-center gap-1.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
                isSelected
                  ? 'bg-cozy-sage text-white border-2 border-cozy-brown-dark font-bold shadow-pixel-sm'
                  : 'bg-cozy-card text-cozy-brown-dark hover:bg-cozy-parchment'
              }`}
            >
              <span aria-hidden="true">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Catalog Grid */}
      {filteredItems.length === 0 ? (
        <div className="pixel-box bg-cozy-card p-8 sm:p-10 rounded-pixel text-center space-y-3 border-dashed border-2 border-cozy-brown-light/40">
          <span className="text-3xl select-none" aria-hidden="true">🧺</span>
          <h3 className="font-pixel text-base text-cozy-brown-dark">No wares found in this section</h3>
          <p className="text-xs text-cozy-brown-medium max-w-sm mx-auto">
            The shopkeeper is currently restocking this shelf with new study furnishings and companions.
          </p>
        </div>
      ) : (
        <div 
          id="catalog-items-grid" 
          role="tabpanel"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filteredItems.map(item => {
          const isOwned = ownedItemIds.has(item.id);
          const canAfford = userCoins >= item.cost;
          const isPurchasing = purchasingId === item.id;
          const icon = ITEM_ICONS[item.name] || '🎁';

          return (
            <motion.article
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              aria-labelledby={`item-title-${item.id}`}
              className="pixel-box bg-cozy-card p-4 rounded-pixel shadow-pixel flex flex-col justify-between border-2 border-cozy-brown-dark hover:border-cozy-brown-dark transition group"
            >
              <div>
                {/* Item Icon Badge */}
                <div 
                  className="w-16 h-16 mx-auto mb-3 pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-3xl group-hover:scale-105 transition border-2 border-cozy-brown-dark select-none"
                  aria-hidden="true"
                >
                  {icon}
                </div>

                <div className="flex items-center justify-between gap-1 mb-1">
                  <h3 id={`item-title-${item.id}`} className="font-pixel text-sm font-bold text-cozy-brown-dark line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="text-[10px] font-pixel px-1.5 py-0.5 rounded bg-cozy-parchment border border-cozy-border text-cozy-brown-medium uppercase">
                    {item.category}
                  </span>
                </div>

                <p className="text-[11px] text-cozy-brown-medium leading-snug mb-3">
                  {item.description}
                </p>
              </div>

              {/* Price & Action */}
              <div className="border-t border-cozy-border pt-3 mt-1 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 font-pixel text-xs font-bold text-cozy-gold-dark">
                  <span aria-hidden="true">🪙</span>
                  <span>{item.cost} Coins</span>
                </div>

                {isOwned ? (
                  <span 
                    aria-label={`${item.name} is already owned`}
                    className="touch-target pixel-box bg-cozy-sage-subtle text-cozy-sage-dark text-[11px] font-pixel px-3 py-1.5 rounded-pixel font-bold border-cozy-sage-light"
                  >
                    ✓ Owned
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford || isPurchasing}
                    onClick={() => onPurchase(item)}
                    aria-label={
                      canAfford 
                        ? `Purchase ${item.name} for ${item.cost} Cozy Coins` 
                        : `Cannot afford ${item.name}. Costs ${item.cost} coins, you have ${userCoins} coins`
                    }
                    className={`touch-target pixel-box-interactive text-xs font-pixel font-bold px-3.5 py-2 rounded-pixel transition flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cozy-brown-dark ${
                      canAfford
                        ? 'bg-cozy-gold-base hover:bg-cozy-gold-dark text-white dark:text-cozy-brown-dark shadow-pixel-sm'
                        : 'bg-cozy-brown-subtle text-cozy-brown-light cursor-not-allowed opacity-70'
                    }`}
                  >
                    {isPurchasing ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-label="Purchasing..."></span>
                    ) : canAfford ? (
                      <span>Adopt / Buy</span>
                    ) : (
                      <span>Need {item.cost - userCoins}c</span>
                    )}
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
        </div>
      )}
    </section>
  );
}
