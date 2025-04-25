import Phaser from 'phaser';
import Button from '../components/Button';

interface GameCompletionData {
    score: number;
    totalCustomers: number;
}

export default class GameCompletionScene extends Phaser.Scene {
    private score: number = 0;
    private totalCustomers: number = 0;
    
    constructor() {
        super({ key: 'GameCompletionScene' });
    }
    
    init(data: GameCompletionData): void {
        this.score = data.score || 0;
        this.totalCustomers = data.totalCustomers || 0;
    }
    
    create(): void {
        // Celebratory cyberpunk background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add particle effects
        this.createParticleEmitters();
        
        // Congratulations text with neon effect
        const titleText = this.add.text(
            this.cameras.main.centerX,
            150,
            'GAME COMPLETE!',
            {
                fontFamily: 'Arial',
                fontSize: '72px',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5);
        
        // Add glow effect to title
        this.createGlowEffect(titleText, 0xffff00);
        
        // Subtitle
        this.add.text(
            this.cameras.main.centerX,
            230,
            'Thanks for playing our game jam demo!',
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Score display
        const scoreText = this.add.text(
            this.cameras.main.centerX,
            320,
            `FINAL SCORE: ${this.score}`,
            {
                fontFamily: 'Arial',
                fontSize: '48px',
                color: '#00ffaa',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        this.createGlowEffect(scoreText, 0x00ffaa);
        
        // Stats display
        const statsContainer = this.add.container(this.cameras.main.centerX, 400);
        
        const statsBg = this.add.rectangle(0, 0, 500, 150, 0x222255, 0.7)
            .setStrokeStyle(2, 0x00ffff);
        statsContainer.add(statsBg);
        
        // Total customers served
        const customersText = this.add.text(
            0,
            -40,
            `Total Customers Served: ${this.totalCustomers}`,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        statsContainer.add(customersText);
        
        // Average score per customer
        const avgScore = this.totalCustomers > 0 ? (this.score / this.totalCustomers).toFixed(1) : '0';
        const avgScoreText = this.add.text(
            0,
            0,
            `Average Score per Customer: ${avgScore}`,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);
        statsContainer.add(avgScoreText);
        
        // Success rate message
        let successRate = this.totalCustomers > 0 ? (this.score / (this.totalCustomers * 100) * 100).toFixed(1) : '0';
        successRate = Math.min(parseFloat(successRate), 100).toFixed(1); // Cap at 100%
        
        let ratingMessage = 'Ramen Apprentice';
        if (parseFloat(successRate) > 90) {
            ratingMessage = 'Ramen Master!';
        } else if (parseFloat(successRate) > 75) {
            ratingMessage = 'Ramen Expert';
        } else if (parseFloat(successRate) > 60) {
            ratingMessage = 'Ramen Chef';
        }
        
        const ratingText = this.add.text(
            0,
            40,
            `Final Rating: ${ratingMessage} (${successRate}%)`,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffff00'
            }
        ).setOrigin(0.5);
        statsContainer.add(ratingText);
        
        // Restart and main menu buttons
        const buttonContainer = this.add.container(this.cameras.main.centerX, this.cameras.main.height - 100);
        
        // Restart button
        const restartButton = new Button(
            this,
            -150,
            0,
            'PLAY AGAIN',
            () => {
                this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                    if (progress === 1) {
                        this.scene.start('GameScene', { newGame: true });
                    }
                });
            },
            {
                fontSize: '24px',
                width: 200,
                height: 60,
                bgColor: 0x222255,
                hoverColor: 0x334499
            }
        );
        
        // Main menu button
        const menuButton = new Button(
            this,
            150,
            0,
            'MAIN MENU',
            () => {
                this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                    if (progress === 1) {
                        this.scene.start('MainMenuScene');
                    }
                });
            },
            {
                fontSize: '24px',
                width: 200,
                height: 60,
                bgColor: 0x222255,
                hoverColor: 0x334499
            }
        );
        
        // Add buttons to container
        buttonContainer.add(restartButton.getGameObjects());
        buttonContainer.add(menuButton.getGameObjects());
        
        // Add animated camera effects
        this.cameras.main.flash(1000, 255, 255, 255, true);
        this.cameras.main.fadeIn(1000);
        
        // Add congratulatory sound effects
        // this.sound.play('completion_fanfare'); - would need to be preloaded
    }
    
    private createGlowEffect(text: Phaser.GameObjects.Text, color: number): void {
        // Create glow effect
        const textGlow = this.add.graphics();
        textGlow.fillStyle(color, 0.2);
        const bounds = text.getBounds();
        textGlow.fillRoundedRect(
            bounds.x - 15, 
            bounds.y - 10, 
            bounds.width + 30, 
            bounds.height + 20, 
            20
        );
        textGlow.setBlendMode(Phaser.BlendModes.ADD);
        textGlow.setDepth(text.depth - 1);
    }
    
    private createParticleEmitters(): void {
        // Confetti particle emitter
        const confettiColors = [0xffff00, 0x00ffff, 0xff00ff, 0x00ff00, 0xff0000];
        
        for (const color of confettiColors) {
            const emitter = this.add.particles(0, 0, 'pixel', {
                x: { min: 0, max: this.cameras.main.width },
                y: -10,
                lifespan: 5000,
                speedY: { min: 100, max: 300 },
                speedX: { min: -20, max: 20 },
                scale: { start: 0.5, end: 1 },
                quantity: 1,
                frequency: 200,
                tint: color,
                blendMode: Phaser.BlendModes.ADD,
                angle: { min: 0, max: 360 },
                rotate: { min: 0, max: 360 }
            });
        }
        
        // Star burst effect
        this.add.particles(this.cameras.main.centerX, this.cameras.main.centerY, 'pixel', {
            lifespan: 2000,
            speedX: { min: -400, max: 400 },
            speedY: { min: -400, max: 400 },
            scale: { start: 1, end: 0 },
            quantity: 50,
            frequency: 5000,
            tint: 0xffff00,
            blendMode: Phaser.BlendModes.ADD,
            emitting: false
        }).explode(100);
    }
} 