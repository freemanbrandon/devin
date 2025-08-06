export default function GameBoard({ board, shots, onCellClick, showShips, gameState }) {
  const BOARD_SIZE = 10
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

  function getCellClass(row, col) {
    let baseClasses = 'w-8 h-8 border border-white/50 cursor-pointer transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400'
    
    // Add ship class if ship is present and should be shown
    if (showShips && board[row][col]) {
      const shipId = board[row][col]
      baseClasses += ` bg-${getShipColor(shipId)}-600 border-${getShipColor(shipId)}-700`
    } else {
      baseClasses += ' bg-white/20 hover:bg-white/30'
    }
    
    // Add shot classes
    if (shots[row][col]) {
      if (shots[row][col] === 'hit') {
        baseClasses += ' bg-red-700 border-red-800' // Darker red for hits
      } else if (shots[row][col] === 'miss') {
        baseClasses += ' bg-gray-300 border-gray-400' // Lighter grey for misses
      }
    }
    
    return baseClasses
  }

  function getShipColor(shipId) {
    const colors = {
      'carrier': 'red',
      'battleship': 'orange',
      'destroyer': 'green',
      'submarine': 'purple',
      'patrol': 'gray'
    }
    return colors[shipId] || 'blue'
  }

  function handleCellClick(row, col) {
    if (gameState === 'placing' || (gameState === 'playing' && shots[row][col] === null)) {
      onCellClick(row, col)
    }
  }

  return (
    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-xl">
      <div className="flex mb-2">
        <div className="w-8 h-8"></div>
        {letters.map(letter => (
          <div key={letter} className="w-8 h-8 flex items-center justify-center text-sm font-bold text-white">
            {letter}
          </div>
        ))}
      </div>
      
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex mb-1">
          <div className="w-8 h-8 flex items-center justify-center text-sm font-bold text-white">
            {numbers[rowIndex]}
          </div>
          {row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={gameState === 'gameOver'}
              title={`${letters[colIndex]}${numbers[rowIndex]}`}
            >
              {shots[rowIndex]?.[colIndex] === 'hit' && (
                <span className="text-white font-bold text-lg">✕</span>
              )}
              {shots[rowIndex]?.[colIndex] === 'miss' && (
                <span className="text-gray-600 font-bold">○</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
} 