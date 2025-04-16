import Phaser from 'phaser';
import config from './config';
import MainScene from './scenes/MainScene';

class Game extends Phaser.Game {
    constructor() {
        super(config);
        
        // Register scenes
        this.scene.add('MainScene', MainScene);
        
        // Start with the main scene
        this.scene.start('MainScene');
    }
}

// Wait for DOM to be ready before starting the game
window.addEventListener('load', () => {
    new Game();
}); 