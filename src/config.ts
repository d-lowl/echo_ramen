import Phaser from 'phaser';

interface GameConfig {
    type: number;
    parent: string;
    width: number;
    height: number;
    backgroundColor: string;
    scale: {
        mode: number;
        autoCenter: number;
    };
    physics: {
        default: string;
        arcade: {
            gravity: { x: number; y: number };
            debug: boolean;
        };
    };
    pixelArt: boolean;
    roundPixels: boolean;
    scene: any[];
}

const config: GameConfig = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#0a0a1e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: false
        }
    },
    pixelArt: false,
    roundPixels: true,
    // We'll let the SceneManager handle scene registration
    scene: []
};

export default config; 