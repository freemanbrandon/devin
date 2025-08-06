export default function ShipSelector({ ships, selectedShip, onShipSelect }) {
  function getShipColor(shipId) {
    const colors = {
      'carrier': 'bg-red-600',
      'battleship': 'bg-orange-600',
      'destroyer': 'bg-green-600',
      'submarine': 'bg-purple-600',
      'patrol': 'bg-gray-600'
    }
    return colors[shipId] || 'bg-blue-600'
  }

  return (
    <div className="mt-6">
      <h4 className="text-center mb-4 text-lg font-semibold text-white">
        Select a ship to place:
      </h4>
      <div className="flex flex-wrap justify-center gap-4">
        {ships.map(ship => (
          <button
            key={ship.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 min-w-[120px] relative ${
              selectedShip?.id === ship.id 
                ? 'border-blue-400 bg-blue-600/30 shadow-lg scale-105' 
                : 'border-white/50 bg-white/10 hover:border-white/70 hover:bg-white/20'
            } ${
              ship.placed 
                ? 'opacity-50 cursor-not-allowed border-green-500 bg-green-600/30' 
                : 'cursor-pointer'
            }`}
            onClick={() => !ship.placed && onShipSelect(ship)}
            disabled={ship.placed}
            data-ship={ship.id}
          >
            <div className="flex gap-1">
              {Array.from({ length: ship.size }, (_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-sm ${getShipColor(ship.id)}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-center text-white">{ship.name}</span>
            {ship.placed && (
              <span className="absolute top-2 right-2 text-green-300 font-bold text-lg">
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 