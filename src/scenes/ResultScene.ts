import Phaser from 'phaser';
import Button from '../components/Button';

interface ResultData {
    score?: number;
}

interface TextStyle {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    stroke?: string;
    strokeThickness?: number;
    fill?: string;
}

export default class ResultScene extends Phaser.Scene {
    private score: number;
    private menuButton: Button;
    private playAgainButton: Button;

    constructor() {
        super('ResultScene');
        this.score = 0;
    }

    init(data: ResultData): void {
        // Get the score from the passed data
        this.score = data.score || 0;
    }

    preload(): void {
        // Load any assets needed
    }

    create(): void {
        // Set background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add results title
        this.add.text(
            this.cameras.main.centerX, 
            100, 
            'GAME OVER', 
            { 
                fontFamily: 'Arial', 
                fontSize: '48px', 
                color: '#ff00ff',
                stroke: '#00ffff',
                strokeThickness: 2
            } as TextStyle
        ).setOrigin(0.5);
        
        // Display the final score
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            `FINAL SCORE: ${this.score}`,
            { 
                fontFamily: 'Arial', 
                fontSize: '32px', 
                color: '#00ffff'
            } as TextStyle
        ).setOrigin(0.5);
        
        // Add some feedback based on score
        let feedbackText = 'Not bad! Try again?';
        if (this.score > 500) {
            feedbackText = 'Impressive balance!';
        } else if (this.score > 200) {
            feedbackText = 'Good job!';
        }
        
        this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 20,
            feedbackText,
            { 
                fontFamily: 'Arial', 
                fontSize: '24px', 
                color: '#ffffff'
            } as TextStyle
        ).setOrigin(0.5);
        
        // Add button to return to main menu
        this.menuButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'MAIN MENU',
            () => {
                this.scene.start('MainMenuScene');
            }
        );
        
        // Add button to play again
        this.playAgainButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 170,
            'PLAY AGAIN',
            () => {
                this.scene.start('GameScene');
            }
        );
    }
} 