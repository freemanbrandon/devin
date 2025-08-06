import { useState, useEffect, useRef } from 'react'
import GameBoard from './GameBoard'
import ShipSelector from './ShipSelector'

const SHIPS = [
  { id: 'carrier', name: 'Carrier', size: 5, placed: false, hits: 0, sunk: false },
  { id: 'battleship', name: 'Battleship', size: 4, placed: false, hits: 0, sunk: false },
  { id: 'destroyer', name: 'Destroyer', size: 3, placed: false, hits: 0, sunk: false },
  { id: 'submarine', name: 'Submarine', size: 3, placed: false, hits: 0, sunk: false },
  { id: 'patrol', name: 'Patrol Boat', size: 2, placed: false, hits: 0, sunk: false }
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
  const [autopilotMode, setAutopilotMode] = useState(false)
  const [autopilotInterval, setAutopilotInterval] = useState(null)
  const [computerTurnTimer, setComputerTurnTimer] = useState(null)

  // Refs for autopilot state reads
  const gameStateRef = useRef(gameState)
  const currentPlayerRef = useRef(currentPlayer)
  const playerShotsRef = useRef(playerShots)
  const computerShotsRef = useRef(computerShots)
  const playerBoardRef = useRef(playerBoard)
  const computerBoardRef = useRef(computerBoard)
  const playerShipsRef = useRef(playerShips)
  const computerShipsRef = useRef(computerShips)
  const autopilotModeRef = useRef(autopilotMode)

  // Update refs when state changes
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    currentPlayerRef.current = currentPlayer
  }, [currentPlayer])

  useEffect(() => {
    playerShotsRef.current = playerShots
  }, [playerShots])

  useEffect(() => {
    computerShotsRef.current = computerShots
  }, [computerShots])

  useEffect(() => {
    playerBoardRef.current = playerBoard
  }, [playerBoard])

  useEffect(() => {
    computerBoardRef.current = computerBoard
  }, [computerBoard])

  useEffect(() => {
    playerShipsRef.current = playerShips
  }, [playerShips])

  useEffect(() => {
    computerShipsRef.current = computerShips
  }, [computerShips])

  useEffect(() => {
    autopilotModeRef.current = autopilotMode
  }, [autopilotMode])

  // Cleanup autopilot timer on unmount
  useEffect(() => {
    return () => {
      if (autopilotInterval) {
        clearTimeout(autopilotInterval)
      }
      if (computerTurnTimer) {
        clearTimeout(computerTurnTimer)
      }
    }
  }, [autopilotInterval])

  useEffect(() => {
    if (gameState === 'gameOver' && autopilotInterval) {
      clearTimeout(autopilotInterval)
      setAutopilotInterval(null)
    }
  }, [gameState, autopilotInterval])

  // Additional cleanup on component unmount (for hot reload scenarios)
  useEffect(() => {
    return () => {
      // Clear any existing timers on unmount
      if (autopilotInterval) {
        clearTimeout(autopilotInterval)
      }
      if (computerTurnTimer) {
        clearTimeout(computerTurnTimer)
      }
    }
  }, []) // Empty dependency array - runs only on mount/unmount

  function createEmptyBoard() {
    return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  }

  function isValidPlacement(board, ship, row, col, orientation) {
    const { size } = ship
    const endRow = orientation === 'horizontal' ? row : row + size - 1
    const endCol = orientation === 'horizontal' ? col + size - 1 : col

    // Check bounds
    if (endRow >= BOARD_SIZE || endCol >= BOARD_SIZE) {
      return false
    }

    // Check for overlaps
    for (let i = 0; i < size; i++) {
      const checkRow = orientation === 'horizontal' ? row : row + i
      const checkCol = orientation === 'horizontal' ? col + i : col
      if (board[checkRow][checkCol] !== null) {
        return false
      }
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
    const newComputerShips = SHIPS.map(ship => ({ ...ship })) // Create fresh copies

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

  function placePlayerShipsAutomatically() {
    let newPlayerBoard = createEmptyBoard()
    const newPlayerShips = SHIPS.map(ship => ({ ...ship })) // Create fresh copies

    newPlayerShips.forEach(ship => {
      let placed = false
      while (!placed) {
        const row = Math.floor(Math.random() * BOARD_SIZE)
        const col = Math.floor(Math.random() * BOARD_SIZE)
        const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical'

        if (isValidPlacement(newPlayerBoard, ship, row, col, orientation)) {
          newPlayerBoard = placeShip(newPlayerBoard, ship, row, col, orientation)
          ship.placed = true
          placed = true
        }
      }
    })

    setPlayerBoard(newPlayerBoard)
    setPlayerShips(newPlayerShips)
  }

  function getRandomShot() {
    let row, col
    do {
      row = Math.floor(Math.random() * BOARD_SIZE)
      col = Math.floor(Math.random() * BOARD_SIZE)
    } while (playerShots[row][col] !== null)
    return { row, col }
  }

  function getRandomComputerShot() {
    let row, col
    do {
      row = Math.floor(Math.random() * BOARD_SIZE)
      col = Math.floor(Math.random() * BOARD_SIZE)
    } while (computerShots[row][col] !== null)
    return { row, col }
  }

  function handlePlayerShot(row, col) {
    if (playerShots[row][col] !== null) return // Already shot here

    const newPlayerShots = playerShots.map(row => [...row])
    const hit = computerBoard[row][col] !== null

    if (hit) {
      newPlayerShots[row][col] = 'hit'
      const shipId = computerBoard[row][col]
      
      // Guard against null ship IDs
      if (!shipId) {
        console.error('Hit detected but shipId is null/undefined at:', { row, col, board: 'computerBoard' })
        setMessage('Hit detected but ship ID is invalid!')
        return
      }
      
      const updatedComputerShips = computerShips.map(ship => {
        if (ship.id === shipId) {
          const newShip = { ...ship }
          newShip.hits = (newShip.hits || 0) + 1
          if (newShip.hits >= ship.size) {
            newShip.sunk = true
          }
          return newShip
        }
        return ship
      })
      setComputerShips(updatedComputerShips)
      setMessage(`Hit! You hit the computer's ${shipId}!`)
      
      // Check if player won
      if (updatedComputerShips.every(ship => ship.sunk)) {
        setGameState('gameOver')
        setMessage('Congratulations! You won!')
        setPlayerShots(newPlayerShots)
        return
      }
    } else {
      newPlayerShots[row][col] = 'miss'
      setMessage('Miss!')
    }

    setPlayerShots(newPlayerShots)
    setCurrentPlayer('computer')

    // Computer's turn (only if not in autopilot mode)
    if (!autopilotMode) {
      // Clear any existing computer turn timer
      if (computerTurnTimer) {
        clearTimeout(computerTurnTimer)
      }
      
      const timerId = setTimeout(() => {
        handleComputerTurn()
        setComputerTurnTimer(null)
      }, 1000)
      
      setComputerTurnTimer(timerId)
    }
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
      
      // Guard against null ship IDs
      if (!shipId) {
        console.error('Hit detected but shipId is null/undefined at:', { row, col, board: 'playerBoard' })
        setMessage('Hit detected but ship ID is invalid!')
        return
      }
      
      const updatedPlayerShips = playerShips.map(ship => {
        if (ship.id === shipId) {
          const newShip = { ...ship }
          newShip.hits = (newShip.hits || 0) + 1
          if (newShip.hits >= ship.size) {
            newShip.sunk = true
          }
          return newShip
        }
        return ship
      })
      setPlayerShips(updatedPlayerShips)
      setMessage(`Hit! Computer hit your ${shipId}!`)
      
      // Check if computer won
      if (updatedPlayerShips.every(ship => ship.sunk)) {
        setGameState('gameOver')
        setMessage('Game Over! Computer won!')
        setComputerShots(newComputerShots)
        return
      }
    } else {
      newComputerShots[row][col] = 'miss'
      setMessage('Miss!')
    }

    setComputerShots(newComputerShots)
    setCurrentPlayer('player')
  }

  function resetGame() {
    setGameState('placing')
    setCurrentPlayer('player')
    setSelectedShip(null)
    setOrientation('horizontal') // Reset orientation to horizontal
    setAutopilotMode(false) // Reset autopilot mode
    if (autopilotInterval) {
      clearTimeout(autopilotInterval)
      setAutopilotInterval(null)
    }
    if (computerTurnTimer) {
      clearTimeout(computerTurnTimer)
      setComputerTurnTimer(null)
    }
    setPlayerBoard(createEmptyBoard())
    setComputerBoard(createEmptyBoard())
    setPlayerShots(createEmptyBoard())
    setComputerShots(createEmptyBoard())
    
    // Create completely fresh ship objects to ensure no state is carried over
    const freshShips = [
      { id: 'carrier', name: 'Carrier', size: 5, placed: false, hits: 0, sunk: false },
      { id: 'battleship', name: 'Battleship', size: 4, placed: false, hits: 0, sunk: false },
      { id: 'destroyer', name: 'Destroyer', size: 3, placed: false, hits: 0, sunk: false },
      { id: 'submarine', name: 'Submarine', size: 3, placed: false, hits: 0, sunk: false },
      { id: 'patrol', name: 'Patrol Boat', size: 2, placed: false, hits: 0, sunk: false }
    ]
    
    setPlayerShips(freshShips)
    setComputerShips([...freshShips])
    setMessage('Place your ships to start the game!')
  }

  function rotateShip() {
    setOrientation(orientation === 'horizontal' ? 'vertical' : 'horizontal')
  }

  function getRandomOpenCell(shots) {
    const N = 25
    for (let i = 0; i < N; i++) {
      const row = Math.floor(Math.random() * BOARD_SIZE)
      const col = Math.floor(Math.random() * BOARD_SIZE)
      if (shots[row][col] == null) return { row, col }
    }
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (shots[r][c] == null) return { row: r, col: c }
      }
    }
    return null
  }

  function scheduleNextTurn(delay = 1500) {
    if (gameStateRef.current === 'gameOver' || !autopilotModeRef.current) {
      return
    }
    
    // Clear any existing timer before setting a new one
    if (autopilotInterval) {
      clearTimeout(autopilotInterval)
    }
    
    const id = setTimeout(() => {
      takeTurn()
      scheduleNextTurn()
    }, delay)
    
    setAutopilotInterval(id)
  }

  function takeTurn() {
    if (gameStateRef.current === 'gameOver' || !autopilotModeRef.current) {
      return
    }

    if (currentPlayerRef.current === 'player') {
      // Blue Fleet's turn (attacking Red Fleet)
      const shot = getRandomOpenCell(playerShotsRef.current)
      
      if (shot === null) {
        // Draw - no more moves possible
        setGameState('gameOver')
        gameStateRef.current = 'gameOver' // Update ref immediately
        setMessage('Game ended in a draw!')
        return
      }
      
      const { row, col } = shot
      const hit = computerBoardRef.current[row][col] !== null
      
      // Update shots using functional setState
      setPlayerShots(prev => {
        const newShots = prev.map(row => [...row])
        newShots[row][col] = hit ? 'hit' : 'miss'
        return newShots
      })
      
      if (hit) {
        const shipId = computerBoardRef.current[row][col]
        
        // Guard against null ship IDs
        if (!shipId) {
          console.error('Hit detected but shipId is null/undefined at:', { row, col, board: 'computerBoard' })
          setMessage('Blue Fleet hit but ship ID is invalid!')
          return
        }
        
        // Update Red Fleet ships using functional setState
        setComputerShips(prev => {
          const updatedShips = prev.map(ship => {
            if (ship.id === shipId) {
              const newShip = { ...ship }
              newShip.hits = (newShip.hits || 0) + 1
              if (newShip.hits >= ship.size) {
                newShip.sunk = true
              }
              return newShip
            }
            return ship
          })
          
          // Check if Blue Fleet won
          if (updatedShips.every(ship => ship.sunk)) {
            setGameState('gameOver')
            gameStateRef.current = 'gameOver' // Update ref immediately
            setMessage('Blue Fleet wins!')
          }
          
          return updatedShips
        })
        
        setMessage(`Blue Fleet hit Red Fleet's ${shipId}!`)
      } else {
        setMessage('Blue Fleet missed!')
      }
      
      // Switch to Red Fleet
      setCurrentPlayer('computer')
      currentPlayerRef.current = 'computer' // Update ref immediately
    } else {
      // Red Fleet's turn (attacking Blue Fleet)
      const shot = getRandomOpenCell(computerShotsRef.current)
      
      if (shot === null) {
        // Draw - no more moves possible
        setGameState('gameOver')
        gameStateRef.current = 'gameOver' // Update ref immediately
        setMessage('Game ended in a draw!')
        return
      }
      
      const { row, col } = shot
      const hit = playerBoardRef.current[row][col] !== null
      
      // Update shots using functional setState
      setComputerShots(prev => {
        const newShots = prev.map(row => [...row])
        newShots[row][col] = hit ? 'hit' : 'miss'
        return newShots
      })
      
      if (hit) {
        const shipId = playerBoardRef.current[row][col]
        
        // Guard against null ship IDs
        if (!shipId) {
          console.error('Hit detected but shipId is null/undefined at:', { row, col, board: 'playerBoard' })
          setMessage('Red Fleet hit but ship ID is invalid!')
          return
        }
        
        // Update Blue Fleet ships using functional setState
        setPlayerShips(prev => {
          const updatedShips = prev.map(ship => {
            if (ship.id === shipId) {
              const newShip = { ...ship }
              newShip.hits = (newShip.hits || 0) + 1
              if (newShip.hits >= ship.size) {
                newShip.sunk = true
              }
              return newShip
            }
            return ship
          })
          
          // Check if Red Fleet won
          if (updatedShips.every(ship => ship.sunk)) {
            setGameState('gameOver')
            gameStateRef.current = 'gameOver' // Update ref immediately
            setMessage('Red Fleet wins!')
          }
          
          return updatedShips
        })
        
        setMessage(`Red Fleet hit Blue Fleet's ${shipId}!`)
      } else {
        setMessage('Red Fleet missed!')
      }
      
      // Switch back to Blue Fleet
      setCurrentPlayer('player')
      currentPlayerRef.current = 'player' // Update ref immediately
    }
  }

  function startAutopilot() {
    // Always clear any existing timer first
    if (autopilotInterval) {
      clearTimeout(autopilotInterval)
      setAutopilotInterval(null)
    }
    
    setAutopilotMode(true)
    setMessage('Autopilot mode activated! Watch Blue Fleet vs Red Fleet battle!')
    
    // Place ships automatically for both sides
    placePlayerShipsAutomatically()
    placeComputerShips()
    setGameState('playing')
    setCurrentPlayer('player') // Start with Blue Fleet
    
    // Update refs immediately to ensure they're current
    gameStateRef.current = 'playing'
    autopilotModeRef.current = true
    currentPlayerRef.current = 'player'
    
    // Start the autopilot chain
    scheduleNextTurn()
  }

  function stopAutopilot() {
    // Always clear any existing timer first
    if (autopilotInterval) {
      clearTimeout(autopilotInterval)
      setAutopilotInterval(null)
    }
    
    setAutopilotMode(false)
    setMessage('Autopilot mode deactivated!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-6xl font-bold text-center mb-8 text-white">
          🚢 Battleship
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-xl mb-2 bg-white/20 backdrop-blur-sm rounded-xl px-8 py-4 inline-block border border-white/30 shadow-lg text-white">
            {message}
          </p>
          {gameState === 'playing' && (
            <p className="text-lg text-white font-semibold mt-4">
              Current Turn: {autopilotMode 
                ? (currentPlayer === 'player' ? 'Blue Fleet' : 'Red Fleet')
                : (currentPlayer === 'player' ? 'You' : 'Computer')
              }
            </p>
          )}
          
          {/* Autopilot Button */}
          {gameState === 'placing' && (
            <div className="mt-4">
              <button 
                onClick={startAutopilot}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                🤖 Start Autopilot Mode
              </button>
              <p className="text-sm text-white/80 mt-2">
                Watch Blue Fleet vs Red Fleet battle each other!
              </p>
            </div>
          )}
          
          {autopilotMode && gameState === 'playing' && (
            <div className="mt-4">
              <button 
                onClick={stopAutopilot}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ⏹️ Stop Autopilot
              </button>
            </div>
          )}
        </div>

        {gameState === 'placing' && (
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/30 shadow-xl mb-8">
            <h3 className="text-2xl font-bold text-center mb-6 text-white">
              Place Your Ships
            </h3>
            
            <div className="flex justify-center gap-4 mb-6">
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  orientation === 'horizontal' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/40'
                }`}
                onClick={() => setOrientation('horizontal')}
              >
                ↔️ Horizontal
              </button>
              <button 
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  orientation === 'vertical' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white/20 text-white hover:bg-white/30 border border-white/40'
                }`}
                onClick={() => setOrientation('vertical')}
              >
                ↕️ Vertical
              </button>
              <button 
                className="px-6 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-lg"
                onClick={rotateShip}
              >
                🔄 Rotate
              </button>
            </div>
            
            <ShipSelector 
              ships={playerShips}
              selectedShip={selectedShip}
              onShipSelect={setSelectedShip}
            />
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Blue Fleet</h2>
            <GameBoard 
              board={playerBoard}
              shots={computerShots}
              onCellClick={(row, col) => handleBoardClick(row, col, 'player')}
              showShips={true}
              gameState={gameState}
            />
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">Red Fleet</h2>
            <GameBoard 
              board={computerBoard}
              shots={playerShots}
              onCellClick={(row, col) => handleBoardClick(row, col, 'computer')}
              showShips={false}
              gameState={gameState}
            />
          </div>
        </div>

        {gameState === 'gameOver' && (
          <div className="text-center">
            <button 
              onClick={resetGame} 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🎮 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}