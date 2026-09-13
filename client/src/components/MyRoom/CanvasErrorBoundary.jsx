import React from 'react';

/**
 * CanvasErrorBoundary
 * Protects against WebGL initialization failures, context losses, or Three.js runtime crashes.
 * Gracefully displays a friendly fallback and renders equipped items in a clean list view.
 */
export class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('[3D Canvas WebGL Error Boundary Caught]', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError || this.props.forceFallback) {
      const { equippedItems = [], onToggleEquip, equippingId } = this.props;

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="pixel-box bg-cozy-parchment p-6 rounded-pixel border-2 border-cozy-brown-dark shadow-pixel space-y-6"
        >
          {/* Friendly notice required by specs */}
          <div className="flex items-start gap-3 p-4 bg-cozy-card rounded-pixel border-2 border-cozy-terracotta/40">
            <span className="text-2xl select-none" aria-hidden="true">🍂</span>
            <div className="space-y-1">
              <h3 className="font-pixel text-sm sm:text-base text-cozy-terracotta-dark font-bold">
                Your device doesn't support 3D — here's your room in list view
              </h3>
              <p className="text-xs text-cozy-brown-medium">
                We safely switched to 2D list mode so you can view and arrange your equipped study items without interruption.
              </p>
            </div>
          </div>

          {/* Equipped Items List View */}
          <div className="space-y-3">
            <h4 className="font-pixel text-xs sm:text-sm text-cozy-brown-dark flex items-center justify-between">
              <span>Equipped Sanctuary Furnishings ({equippedItems.length})</span>
              <button
                type="button"
                onClick={this.handleRetry}
                aria-label="Try loading 3D study room again"
                className="touch-target px-2.5 py-1 text-xs text-cozy-sage-dark hover:text-white hover:bg-cozy-sage rounded border border-cozy-sage-dark font-pixel transition shadow-pixel-sm focus-visible:outline-2 focus-visible:outline-cozy-brown-dark"
              >
                🔄 Try 3D Again
              </button>
            </h4>

            {equippedItems.length === 0 ? (
              <p className="text-xs text-cozy-brown-medium italic py-3 text-center bg-cozy-card/50 rounded-pixel border border-dashed border-cozy-border">
                No items equipped yet. Equip decor or companions from your trunk below!
              </p>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {equippedItems.map((inv) => {
                  const item = inv.item;
                  const isEquipping = equippingId === inv.id;

                  return (
                    <li
                      key={inv.id}
                      className="p-3 bg-cozy-card rounded-pixel border-2 border-cozy-border flex items-center justify-between gap-3 shadow-pixel-sm"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl flex-shrink-0" aria-hidden="true">
                          {item?.name === 'Warm Desk Lamp' ? '💡' :
                           item?.name === 'Ceremonial Matcha Bowl' ? '🍵' :
                           item?.name === 'Lo-Fi Cassette Player' ? '📼' :
                           item?.name === 'Potted Succulent' ? '🪴' :
                           item?.name === 'Zen Bonsai Tree' ? '🌳' :
                           item?.name === 'Oak Bookshelf' ? '📚' :
                           item?.name === 'Sleepy Calico Cat' ? '🐱' :
                           item?.name === 'Wise Study Owl' ? '🦉' :
                           item?.name === 'Dawn Scholar Badge' ? '🌅' :
                           item?.name === 'Midnight Oil Badge' ? '🌙' : '📦'}
                        </span>
                        <div className="min-w-0">
                          <p className="font-pixel text-xs font-bold text-cozy-brown-dark truncate">
                            {item?.name}
                          </p>
                          <span className="text-[10px] text-cozy-sage-dark font-pixel capitalize">
                            {item?.category} • Placed in Room
                          </span>
                        </div>
                      </div>

                      {onToggleEquip && (
                        <button
                          type="button"
                          onClick={() => onToggleEquip(inv.id, inv.equipped)}
                          disabled={isEquipping}
                          aria-label={`Unequip ${item?.name}`}
                          className="touch-target pixel-box px-2.5 py-1 text-xs font-pixel font-bold bg-cozy-terracotta-subtle hover:bg-cozy-terracotta text-cozy-terracotta-dark hover:text-white rounded transition flex-shrink-0 disabled:opacity-50"
                        >
                          {isEquipping ? '...' : 'Unequip'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
