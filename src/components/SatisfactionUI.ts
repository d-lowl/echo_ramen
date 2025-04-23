import { SatisfactionLevel } from '../managers/SatisfactionManager';

export default class SatisfactionUI extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private emoji: Phaser.GameObjects.Text;
    private feedbackText: Phaser.GameObjects.Text;
    private matchText: Phaser.GameObjects.Text;
    
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        
        // Create background
        this.background = scene.add.rectangle(0, 0, 500, 200, 0x222244, 0.9)
            .setStrokeStyle(3, 0x00ffff)
            .setOrigin(0.5);
            
        // Create emoji display
        this.emoji = scene.add.text(
            -180, 
            0, 
            '😐', 
            { fontFamily: 'Arial', fontSize: '64px' }
        ).setOrigin(0.5);
        
        // Create feedback text
        this.feedbackText = scene.add.text(
            -50, 
            -20, 
            'Feedback message here', 
            { 
                fontFamily: 'Arial', 
                fontSize: '20px', 
                color: '#ffffff',
                wordWrap: { width: 280 }
            }
        ).setOrigin(0, 0.5);
        
        // Create match percentage text
        this.matchText = scene.add.text(
            60,
            20,
            'Match: 0%',
            { 
                fontFamily: 'Arial', 
                fontSize: '18px', 
                color: '#cccccc' 
            }
        ).setOrigin(0, 0.5);
        
        // Add all components to container
        this.add([this.background, this.emoji, this.feedbackText, this.matchText]);
        
        // Initially hide the feedback
        this.setVisible(false);
        scene.add.existing(this);
    }
    
    display(
        level: SatisfactionLevel, 
        message: string, 
        matchPercentage: number
    ): void {
        // Set emoji based on satisfaction level
        const emojis = {
            'ecstatic': '😍',
            'satisfied': '😊',
            'neutral': '😐',
            'dissatisfied': '😕',
            'disgusted': '🤢'
        };
        
        // Set colors based on satisfaction level
        const colors = {
            'ecstatic': 0x00ff00,
            'satisfied': 0x99ff00,
            'neutral': 0xffcc00,
            'dissatisfied': 0xff6600,
            'disgusted': 0xff0000
        };
        
        this.emoji.setText(emojis[level]);
        this.feedbackText.setText(message);
        this.matchText.setText(`Match: ${matchPercentage}%`);
        this.background.setStrokeStyle(3, colors[level]);
        
        // Show the feedback
        this.setVisible(true);
        
        // Animate in
        this.scene.tweens.add({
            targets: this,
            y: this.y - 20,
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
    
    hide(): void {
        this.scene.tweens.add({
            targets: this,
            y: this.y + 20,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.setVisible(false);
            }
        });
    }
} 