import Phaser from 'phaser';
import { FloorData } from '../managers/ProgressionManager';

export default class ProgressionUI {
    private scene: Phaser.Scene;
    private container: Phaser.GameObjects.Container;
    private floorText: Phaser.GameObjects.Text;
    private customerText: Phaser.GameObjects.Text;
    private difficultyIndicator: Phaser.GameObjects.Graphics;
    
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        initialFloorData?: FloorData
    ) {
        this.scene = scene;
        
        // Create container for all UI elements
        this.container = scene.add.container(x, y);
        
        // Create background with higher opacity and better contrast
        const bg = scene.add.rectangle(0, 0, 240, 70, 0x000000, 0.75)
            .setStrokeStyle(2, 0xff00ff)
            .setOrigin(0.5);
        this.container.add(bg);
        
        // Floor text with larger font
        this.floorText = scene.add.text(
            -100,
            -20,
            'Floor: 1/4',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#00ffff',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        this.container.add(this.floorText);
        
        // Customer text with larger font
        this.customerText = scene.add.text(
            -100,
            10,
            'Customer: 1/10',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#00ffff',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        this.container.add(this.customerText);
        
        // Difficulty indicator label moved to better position
        const difficultyText = scene.add.text(
            30,
            -20,
            'Difficulty:',
            {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#00ffff',
                stroke: '#000000',
                strokeThickness: 2
            }
        );
        this.container.add(difficultyText);
        
        // Create difficulty indicator
        this.difficultyIndicator = scene.add.graphics();
        this.container.add(this.difficultyIndicator);
        
        // Update with initial data if provided
        if (initialFloorData) {
            this.update(initialFloorData);
        }
    }
    
    /**
     * Update the UI with new floor data
     */
    public update(floorData: FloorData): void {
        const { floorNumber, difficulty, isBossFloor, totalCustomers, currentCustomer } = floorData;
        
        // Update floor text with highlight for boss floor
        this.floorText.setText(`Floor: ${floorNumber}/4`);
        if (isBossFloor) {
            this.floorText.setColor('#ff5555');
            this.floorText.setText(`BOSS FLOOR!`);
        } else {
            this.floorText.setColor('#00ffff');
        }
        
        // Update customer text
        this.customerText.setText(`Customer: ${currentCustomer}/${totalCustomers}`);
        
        // Update difficulty indicator
        this.updateDifficultyIndicator(difficulty);
    }
    
    /**
     * Update the difficulty indicator based on level
     */
    private updateDifficultyIndicator(difficulty: number): void {
        this.difficultyIndicator.clear();
        
        const colors = [0x00ff00, 0xffff00, 0xff9900, 0xff0000];
        const x = 40;
        
        // Draw difficulty pips
        for (let i = 0; i < 4; i++) {
            const color = i < difficulty ? colors[i] : 0x333333;
            this.difficultyIndicator.fillStyle(color, 1);
            this.difficultyIndicator.fillCircle(x + i * 20, 10, 6);
            
            // Add a slight glow to active pips
            if (i < difficulty) {
                this.difficultyIndicator.fillStyle(color, 0.5);
                this.difficultyIndicator.fillCircle(x + i * 20, 10, 9);
            }
        }
    }
    
    /**
     * Hide the progression UI
     */
    public hide(): void {
        this.container.setVisible(false);
    }
    
    /**
     * Show the progression UI
     */
    public show(): void {
        this.container.setVisible(true);
    }
} 