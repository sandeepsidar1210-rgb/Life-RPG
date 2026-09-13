import React, { useState, useMemo } from 'react';
import { RoomCanvas } from './MyRoom/RoomCanvas.jsx';
import { CanvasErrorBoundary } from './MyRoom/CanvasErrorBoundary.jsx';
import { RoomTrunkPanel } from './MyRoom/RoomTrunkPanel.jsx';
import { RoomSwitcher } from './MyRoom/RoomSwitcher.jsx';

/**
 * MyRoom
 * Main 3D study sanctuary container with multi-room progression.
 * Lazy-loaded and wrapped in Suspense and CanvasErrorBoundary.
 */
export function MyRoom({
  inventory = [],
  rooms = [],
  activeRoom = null,
  spirit = null,
  onSelectRoom,
  userLevel = 1,
  onToggleEquip,
  equippingId,
  onNavigateToShop
}) {
  const [simulateWebGLFailure, setSimulateWebGLFailure] = useState(false);

  // Determine active spirit 3D model key
  const spiritModelKey = useMemo(() => {
    if (!spirit) return 'emberwisp_stage_1';
    if (spirit.current_stage?.model_3d_key) return spirit.current_stage.model_3d_key;
    if (spirit.current_stage?.model_key) return spirit.current_stage.model_key;
    const stageNum = spirit.current_stage?.stage_number || spirit.spirit?.current_stage || (userLevel >= 12 ? 3 : (userLevel >= 5 ? 2 : 1));
    const attr = spirit.species?.attribute_type || 'focus';
    const prefix = attr === 'discipline' ? 'rootling' : attr === 'vitality' ? 'sproutling' : attr === 'creativity' ? 'inkling' : 'emberwisp';
    return `${prefix}_stage_${stageNum}`;
  }, [spirit, userLevel]);

  const ownedItems = inventory || [];

  const defaultRoomId = useMemo(() => {
    return (rooms || []).find((r) => r.display_order === 1)?.id || rooms[0]?.id;
  }, [rooms]);

  // Filter items placed in the active room (companions join in any room, badges are profile-scoped)
  const roomEquippedItems = useMemo(
    () => ownedItems.filter((item) => {
      if (!item.equipped) return false;
      if (item.item?.category === 'badge') return false;
      if (item.item?.category === 'companion') return true;
      const effectiveRoomId = item.room_id || defaultRoomId;
      return effectiveRoomId === activeRoom?.id;
    }),
    [ownedItems, activeRoom?.id, defaultRoomId]
  );

  const equippedNames = useMemo(
    () => new Set(roomEquippedItems.map((inv) => inv.item?.name)),
    [roomEquippedItems]
  );

  const roomName = activeRoom?.name || 'Study Desk';

  // Empty state if user owns 0 items
  if (ownedItems.length === 0) {
    return (
      <section aria-labelledby="room-empty-heading" className="space-y-6">
        <div className="pixel-box bg-cozy-card p-8 sm:p-12 rounded-pixel text-center space-y-4 border-dashed border-2 border-cozy-brown-light/50">
          <div
            className="w-20 h-20 mx-auto pixel-box bg-cozy-parchment rounded-pixel flex items-center justify-center text-4xl shadow-pixel-sm select-none"
            aria-hidden="true"
          >
            🛋️
          </div>
          <h2 id="room-empty-heading" className="text-xl sm:text-2xl font-pixel text-cozy-brown-dark">
            Your 3D Study Room is Waiting to be Filled!
          </h2>
          <p className="text-sm text-cozy-brown-medium max-w-md mx-auto leading-relaxed">
            Your 3D sanctuary currently has just a simple wooden desk and sunny window. Visit the Study Emporium to adopt a purring calico cat, ignite an amber lamp, or cultivate lush study bonsai!
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
            <span aria-hidden="true">🛋️</span> 3D Study Sanctuary
          </h2>
          <p className="text-xs text-cozy-brown-medium">
            Multiple unlockable chambers • {roomName} • Low-poly 3D powered by React Three Fiber
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {spirit && (
            <div className="text-xs font-pixel bg-cozy-parchment px-3 py-1.5 rounded-pixel border-2 border-cozy-border flex items-center gap-1.5 shadow-pixel-xs">
              <span aria-hidden="true">✨</span>
              <span className="text-cozy-terracotta-dark font-bold">
                {spirit.current_stage?.name || spirit.species?.name || 'Study Spirit'}
              </span>
              <span className="text-cozy-brown-medium text-[11px]">(Stage {spirit.current_stage?.stage_number || spirit.spirit?.current_stage || 1})</span>
            </div>
          )}
          <div className="text-xs font-pixel bg-cozy-parchment px-3 py-1.5 rounded-pixel border-2 border-cozy-border flex items-center gap-1.5">
            <span className="text-cozy-sage-dark font-bold">{roomEquippedItems.length}</span>
            <span>Placed in {roomName}</span>
          </div>
        </div>
      </div>

      {/* Multi-Room Switcher Tabs & Level Anticipation Hooks */}
      {rooms.length > 0 && (
        <RoomSwitcher
          rooms={rooms}
          activeRoomId={activeRoom?.id}
          onSelectRoom={onSelectRoom}
          inventory={ownedItems}
          userLevel={userLevel}
        />
      )}

      {/* Main Grid: 3D Canvas + Side Trunk Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top: 3D Viewport wrapped in Error Boundary */}
        <div className="lg:col-span-7 xl:col-span-8">
          <CanvasErrorBoundary
            equippedItems={roomEquippedItems}
            onToggleEquip={onToggleEquip}
            equippingId={equippingId}
            forceFallback={simulateWebGLFailure}
          >
            <RoomCanvas
              equippedNames={equippedNames}
              roomName={roomName}
              spiritModelKey={spiritModelKey}
              simulateWebGLFailure={simulateWebGLFailure}
            />
          </CanvasErrorBoundary>
        </div>

        {/* Right / Bottom: Scholar's Trunk Side Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <RoomTrunkPanel
            inventory={ownedItems}
            rooms={rooms}
            activeRoom={activeRoom}
            onToggleEquip={onToggleEquip}
            equippingId={equippingId}
            isSimulatingFailure={simulateWebGLFailure}
            onToggleSimulateFailure={() => setSimulateWebGLFailure((prev) => !prev)}
          />
        </div>
      </div>
    </section>
  );
}

// Default export for React.lazy
export default MyRoom;
