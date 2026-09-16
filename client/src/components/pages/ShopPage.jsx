import React from 'react';
import { useScholar } from '../../context/ScholarContext.jsx';
import { ShopCatalog } from '../ShopCatalog.jsx';

export function ShopPage() {
  const {
    items,
    inventory,
    character,
    handlePurchaseItem,
    purchasingId,
    spirit
  } = useScholar();

  const spiritStage =
    spirit?.current_stage?.stage_number ||
    spirit?.spirit?.current_stage ||
    (character?.level >= 12 ? 3 : character?.level >= 5 ? 2 : 1);

  return (
    <div className="space-y-4">
      <ShopCatalog
        items={items}
        inventory={inventory}
        userCoins={character.cozy_coins}
        onPurchase={handlePurchaseItem}
        purchasingId={purchasingId}
        spiritStage={spiritStage}
        isStage3={spiritStage >= 3}
      />
    </div>
  );
}
