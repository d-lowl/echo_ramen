import Button from '../components/Button';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
    }

    init(data) {
        // Initialize with any passed data
        this.difficulty = data.difficulty || 'normal';
        this.score = 0;
    }

    preload() {
        // Load game assets
    }

    create() {
        // Set background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add score display
        this.scoreText = this.add.text(
            20, 
            20, 
            'SCORE: 0', 
            { fontFamily: 'Arial', fontSize: '24px', color: '#00ffff' }
        );
        
        // Add placeholder for game elements
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'GAME SCENE PLACEHOLDER',
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' }
        ).setOrigin(0.5);
        
        // Add pause button in top right
        this.pauseButton = new Button(
            this,
            this.cameras.main.width - 100,
            30,
            'PAUSE',
            () => {
                // Pause game logic
                console.log('Game paused');
            },
            { fontSize: '18px' }
        );
        
        // Add end game button (for testing)
        this.endGameButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.height - 50,
            'END GAME',
            () => {
                // Go to results scene with current score
                this.scene.start('ResultScene', { score: this.score });
            }
        );
    }

    update() {
        // Game logic will be implemented here
        
        // For demo, increment score randomly
        if (Math.random() < 0.05) {
            this.score += 10;
            this.scoreText.setText(`SCORE: ${this.score}`);
        }
    }
} 