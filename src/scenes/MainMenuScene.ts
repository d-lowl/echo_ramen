import Phaser from 'phaser';
import Button from '../components/Button';

interface TextStyle {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    stroke?: string;
    strokeThickness?: number;
    fill?: string;
}

export default class MainMenuScene extends Phaser.Scene {
    private sceneData: any;
    private startButton: Button;
    private tutorialButton: Button;
    private settingsButton: Button;

    constructor() {
        super('MainMenuScene');
    }

    init(data: any): void {
        // Store any passed data
        this.sceneData = data;
    }

    preload(): void {
        // Here we'll load assets when we have them
    }

    create(): void {
        // Set up cyberpunk style background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add title text with cyberpunk style
        const text = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 100, 
            'RAMEN BALANCE MASTER', 
            { 
                fontFamily: 'Arial', 
                fontSize: '32px', 
                color: '#00ffff',
                stroke: '#ff00ff',
                strokeThickness: 2
            }
        ).setOrigin(0.5);

        // Add simple animation to text
        this.tweens.add({
            targets: text,
            alpha: 0.7,
            yoyo: true,
            repeat: -1,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });

        // Add a start button using our Button component
        this.startButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            'START GAME',
            () => {
                // Transition to the game scene
                this.scene.start('GameScene');
            }
        );

        // Add a tutorial button
        this.tutorialButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 120,
            'TUTORIAL',
            () => {
                // Transition to tutorial scene (to be implemented)
                console.log('Tutorial would open here');
            }
        );

        // Add a settings button
        this.settingsButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 190,
            'SETTINGS',
            () => {
                console.log('Settings opened!');
                // Here we would open settings
            }
        );

        // Debugging info
        this.add.text(10, 10, 'Phaser v' + Phaser.VERSION, { fontSize: '16px', fill: '#00ff00' } as TextStyle);
    }

    update(): void {
        // Main menu update logic
    }
} 