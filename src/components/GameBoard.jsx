import './GameBoard.css'

export default function GameBoard({ board, shots, onCellClick, showShips, gameState }) {
  const BOARD_SIZE = 10
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

  function getCellClass(row, col) {
    const cellClasses = ['cell']
    
    // Add ship class if ship is present and should be shown
    if (showShips && board[row][col]) {
      cellClasses.push('ship')
      cellClasses.push(`ship-${board[row][col]}`)
    }
    
    // Add shot classes
    if (shots[row][col]) {
      cellClasses.push(shots[row][col]) // 'hit' or 'miss'
    }
    
    return cellClasses.join(' ')
  }

  function handleCellClick(row, col) {
    if (gameState === 'placing' || (gameState === 'playing' && shots[row][col] === null)) {
      onCellClick(row, col)
    }
  }

  return (
    <div className="game-board">
      <div className="board-header">
        <div className="corner-cell"></div>
        {letters.map(letter => (
          <div key={letter} className="header-cell">{letter}</div>
        ))}
      </div>
      
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          <div className="header-cell">{numbers[rowIndex]}</div>
          {row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={gameState === 'gameOver'}
            />
          ))}
        </div>
      ))}
    </div>
  )
} 