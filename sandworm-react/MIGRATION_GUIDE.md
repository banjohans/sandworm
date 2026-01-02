# Sandworm Migration Guide

## Overview
This document provides a comprehensive guide for the migration from vanilla JavaScript to React + TypeScript, and outlines the next steps for cross-platform deployment.

## What's Been Migrated

### ✅ Core Game Mechanics
- **Snake Movement**: Grid-based movement with screen wrapping
- **Fremen Entities**: AI-controlled entities with random movement patterns
- **Super Fremen**: Special "Lisan al Gaib" entities with bonus points
- **Collision Detection**: Hitbox-based collision between snake and Fremen
- **Scoring System**: Points accumulation (10 pts regular, 50 pts super, -5 pts warp)
- **Timer System**: 3-minute countdown with game over
- **Growth Mechanic**: Snake grows when eating Fremen

### ✅ UI Components
- **Home Screen**: Menu with Start Game, Rules, Share buttons
- **Game Container**: Main gameplay area with HUD
- **HUD**: Timer and score display
- **Rules Overlay**: Instructions modal
- **Game Over Screen**: Final score display with highscore update

### ✅ Features
- **Highscore System**: LocalStorage-based persistent highscores
- **Audio System**: Background music and sound effects
- **Keyboard Controls**: Arrow keys for direction
- **Touch Controls**: Swipe gestures for mobile
- **Warp Mechanic**: Click-to-teleport functionality
- **Responsive Design**: Dynamic grid sizing based on viewport

## Architecture Comparison

### Before (Vanilla JS)
```
index.html          # Single HTML file
script.js           # 857 lines of procedural code
style.css           # Monolithic CSS
```

### After (React + TypeScript)
```
src/
├── components/     # 7 React components
├── hooks/          # 3 custom hooks
├── context/        # State management
├── types/          # TypeScript definitions
├── utils/          # Pure functions
└── styles/         # Component-specific CSS
```

## Key Improvements

### Type Safety
- Full TypeScript coverage
- Interface definitions for all game entities
- Type-safe state management
- Compile-time error detection

### Code Organization
- Component-based architecture
- Separation of concerns
- Reusable hooks
- Modular CSS

### State Management
- Centralized game state with Context API
- Predictable state updates
- Easy to extend and maintain

### Performance
- Optimized re-renders with proper hook usage
- Event listener cleanup
- Proper interval management

## Quick Start

