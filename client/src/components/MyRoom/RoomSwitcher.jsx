import React from 'react';

/**
 * RoomSwitcher
 * Visual tab selector rendered above the 3D sanctuary viewport.
 * Unlocked rooms are interactive tabs.
 * Locked rooms are greyed out with a lock icon and "Unlocks at Level X" anticipation hook.
 */
export function RoomSwitcher({
  rooms = [],
  activeRoomId,
  onSelectRoom,
  inventory = [],
  userLevel = 1
}) {
  const getRoomIcon = (name = '') => {
    if (name.includes('Reading') || name.includes('Nook')) return '📚';
    if (name.includes('Garden') || name.includes('Balcony')) return '🌿';
    return '🛋️';
  };

  const getPlacedCount = (roomId) => {
    return (inventory || []).filter((item) => item.equipped && item.room_id === roomId).length;
  };

  const unlockedRooms = (rooms || []).filter(
    (room) => room.is_unlocked ?? (userLevel >= room.unlock_level)
  );

  const handleTabKeyDown = (e, currentRoom) => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      const currentIndex = unlockedRooms.findIndex((r) => r.id === currentRoom.id);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % unlockedRooms.length;
      } else {
        nextIndex = (currentIndex - 1 + unlockedRooms.length) % unlockedRooms.length;
      }

      const nextRoom = unlockedRooms[nextIndex];
      if (nextRoom) {
        onSelectRoom(nextRoom);
        const nextButton = document.getElementById(`room-tab-${nextRoom.id}`);
        nextButton?.focus();
      }
    }
  };

  return (
    <div
      role="region"
      aria-label="Sanctuary Room Selection"
      className="pixel-box bg-cozy-card p-3 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">🏛️</span>
          <span className="font-pixel text-xs sm:text-sm text-cozy-brown-dark font-bold uppercase tracking-wider">
            Sanctuary Chambers
          </span>
        </div>
        <span className="text-[11px] font-pixel text-cozy-brown-medium">
          Scholar Level {userLevel}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="tablist" aria-label="Available Rooms">
        {rooms.map((room) => {
          const isUnlocked = room.is_unlocked ?? (userLevel >= room.unlock_level);
          const isActive = room.id === activeRoomId;
          const placedCount = getPlacedCount(room.id);
          const icon = getRoomIcon(room.name);

          if (isUnlocked) {
            return (
              <button
                key={room.id}
                type="button"
                role="tab"
                tabIndex={isActive ? 0 : -1}
                aria-selected={isActive}
                aria-controls={`room-panel-${room.id}`}
                id={`room-tab-${room.id}`}
                onClick={() => onSelectRoom(room)}
                onKeyDown={(e) => handleTabKeyDown(e, room)}
                className={`touch-target pixel-box text-left p-3 rounded-pixel transition flex items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-cozy-brown-dark ${
                  isActive
                    ? 'bg-gradient-to-r from-cozy-sage-subtle to-cozy-parchment border-2 border-cozy-sage-dark shadow-pixel-sm ring-1 ring-cozy-sage-dark'
                    : 'bg-cozy-parchment hover:bg-cozy-parchment/80 border-2 border-cozy-border text-cozy-brown-dark'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0 border ${
                      isActive
                        ? 'bg-cozy-sage text-white border-cozy-sage-dark shadow-pixel-sm'
                        : 'bg-cozy-card text-cozy-brown-dark border-cozy-border'
                    }`}
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-pixel text-xs sm:text-sm truncate font-bold ${
                      isActive ? 'text-cozy-brown-dark' : 'text-cozy-brown-medium'
                    }`}>
                      {room.name}
                    </p>
                    <p className="text-[10px] font-pixel text-cozy-sage-dark">
                      {isActive ? '● Active Room' : 'Switch Room'}
                    </p>
                  </div>
                </div>

                <div
                  className="flex-shrink-0 text-[10px] font-pixel px-2 py-0.5 rounded bg-cozy-card border border-cozy-border text-cozy-brown-dark shadow-pixel-xs"
                  title={`${placedCount} items placed here`}
                >
                  {placedCount} placed
                </div>
              </button>
            );
          }

          // Locked Room Card (Greyed preview thumbnail with lock icon & unlock requirement)
          return (
            <div
              key={room.id}
              role="tab"
              aria-selected={false}
              aria-disabled="true"
              tabIndex={0}
              title={`${room.name} unlocks at Character Level ${room.unlock_level}`}
              className="pixel-box text-left p-3 rounded-pixel bg-cozy-brown-light/15 border-2 border-dashed border-cozy-brown-medium/40 opacity-75 select-none flex items-center justify-between gap-3 cursor-not-allowed group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-lg bg-cozy-brown-medium/20 flex items-center justify-center text-lg flex-shrink-0 border border-cozy-brown-medium/30 grayscale"
                  aria-hidden="true"
                >
                  🔒
                </div>
                <div className="min-w-0">
                  <p className="font-pixel text-xs sm:text-sm text-cozy-brown-medium/80 truncate font-bold">
                    {room.name}
                  </p>
                  <p className="text-[10px] font-pixel text-cozy-terracotta-dark font-semibold">
                    Unlocks at Level {room.unlock_level}
                  </p>
                </div>
              </div>

              <span className="flex-shrink-0 text-[9px] font-pixel uppercase px-1.5 py-0.5 rounded bg-cozy-terracotta/20 text-cozy-terracotta-dark border border-cozy-terracotta/40 font-bold">
                Locked
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomSwitcher;
