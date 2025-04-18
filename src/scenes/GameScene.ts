import Phaser from 'phaser';
import Button from '../components/Button';
import Request from '../attributes/Request';

interface GameData {
    difficulty?: string;
}

interface TextStyle {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    fill?: string;
}

export default class GameScene extends Phaser.Scene {
    private score: number;
    private difficulty: string;
    private scoreText: Phaser.GameObjects.Text;
    private pauseButton: Button;
    private endGameButton: Button;
    private customerRequest: Request;
    private requestText: Phaser.GameObjects.Text;
    
    constructor() {
        super('GameScene');
        this.score = 0;
    }

    init(data: GameData): void {
        // Initialize with any passed data
        this.difficulty = data.difficulty || 'normal';
        this.score = 0;
        
        // Generate a random customer request
        this.generateRandomRequest();
    }

    preload(): void {
        // Load game assets
    }

    create(): void {
        // Set background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add score display
        this.scoreText = this.add.text(
            20, 
            20, 
            'SCORE: 0', 
            { fontFamily: 'Arial', fontSize: '24px', color: '#00ffff' } as TextStyle
        );
        
        // Display customer request
        this.displayCustomerRequest();
        
        // Add placeholder for game elements
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'GAME SCENE PLACEHOLDER',
            { fontFamily: 'Arial', fontSize: '32px', color: '#ffffff' } as TextStyle
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

    update(): void {
        // Game logic will be implemented here
        
        // For demo, increment score randomly
        if (Math.random() < 0.05) {
            this.score += 10;
            this.scoreText.setText(`SCORE: ${this.score}`);
        }
    }
    
    /**
     * Generate a new random customer request
     */
    private generateRandomRequest(): void {
        this.customerRequest = Request.createRandom(1);
    }
    
    /**
     * Display the current customer request on screen
     */
    private displayCustomerRequest(): void {
        // Log the raw request values for debugging
        console.log('Customer Request Values:', {
            richness: this.customerRequest.attributes.richness,
            spiciness: this.customerRequest.attributes.spiciness, 
            sweetness: this.customerRequest.attributes.sweetness
        });
        // Format the request text with attribute values
        const requestString = `CUSTOMER REQUEST: \n${this.customerRequest.getDescription()}`;
        
        // Display the request text
        this.requestText = this.add.text(
            this.cameras.main.centerX,
            100,
            requestString,
            { 
                fontFamily: 'Arial', 
                fontSize: '24px', 
                color: '#ffcc00',
                align: 'center'
            } as TextStyle
        ).setOrigin(0.5);
    }
} 