```bash
# Install dependencies
cd sandworm-react
npm install

# Development server
npm run dev
# Open http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

## File Structure Guide

### Core Files
- `src/App.tsx` - Main application component
- `src/main.tsx` - Entry point
- `index.html` - HTML template

### Game Logic
- `src/hooks/useGameLoop.ts` - Core game loop and mechanics
- `src/hooks/useSwipeControls.ts` - Touch/swipe controls
- `src/hooks/useAudioManager.ts` - Audio system

### State Management
- `src/context/GameContext.tsx` - Global game state

### Components
- `src/components/GameContainer.tsx` - Main game area
- `src/components/Snake.tsx` - Snake rendering
- `src/components/Fremen.tsx` - Fremen rendering
- `src/components/HUD.tsx` - Score and timer display
- `src/components/HomeScreen.tsx` - Menu screen
- `src/components/RulesOverlay.tsx` - Rules modal
- `src/components/AudioElements.tsx` - Audio tag management

### Utilities
- `src/utils/constants.ts` - Game constants
- `src/utils/gameUtils.ts` - Helper functions
- `src/utils/storage.ts` - LocalStorage operations

### Types
- `src/types/game.ts` - TypeScript type definitions

## Next Phase: Cross-Platform Deployment

### Phase 6A: PWA Configuration
**Goal**: Make the game installable and work offline

**Steps**:
1. Create `manifest.json` in public folder
2. Add service worker for offline caching
3. Update index.html with PWA meta tags
4. Test with Lighthouse PWA audit

**Files to Create**:
```json
// public/manifest.json
{
  "name": "Sandworm",
  "short_name": "Sandworm",
  "description": "Dune-themed Snake game",
  "start_url": "/",
  "display": "fullscreen",
  "theme_color": "#dfa64a",
  "background_color": "#dfa64a",
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Phase 6B: Capacitor Setup (Mobile)
**Goal**: Create iOS and Android apps

**Steps**:
1. Install Capacitor: `npm install @capacitor/core @capacitor/cli`
2. Initialize Capacitor: `npx cap init`
3. Add platforms:
   ```bash
   npm install @capacitor/ios @capacitor/android
   npx cap add ios
   npx cap add android
   ```
4. Build and sync:
   ```bash
   npm run build
   npx cap sync
   ```
5. Open in native IDE:
   ```bash
   npx cap open ios     # Xcode
   npx cap open android # Android Studio
   ```

**Configuration**:
```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hmra.sandworm',
  appName: 'Sandworm',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

### Phase 6C: Tauri Setup (Desktop)
**Goal**: Create Windows, macOS, and Linux desktop apps

**Steps**:
1. Install Tauri CLI: `npm install -D @tauri-apps/cli`
2. Install Tauri API: `npm install @tauri-apps/api`
3. Initialize Tauri: `npm run tauri init`
4. Configure in `src-tauri/tauri.conf.json`
5. Build: `npm run tauri build`

**Benefits**:
- Small app size (~3MB)
- Native performance
- Built-in updater
- System tray support

## Testing Checklist

### Desktop Browser
- [ ] Game starts correctly
- [ ] Snake moves with arrow keys
- [ ] Fremen spawn and move
- [ ] Collision detection works
- [ ] Score increases
- [ ] Timer counts down
- [ ] Audio plays
- [ ] Highscore saves
- [ ] Game over screen shows
- [ ] Exit button works
- [ ] Warp mechanic works

### Mobile Browser
- [ ] Responsive layout
- [ ] Touch controls work
- [ ] Swipe gestures respond
- [ ] No zoom on double-tap
- [ ] Full screen gameplay
- [ ] Proper scaling

### PWA
- [ ] Installable
- [ ] Offline functionality
- [ ] Splash screen shows
- [ ] Icon displays correctly

### Mobile App (Capacitor)
- [ ] Builds successfully
- [ ] Runs on device
- [ ] Touch controls work
- [ ] Audio works
- [ ] No web browser UI
- [ ] App icon displays

### Desktop App (Tauri)
- [ ] Builds for platform
- [ ] Window resizes properly
- [ ] Keyboard shortcuts work
- [ ] Native look and feel

## Troubleshooting

### Build Errors
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`

### Game Not Starting
- Check browser console for errors
- Verify assets loaded in Network tab
- Ensure audio files are in public/sounds/

### Mobile Issues
- Test in device simulators first
- Check touch event handlers
- Verify viewport meta tag is correct

### Audio Not Playing
- Browser autoplay policies require user interaction
- Mute audio initially if needed
- Test with user gesture (button click)

## Performance Optimization Tips

### Current Performance
- 60 FPS gameplay
- Smooth animations
- Minimal re-renders

### Future Optimizations
1. **Canvas Rendering**: Replace DOM elements with HTML5 Canvas for even better performance
2. **Web Workers**: Move game loop to separate thread
3. **Asset Optimization**: Compress images and audio files
4. **Code Splitting**: Lazy load screens and components
5. **Service Worker Caching**: Cache assets for instant load

## Deployment Options

### Web Hosting
- **Vercel**: `vercel` (automatic)
- **Netlify**: `netlify deploy --prod`
- **GitHub Pages**: Configure vite.config.ts base path

### Mobile Distribution
- **iOS App Store**: Requires Apple Developer account ($99/year)
- **Google Play Store**: One-time $25 fee
- **Alternative**: TestFlight (iOS) and Firebase App Distribution

### Desktop Distribution
- **GitHub Releases**: Free, download from releases page
- **Microsoft Store**: $19 one-time registration
- **Mac App Store**: Included in Apple Developer account

## Contributing

When adding new features:
1. Create types in `src/types/`
2. Add logic to appropriate hook
3. Create or update components
4. Add styles in component-specific CSS
5. Update tests if applicable
6. Document in README

## Resources

### Documentation
- [React Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Tauri Docs](https://tauri.app/)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Can I Use](https://caniuse.com/) - Browser compatibility

## Version History

### v1.0.0 - React Migration (Current)
- ✅ Complete refactor from vanilla JS to React + TypeScript
- ✅ All features from original game
- ✅ Improved code organization
- ✅ Type safety throughout
- ✅ Ready for cross-platform deployment

### v1.1.0 - Cross-Platform (Planned)
- [ ] PWA support
- [ ] Capacitor mobile apps
- [ ] Tauri desktop apps
- [ ] App store deployments

### v2.0.0 - Enhancements (Future)
- [ ] Multiplayer support
- [ ] Additional game modes
- [ ] Achievements system
- [ ] Cloud leaderboards
- [ ] Particle effects
- [ ] Multiple themes

---

**Questions or Issues?**
- Check the main README.md for basic setup
- Review the code comments for specific implementations
- Create an issue in the repository for bugs or feature requests

**May your path be blessed by Shai-Hulud!** 🪱
