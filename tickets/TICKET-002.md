# TICKET-002: Set up basic scene management system

## Description
Implement a scene management system for the Ramen Balance Master game to handle different game states including main menu, gameplay, tutorial, and results screens. The system should provide smooth transitions between scenes and maintain game state appropriately.

## Tasks
- Create base Scene class structure
- Implement Boot, Preloader, MainMenu, and Game scenes
- Set up scene transitions with data passing between scenes
- Create a centralized scene manager for easier navigation
- Implement state persistence between scene changes

## Acceptance Criteria
- All basic scenes are created and can be navigated between
- Game state persists appropriately when changing scenes
- Scene transitions are smooth with appropriate loading states
- Scene manager provides clear API for scene navigation
- Each scene properly initializes and cleans up resources

## Story Points
2 