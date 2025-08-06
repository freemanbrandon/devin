# Autopilot Mode Documentation

## Overview
The autopilot mode allows two AI players (Blue Fleet vs Red Fleet) to battle each other automatically.

## Current Implementation

### 1. Autopilot State Management
```javascript
const [autopilotMode, setAutopilotMode] = useState(false)
const [autopilotInterval, setAutopilotInterval] = useState(null)
```

### 2. Turn Management
```javascript
// Blue Fleet starts first
setCurrentPlayer('player') // Start with Blue Fleet

// Blue Fleet's turn
handleAutopilotPlayerShot(row, col)

// Red Fleet's turn  
handleAutopilotComputerShot(row, col)
```

### 3. Blue Fleet Shot Function (FIXED)
```javascript
function handleAutopilotPlayerShot(row, col) {
  if (playerShots[row][col] !== null) return // Already shot here

  const newPlayerShots = playerShots.map(row => [...row])
  const hit = computerBoard[row][col] !== null

  if (hit) {
    newPlayerShots[row][col] = 'hit'
    const shipId = computerBoard[row][col]
    
    // Guard against null ship IDs
    if (!shipId) {
      console.error('Hit detected but shipId is null/undefined at:', { row, col, board: 'computerBoard' })
      setMessage('Blue Fleet hit but ship ID is invalid!')
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
    setMessage(`Blue Fleet hit Red Fleet's ${shipId}!`)
    
    // Check if Blue Fleet won
    if (updatedComputerShips.every(ship => ship.sunk)) {
      setGameState('gameOver')
      setMessage('Blue Fleet wins!')
      setPlayerShots(newPlayerShots)
      return
    }
  } else {
    newPlayerShots[row][col] = 'miss'
    setMessage('Blue Fleet missed!')
  }

  setPlayerShots(newPlayerShots)
  setCurrentPlayer('computer') // Switch to Red Fleet
  currentPlayerRef.current = 'computer' // Update ref immediately
}
```

### 4. Red Fleet Shot Function (FIXED)
```javascript
function handleAutopilotComputerShot(row, col) {
  if (computerShots[row][col] !== null) return // Already shot here

  const newComputerShots = computerShots.map(row => [...row])
  const hit = playerBoard[row][col] !== null

  if (hit) {
    newComputerShots[row][col] = 'hit'
    const shipId = playerBoard[row][col]
    
    // Guard against null ship IDs
    if (!shipId) {
      console.error('Hit detected but shipId is null/undefined at:', { row, col, board: 'playerBoard' })
      setMessage('Red Fleet hit but ship ID is invalid!')
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
    setMessage(`Red Fleet hit Blue Fleet's ${shipId}!`)
    
    // Check if Red Fleet won
    if (updatedPlayerShips.every(ship => ship.sunk)) {
      setGameState('gameOver')
      setMessage('Red Fleet wins!')
      setComputerShots(newComputerShots)
      return
    }
  } else {
    newComputerShots[row][col] = 'miss'
    setMessage('Red Fleet missed!')
  }

  setComputerShots(newComputerShots)
  setCurrentPlayer('player') // Switch back to Blue Fleet
  currentPlayerRef.current = 'player' // Update ref immediately
}
```

### 5. Turn Display
```javascript
Current Turn: {autopilotMode 
  ? (currentPlayer === 'player' ? 'Blue Fleet' : 'Red Fleet')
  : (currentPlayer === 'player' ? 'You' : 'Computer')
}
```

## Issues Identified

### 1. Shot Marker Persistence
- **Problem**: Shot markers disappear or don't show up on the "Blue Fleet" board
- **Expected**: Red Fleet's shots should be visible on the left board (Blue Fleet)
- **Actual**: Only Blue Fleet's shots are visible on the right board

### 2. Turn Switching
- **Problem**: Turn display shows "Red Fleet" but no moves are visible
- **Expected**: Should alternate between Blue Fleet and Red Fleet every 1.5 seconds
- **Actual**: Turn display shows "Red Fleet" but no moves are visible

## Board Configuration

### Correct Setup:
- `playerShots` should track Blue Fleet's shots at Red Fleet
- `computerShots` should track Red Fleet's shots at Blue Fleet

### Board Display:
- Left board should show `computerShots` (Red Fleet's shots)
- Right board should show `playerShots` (Blue Fleet's shots)

### Turn Flow:
- Should alternate between Blue Fleet and Red Fleet every 1.5 seconds

## Fixed Implementation

### 1. Turn Management
```javascript
// Blue Fleet starts first
setCurrentPlayer('player') // Start with Blue Fleet

// Blue Fleet's turn
takeTurn() // Handles both Blue and Red Fleet turns

// Red Fleet's turn  
takeTurn() // Handles both Blue and Red Fleet turns
```

### 2. Board Display (FIXED)
- **Left Board (Blue Fleet)**: Shows Red Fleet's shots at Blue Fleet ✅
- **Right Board (Red Fleet)**: Shows Blue Fleet's shots at Red Fleet ✅
- **Turn Display**: Alternates between "Blue Fleet" and "Red Fleet" ✅

### 3. Shot Flow (FIXED)
1. **Blue Fleet's Turn**:
   - Takes shot at Red Fleet's board (right side)
   - Updates `playerShots` with hit/miss
   - Switches to Red Fleet (updates both state and ref)
2. **Red Fleet's Turn**:
   - Takes shot at Blue Fleet's board (left side)
   - Updates `computerShots` with hit/miss
   - Switches back to Blue Fleet (updates both state and ref)

### 4. Visual Feedback (FIXED)
- **Left Board (Blue Fleet)**: Shows Red Fleet's shots at Blue Fleet ✅
- **Right Board (Red Fleet)**: Shows Blue Fleet's shots at Red Fleet ✅
- **Turn Display**: Alternates between "Blue Fleet" and "Red Fleet" ✅ 