# Battleship Game

A complete React implementation of the classic Battleship game, featuring a modern UI and single-player gameplay against an AI opponent.

## Game Features

- **Classic Battleship Rules**: Based on the official Wikipedia Battleship game rules
- **5 Ships**: Carrier (5), Battleship (4), Destroyer (3), Submarine (3), Patrol Boat (2)
- **10×10 Grid**: Standard game board with letter/number coordinates
- **Ship Placement**: Interactive ship placement with horizontal/vertical orientation
- **Turn-based Gameplay**: Player vs Computer with intelligent AI
- **Visual Feedback**: Clear hit/miss indicators and ship status
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful gradient design with smooth animations

## How to Play

1. **Ship Placement Phase**:
   - Select a ship from the ship selector
   - Choose horizontal or vertical orientation
   - Click on your board to place the ship
   - Repeat until all 5 ships are placed

2. **Battle Phase**:
   - Click on the computer's board to fire shots
   - Red X marks indicate hits, white circles indicate misses
   - Sink all enemy ships to win!

## Game Rules

- Ships cannot overlap or be placed diagonally
- Ships must fit entirely within the 10×10 grid
- Players take turns firing shots
- A ship is sunk when all its segments are hit
- The first player to sink all enemy ships wins

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Google Cloud Storage

### Prerequisites
- Google Cloud SDK installed
- A Google Cloud project with billing enabled
- Storage bucket created

### Steps

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Create a storage bucket** (if not already created):
   ```bash
   gsutil mb gs://your-bucket-name
   ```

3. **Make the bucket publicly readable**:
   ```bash
   gsutil iam ch allUsers:objectViewer gs://your-bucket-name
   ```

4. **Upload the build files**:
   ```bash
   gsutil -m cp -r dist/* gs://your-bucket-name/
   ```

5. **Set the main page**:
   ```bash
   gsutil web set -m index.html gs://your-bucket-name
   ```

6. **Access your game**:
   ```
   https://storage.googleapis.com/your-bucket-name/
   ```

### Alternative: Using gsutil rsync

For easier updates, use rsync:

```bash
gsutil -m rsync -d -r dist gs://your-bucket-name
```

### Custom Domain (Optional)

If you want to use a custom domain:

1. **Configure your domain**:
   ```bash
   gsutil web set -m index.html -e 404.html gs://your-bucket-name
   ```

2. **Set up DNS** to point to `c.storage.googleapis.com`

## File Structure

```
src/
├── components/
│   ├── BattleshipGame.jsx    # Main game logic
│   ├── GameBoard.jsx         # 10×10 grid component
│   ├── ShipSelector.jsx      # Ship selection UI
│   └── *.css                 # Component styles
├── App.jsx                   # App wrapper
└── App.css                   # Global styles
```

## Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **CSS3**: Modern styling with gradients and animations
- **JavaScript ES6+**: Modern JavaScript features

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License. 