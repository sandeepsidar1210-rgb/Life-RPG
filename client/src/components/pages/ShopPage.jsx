import React from 'react';
import { useScholar } from '../../context/ScholarContext.jsx';
import { ShopCatalog } from '../ShopCatalog.jsx';

export function ShopPage() {
  const {
    items,
    inventory,
    character,
    handlePurchaseItem,
    purchasingId
  } = useScholar();

  return (
    <div className="space-y-4">
      <ShopCatalog
        items={items}
        inventory={inventory}
        userCoins={character.cozy_coins}
        onPurchase={handlePurchaseItem}
        purchasingId={purchasingId}
      />
    </div>
  );
}
