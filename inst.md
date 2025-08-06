React Battleship — Setup, Run & Deploy

This guide walks you through creating a React app, adding your Battleship game code, running it locally, building for production, and deploying it.

⸻

1) Prerequisites
	•	Node.js v18 or newer (includes npm)
Check:

node -v
npm -v


	•	Git
Check:

git --version


	•	A code editor (VS Code recommended) and a web browser (Chrome/Edge/Firefox).

If you don’t have Node.js: install the LTS version from nodejs.org.

⸻

2) Create the React App (Vite)

We’ll use Vite for a fast, modern React setup.

# 1) Make a new project (choose the 'react' template when prompted if asked)
npm create vite@latest react-battleship -- --template react

# 2) Move into the folder
cd react-battleship

# 3) Install dependencies
npm install

# 4) (Optional) Initialize Git
git init
git add .
git commit -m "Initial React app"


⸻

3) Where to Put the Game Code

Use this simple structure:

react-battleship/
├─ src/
│  ├─ game/
│  │  ├─ Game.jsx        # Main game logic and UI
│  │  ├─ Board.jsx       # Board component
│  │  ├─ Ship.jsx        # Ship component (optional)
│  │  └─ utils.js        # Helper functions (random placement, hit checks, etc.)
│  ├─ App.jsx            # App shell: imports and renders <Game />
│  └─ index.css
└─ vite.config.js

Example stubs (you can replace with your real logic later):

src/game/Game.jsx

import { useState } from "react";
import Board from "./Board.jsx";

export default function Game() {
  const [status, setStatus] = useState("Place your ships and start!");

  return (
    <div style={{ padding: 16 }}>
      <h1>Battleship</h1>
      <p>{status}</p>
      <div style={{ display: "flex", gap: 24 }}>
        <section>
          <h2>Your Board</h2>
          <Board />
        </section>
        <section>
          <h2>Computer</h2>
          <Board isComputer />
        </section>
      </div>
    </div>
  );
}

src/game/Board.jsx

export default function Board({ isComputer = false }) {
  // 10x10 placeholder grid
  const cells = Array.from({ length: 100 }, (_, i) => i);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(10, 28px)",
        gap: 2,
      }}
    >
      {cells.map((i) => (
        <button
          key={i}
          title={isComputer ? "Fire!" : "Your cell"}
          style={{ width: 28, height: 28 }}
          onClick={() => !isComputer && alert("Place ship or mark")}
        />
      ))}
    </div>
  );
}

src/App.jsx

import Game from "./game/Game.jsx";

export default function App() {
  return <Game />;
}


⸻

4) Run the App Locally

npm run dev

	•	Vite prints a Local URL like http://localhost:5173/.
	•	Open it in your browser to see the app.
	•	Edits save automatically and reload the page (hot reload).

⸻

5) Build for Production

Create an optimized production build:

npm run build

	•	The output goes to the dist/ folder.
	•	Test the production build locally:

npm run preview

Open the URL shown (usually http://localhost:4173/).

⸻

6) Deploy (Two Easy Options)

Option A: Vercel (very simple)

# Install the CLI
npm i -g vercel

# From the project folder
vercel

	•	Answer the prompts (use defaults).
	•	Vercel auto-detects Build Command: npm run build and Output: dist.
	•	On later updates, deploy again with:

vercel --prod



Option B: Netlify (drag-and-drop or CLI)

Drag-and-drop:
	1.	Run npm run build.
	2.	Go to app.netlify.com → Add new site → Deploy manually.
	3.	Drag the dist/ folder into the upload area.

CLI:

npm i -g netlify-cli
netlify login
npm run build
netlify deploy    # pick "dist" as the publish directory (creates a draft)
netlify deploy --prod


⸻

7) Basic Debugging Tips
	•	Node version issues:
Use Node v18+. If commands fail, check with node -v. Consider using nvm to switch versions.
	•	Blank page / errors in console:
Open DevTools → Console (F12) to see error messages. Fix missing imports, typos in filenames (case-sensitive), and bad paths.
	•	Dev server port in use:
If 5173 is busy, run:

npm run dev -- --port=5174


	•	Dependencies acting weird:
Delete and reinstall:

rm -rf node_modules package-lock.json
npm install


	•	Infinite re-renders / logic bugs:
Add small console.log() statements to trace state changes. Keep state updates inside event handlers, not during render.
	•	Preview looks different than dev:
Always test the prod build:

npm run build && npm run preview



⸻

8) Commit & Share (Optional)

git add .
git commit -m "Add Battleship game"
git branch -M main
git remote add origin https://github.com/<your-username>/react-battleship.git
git push -u origin main


⸻

You’re Done!

You now have a working React Battleship app structure you can customize, run locally, build, and deploy. Add your game logic and UI to the files in src/game/, iterate locally with npm run dev, and deploy with Vercel or Netlify when ready. Good luck! 🚢🎯