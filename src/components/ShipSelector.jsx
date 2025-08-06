import './ShipSelector.css'

export default function ShipSelector({ ships, selectedShip, onShipSelect }) {
  return (
    <div className="ship-selector">
      <h4>Select a ship to place:</h4>
      <div className="ship-list">
        {ships.map(ship => (
          <button
            key={ship.id}
            className={`ship-button ${selectedShip?.id === ship.id ? 'selected' : ''} ${ship.placed ? 'placed' : ''}`}
            onClick={() => !ship.placed && onShipSelect(ship)}
            disabled={ship.placed}
            data-ship={ship.id}
          >
            <div className="ship-preview">
              {Array.from({ length: ship.size }, (_, i) => (
                <div key={i} className="ship-segment" />
              ))}
            </div>
            <span className="ship-name">{ship.name}</span>
            {ship.placed && <span className="placed-indicator">✓</span>}
          </button>
        ))}
      </div>
    </div>
  )
} 