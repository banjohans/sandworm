# Sandworm - React Edition

A Dune-themed Snake/Pac-Man hybrid game built with React, TypeScript, and Vite. Control a sandworm to hunt Fremen across the desert of Arrakis!

## 🎮 Game Features

- **Dynamic Gameplay**: Control the sandworm using arrow keys or touch/swipe controls
- **Fremen Hunting**: Chase and consume Fremen to grow your sandworm and score points
- **Special Fremen**: Look out for "Lisan al Gaib" - the super Fremen that grants bonus points
- **Warp Mechanic**: Click anywhere to teleport (costs 5 points)
- **Time Challenge**: 3-minute time limit to maximize your score
- **Highscore Tracking**: Persistent highscore storage with initials
- **Immersive Audio**: Thematic music and sound effects
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
sandworm-react/
├── public/              # Static assets
│   ├── images/          # Game images
│   ├── sounds/          # Audio files
│   └── favicon.png
├── src/
│   ├── components/      # React components
│   │   ├── AudioElements.tsx
│   │   ├── Fremen.tsx
│   │   ├── GameContainer.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── HUD.tsx
│   │   ├── RulesOverlay.tsx
│   │   └── Snake.tsx
│   ├── context/         # State management
│   │   └── GameContext.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useAudioManager.ts
│   │   ├── useGameLoop.ts
│   │   └── useSwipeControls.ts
│   ├── styles/          # CSS modules
│   ├── types/           # TypeScript types
│   │   └── game.ts
│   ├── utils/           # Utility functions
│   │   ├── constants.ts
│   │   ├── gameUtils.ts
│   │   └── storage.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎯 How to Play

1. **Start Game**: Click "Start Game" on the home screen
2. **Movement**: 
   - Desktop: Use arrow keys
   - Mobile: Swipe in the direction you want to move
3. **Objective**: Eat as many Fremen as possible within 3 minutes
4. **Scoring**:
   - Regular Fremen: 10 points
   - Super Fremen (red with gold border): 50 points
5. **Warp**: Click/tap anywhere to teleport (costs 5 points)
6. **Exit**: Click "Exit" button to return to menu

## 🛠️ Technology Stack

- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Context API**: State management
- **CSS3**: Styling with animations
- **LocalStorage**: Highscore persistence

## 🎨 Original Codebase

This React version is a complete refactor of the original vanilla JavaScript implementation, maintaining feature parity while adding:
- Component-based architecture
- TypeScript type safety
- Modern React hooks
- Better state management
- Improved code organization

## 🔮 Future Enhancements (Roadmap)

### Cross-Platform Targets
- **PWA**: Progressive Web App with offline support
- **Capacitor**: iOS and Android mobile apps
- **Tauri**: Desktop applications (Windows, macOS, Linux)

### Planned Features
- Particle effects and animations
- Achievement system
- Online leaderboards
- Multiple difficulty levels
- Power-ups and special abilities
- Theming and accessibility options
- Sound settings and volume control

## 📝 Development Notes

### Key Architectural Decisions

1. **State Management**: Using Context API for simplicity. Can be upgraded to Zustand or Redux for larger scale
2. **Game Loop**: Implemented with `setInterval` and React hooks for frame updates
3. **Collision Detection**: Grid-based system matching original implementation
4. **Asset Management**: Static assets in `public/` for easy access and Capacitor compatibility

### Performance Considerations

- Dynamic grid sizing based on viewport
- Optimized render cycles with proper React hooks
- Event listener cleanup in useEffect
- Memoization where appropriate

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of the Sandworm game by HMRA.

## 🎵 Credits

- Original concept and vanilla JS implementation
- Dune theme and assets
- Audio: Arrakis theme music and sound effects

---

**May your path be blessed by Shai-Hulud!** 🪱
