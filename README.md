# Ramen Balance Master

A cyberpunk-themed cooking game where players balance ingredients to create the perfect ramen bowl based on customer requests in a neon-lit future.

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+)

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start the development server
npm start

# Type checking
npm run typecheck
```
The game will be available at http://localhost:8080

### Production Build
```bash
# Create a production build
npm run build
```
The build files will be in the `dist` directory.

## Game Structure
- `src/scenes/` - Phaser scenes
- `src/components/` - Game components
- `src/assets/` - Game assets (images, audio, fonts)
- `src/types/` - TypeScript type definitions

## Tech Stack
- Phaser 3
- TypeScript
- Webpack
- ES6+

## TypeScript Setup
The project uses TypeScript to provide better type safety and development experience.

- Phaser types are imported directly from the package
- Common interfaces are defined in `src/types/index.d.ts`
- Configure TypeScript settings in `tsconfig.json`
- Use interfaces to define the shape of your game objects and data
- Run `npm run typecheck` to check for type errors without building 