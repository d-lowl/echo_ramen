import Phaser from 'phaser';
import config from './config';
import SceneManager from './managers/SceneManager';
import MainMenuScene from './scenes/MainMenuScene';
import GameScene from './scenes/GameScene';
import ResultScene from './scenes/ResultScene';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        
        // Initialize scene manager
        this.sceneManager = new SceneManager(this);
        
        // Register all scenes
        this.sceneManager.register('MainMenuScene', MainMenuScene);
        this.sceneManager.register('GameScene', GameScene);
        this.sceneManager.register('ResultScene', ResultScene);
        
        // Start with the main menu scene
        this.sceneManager.start('MainMenuScene');
    }
}

// Wait for DOM to be ready before starting the game
window.addEventListener('load', () => {
    new Game();
}); 