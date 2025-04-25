# EchoRamen

A cyberpunk-themed cooking game where players balance ingredients to create the perfect ramen bowl based on customer requests in a neon-lit future.

Created for the [Gamedev.js Jam 2025](https://itch.io/jam/gamedevjs-2025) on the theme of "Balance".

## Challenges

This game is participating in the following challenges:

- **Open Source Challenge by GitHub** - Full source code available in this repository
- **Build it with Phaser Challenge by Phaser Studio** - Built using Phaser 3 framework
- **$NOODS Challenge by OP Games** - A noodle-themed game with vibe coding

## Vibe Coding Experience

I went into this jam with zero Phaser experience, so I figured why not try out this "vibe coding" approach everyone's talking about? Honestly, it was a rather fun. 

Working with Cursor (AI-powered IDE), I was able to throw together a prototype way faster than I expected. The key was starting with a structured approach - writing tickets for features before jumping into implementation. This gave the AI clear directives without getting lost in the weeds.

One thing I learned quickly: you have to tone down the AI's ambitions sometimes. Left unchecked, it wanted to build very complex systems for everything, when all I needed was a simple game feature. But once we found the rhythm, the development flow was surprisingly smooth.

For anyone curious about trying AI assistance for game dev, I'd say go for it - just be prepared to steer the ship rather than letting the AI captain take you on unnecessary detours.

Would I use it to further polish this (or some other game)? I don't know yet, but if I do, the workflow will need to be adapted (I'm not sure what exact adaptations are needed, but this workflow is a bit messy -- fine for a jam, but not for a polished game).

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm (v6+)

### Installation
```bash
# Clone the repository
git clone https://github.com/d-lowl/echo_ramen.git
cd echo_ramen

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

## Credits
- D. Lowl -- Developer
- DavidKBD -- Music (Pink Bloom Synthwave Music Pack, CC-BY 4.0)
- raylibtech -- Sound Effects (rfxgen)

## License
MIT License 