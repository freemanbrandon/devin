import { useState, useEffect } from 'react'
import GameBoard from './GameBoard'
import ShipSelector from './ShipSelector'
import './BattleshipGame.css'

const SHIPS = [
  { id: 'carrier', name: 'Carrier', size: 5, placed: false },
  { id: 'battleship', name: 'Battleship', size: 4, placed: false },
  { id: 'destroyer', name: 'Destroyer', size: 3, placed: false },
  { id: 'submarine', name: 'Submarine', size: 3, placed: false },
  { id: 'patrol', name: 'Patrol Boat', size: 2, placed: false }
]

const BOARD_SIZE = 10

export default function BattleshipGame() {
  const [gameState, setGameState] = useState('placing') // placing, playing, gameOver
  const [currentPlayer, setCurrentPlayer] = useState('player') // player, computer
  const [selectedShip, setSelectedShip] = useState(null)
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard())
  const [computerBoard, setComputerBoard] = useState(createEmptyBoard())
  const [playerShots, setPlayerShots] = useState(createEmptyBoard())
  const [computerShots, setComputerShots] = useState(createEmptyBoard())
  const [playerShips, setPlayerShips] = useState([...SHIPS])
  const [computerShips, setComputerShips] = useState([...SHIPS])
  const [message, setMessage] = useState('Place your ships to start the game!')
  const [orientation, setOrientation] = useState('horizontal') // horizontal, vertical

  function createEmptyBoard() {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  }

  function isValidPlacement(board, ship, row, col, orientation) {
    const { size } = ship
    const endRow = orientation === 'horizontal' ? row : row + size - 1
    const endCol = orientation === 'horizontal' ? col + size - 1 : col

    // Check bounds
    if (endRow >= BOARD_SIZE || endCol >= BOARD_SIZE) return false

    // Check for overlaps
    for (let i = 0; i < size; i++) {
      const checkRow = orientation === 'horizontal' ? row : row + i
      const checkCol = orientation === 'horizontal' ? col + i : col
      if (board[checkRow][checkCol] !== null) return false
    }

    return true
  }

  function placeShip(board, ship, row, col, orientation) {
    const newBoard = board.map(row => [...row])
    const { size, id } = ship

    for (let i = 0; i < size; i++) {
      const shipRow = orientation === 'horizontal' ? row : row + i
      const shipCol = orientation === 'horizontal' ? col + i : col
      newBoard[shipRow][shipCol] = id
    }

    return newBoard
  }

  function handleBoardClick(row, col, boardType) {
    if (gameState === 'placing' && boardType === 'player') {
      if (!selectedShip) return

      if (isValidPlacement(playerBoard, selectedShip, row, col, orientation)) {
        const newBoard = placeShip(playerBoard, selectedShip, row, col, orientation)
        setPlayerBoard(newBoard)
        
        const updatedShips = playerShips.map(ship => 
          ship.id === selectedShip.id ? { ...ship, placed: true } : ship
        )
        setPlayerShips(updatedShips)
        setSelectedShip(null)

        // Check if all ships are placed
        if (updatedShips.every(ship => ship.placed)) {
          placeComputerShips()
          setGameState('playing')
          setMessage("Game started! Click on the computer's board to fire!")
        }
      }
    } else if (gameState === 'playing' && boardType === 'computer' && currentPlayer === 'player') {
      handlePlayerShot(row, col)
    }
  }

  function placeComputerShips() {
    let newComputerBoard = createEmptyBoard()
    const newComputerShips = [...SHIPS]

    newComputerShips.forEach(ship => {
      let placed = false
      while (!placed) {
        const row = Math.floor(Math.random() * BOARD_SIZE)
        const col = Math.floor(Math.random() * BOARD_SIZE)
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical'

        if (isValidPlacement(newComputerBoard, ship, row, col, orientation)) {
          newComputerBoard = placeShip(newComputerBoard, ship, row, col, orientation)
          ship.placed = true
          placed = true
        }
      }
    })

    setComputerBoard(newComputerBoard)
    setComputerShips(newComputerShips)
  }

  function handlePlayerShot(row, col) {
    if (playerShots[row][col] !== null) return // Already shot here

    const newPlayerShots = playerShots.map(row => [...row])
    const hit = computerBoard[row][col] !== null

    if (hit) {
      newPlayerShots[row][col] = 'hit'
      const shipId = computerBoard[row][col]
      const updatedComputerShips = computerShips.map(ship => {
        if (ship.id === shipId) {
          const newShip = { ...ship }
          if (!newShip.hits) newShip.hits = 0
          newShip.hits++
          if (newShip.hits >= ship.size) {
            newShip.sunk = true
          }
          return newShip
        }
        return ship
      })
      setComputerShips(updatedComputerShips)
      setMessage(`Hit! You hit the computer's ${shipId}!`)
    } else {
      newPlayerShots[row][col] = 'miss'
      setMessage('Miss!')
    }

    setPlayerShots(newPlayerShots)
    setCurrentPlayer('computer')

    // Check if player won
    if (updatedComputerShips?.every(ship => ship.sunk)) {
      setGameState('gameOver')
      setMessage('Congratulations! You won!')
      return
    }

    // Computer's turn
    setTimeout(() => {
      handleComputerTurn()
    }, 1000)
  }

  function handleComputerTurn() {
    let row, col
    do {
      row = Math.floor(Math.random() * BOARD_SIZE)
      col = Math.floor(Math.random() * BOARD_SIZE)
    } while (computerShots[row][col] !== null)

    const newComputerShots = computerShots.map(row => [...row])
    const hit = playerBoard[row][col] !== null

    if (hit) {
      newComputerShots[row][col] = 'hit'
      const shipId = playerBoard[row][col]
      const updatedPlayerShips = playerShips.map(ship => {
        if (ship.id === shipId) {
          const newShip = { ...ship }
          if (!newShip.hits) newShip.hits = 0
          newShip.hits++
          if (newShip.hits >= ship.size) {
            newShip.sunk = true
          }
          return newShip
        }
        return ship
      })
      setPlayerShips(updatedPlayerShips)
      setMessage(`Computer hit your ${shipId}!`)
    } else {
      newComputerShots[row][col] = 'miss'
      setMessage('Computer missed!')
    }

    setComputerShots(newComputerShots)
    setCurrentPlayer('player')

    // Check if computer won
    if (updatedPlayerShips?.every(ship => ship.sunk)) {
      setGameState('gameOver')
      setMessage('Game Over! Computer won!')
    }
  }

  function resetGame() {
    setGameState('placing')
    setCurrentPlayer('player')
    setSelectedShip(null)
    setPlayerBoard(createEmptyBoard())
    setComputerBoard(createEmptyBoard())
    setPlayerShots(createEmptyBoard())
    setComputerShots(createEmptyBoard())
    setPlayerShips([...SHIPS])
    setComputerShips([...SHIPS])
    setMessage('Place your ships to start the game!')
  }

  return (
    <div className="battleship-game">
      <h1>Battleship</h1>
      <div className="game-info">
        <p className="message">{message}</p>
        {gameState === 'playing' && (
          <p className="turn">Current Turn: {currentPlayer === 'player' ? 'You' : 'Computer'}</p>
        )}
      </div>

      <div className="game-container">
        <div className="board-section">
          <h2>Your Fleet</h2>
          <GameBoard 
            board={playerBoard}
            shots={computerShots}
            onCellClick={(row, col) => handleBoardClick(row, col, 'player')}
            showShips={true}
            gameState={gameState}
          />
        </div>

        <div className="board-section">
          <h2>Computer's Fleet</h2>
          <GameBoard 
            board={computerBoard}
            shots={playerShots}
            onCellClick={(row, col) => handleBoardClick(row, col, 'computer')}
            showShips={false}
            gameState={gameState}
          />
        </div>
      </div>

      {gameState === 'placing' && (
        <div className="ship-selection">
          <h3>Place Your Ships</h3>
          <div className="orientation-toggle">
            <button 
              className={orientation === 'horizontal' ? 'active' : ''}
              onClick={() => setOrientation('horizontal')}
            >
              Horizontal
            </button>
            <button 
              className={orientation === 'vertical' ? 'active' : ''}
              onClick={() => setOrientation('vertical')}
            >
              Vertical
            </button>
          </div>
          <ShipSelector 
            ships={playerShips}
            selectedShip={selectedShip}
            onShipSelect={setSelectedShip}
          />
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="game-over">
          <button onClick={resetGame} className="reset-button">
            Play Again
          </button>
        </div>
      )}
    </div>
  )
} 