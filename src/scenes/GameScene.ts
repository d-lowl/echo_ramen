import Phaser from 'phaser';
import Button from '../components/Button';
import Request from '../attributes/Request';
import Game from '../game/Game';
import Deck from '../deck/Deck';
import { BasicIngredients } from '../ingredients/BasicIngredients';

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
    private gameLogic: Game;
    private scoreText: Phaser.GameObjects.Text;
    private pauseButton: Button;
    private endGameButton: Button;
    private requestText: Phaser.GameObjects.Text;
    
    constructor() {
        super('GameScene');
    }

    init(data: GameData): void {
        // Initialize the game with passed difficulty
        const difficultyLevel = data.difficulty === 'hard' ? 3 : 
                              data.difficulty === 'medium' ? 2 : 1;
        
        // Create deck with all basic ingredients
        const deck = new Deck(Object.values(BasicIngredients));
        
        // Initialize game logic
        this.gameLogic = new Game(deck, difficultyLevel);
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
            `SCORE: ${this.gameLogic.getScore()}`, 
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
                this.scene.start('ResultScene', { score: this.gameLogic.getScore() });
            }
        );
        
        // Add complete order button (for testing)
        new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            'COMPLETE ORDER',
            () => {
                const scoreEarned = this.gameLogic.completeOrder();
                console.log(`Order completed! Earned ${scoreEarned} points`);
                this.updateScore();
                this.displayCustomerRequest();
            }
        );
    }

    update(): void {
        // For demo only - will be removed in actual implementation
        if (Math.random() < 0.01) {
            this.gameLogic.addScore(10);
            this.updateScore();
        }
    }
    
    /**
     * Update the score display
     */
    private updateScore(): void {
        this.scoreText.setText(`SCORE: ${this.gameLogic.getScore()}`);
    }
    
    /**
     * Display the current customer request on screen
     */
    private displayCustomerRequest(): void {
        const request = this.gameLogic.getCurrentRequest();
        
        // Log the raw request values for debugging
        console.log('Customer Request Values:', request.attributes);
        
        // Format the request text with attribute values
        const requestString = `CUSTOMER REQUEST: \n${request.getDescription()}`;
        
        // Update or create the request text
        if (this.requestText) {
            this.requestText.setText(requestString);
        } else {
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
} 