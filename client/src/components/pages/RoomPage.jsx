import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholar } from '../../context/ScholarContext.jsx';
import MyRoom from '../MyRoom.jsx';
import { RoomSkeleton } from '../MyRoom/RoomSkeleton.jsx';

export function RoomPage() {
  const navigate = useNavigate();
  const {
    inventory,
    rooms,
    activeRoom,
    spirit,
    handleSelectRoom,
    character,
    handleToggleEquip,
    handleUpdateItemPosition,
    equippingId
  } = useScholar();

  return (
    <div className="space-y-4">
      <Suspense fallback={<RoomSkeleton />}>
        <MyRoom
          inventory={inventory}
          rooms={rooms}
          activeRoom={activeRoom}
          spirit={spirit}
          onSelectRoom={handleSelectRoom}
          userLevel={character?.level || 1}
          onToggleEquip={handleToggleEquip}
          onUpdateItemPosition={handleUpdateItemPosition}
          equippingId={equippingId}
          onNavigateToShop={() => navigate('/shop')}
        />
      </Suspense>
    </div>
  );
}
