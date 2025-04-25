import Phaser from 'phaser';
import Button from '../components/Button';
import ProgressionManager, { FloorData } from '../managers/ProgressionManager';

export default class FloorTransitionScene extends Phaser.Scene {
    private floorData: FloorData;
    private transitionComplete: boolean = false;
    
    constructor() {
        super({ key: 'FloorTransitionScene' });
    }
    
    init(): void {
        // Get progression manager from registry
        const progressionManager = this.game.registry.get('progressionManager') as ProgressionManager;
        
        if (!progressionManager) {
            console.error('ProgressionManager not found in registry');
            // We need to have a fallback to avoid crashing
            this.floorData = {
                floorNumber: 1,
                difficulty: 1,
                isBossFloor: false,
                totalCustomers: 2,
                currentCustomer: 1
            };
        } else {
            // Get latest floor data from progression manager
            this.floorData = progressionManager.getCurrentFloorData();
        }
        
        this.transitionComplete = false;
    }
    
    create(): void {
        // Cyberpunk themed background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add neon grid effect
        this.createNeonGrid();
        
        // Floor title with neon effect
        const floorType = this.floorData.isBossFloor ? 'BOSS FLOOR' : 'FLOOR';
        const floorTitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            `${floorType} ${this.floorData.floorNumber}`,
            {
                fontFamily: 'Arial',
                fontSize: '64px',
                color: this.floorData.isBossFloor ? '#ff0055' : '#00ffff',
                stroke: '#000000',
                strokeThickness: 5
            }
        ).setOrigin(0.5);
        
        // Add glow effect to text
        const glowColor = this.floorData.isBossFloor ? 0xff0055 : 0x00ffff;
        this.addGlowEffect(floorTitle, glowColor);
        
        // Difficulty level
        const difficultyText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `Difficulty: ${this.floorData.difficulty}`,
            {
                fontFamily: 'Arial',
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Customer count
        const customerText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 50,
            `Customers: ${this.floorData.totalCustomers}`,
            {
                fontFamily: 'Arial',
                fontSize: '28px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Special text for boss floor
        if (this.floorData.isBossFloor) {
            const bossText = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + 100,
                'DEFEAT THE BOSSES TO COMPLETE THE GAME',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#ff5555',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            ).setOrigin(0.5);
            
            this.addGlowEffect(bossText, 0xff5555);
        }
        
        // Continue button
        const continueButton = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.height - 100,
            'CONTINUE',
            () => {
                if (!this.transitionComplete) {
                    this.transitionComplete = true;
                    this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                        if (progress === 1) {
                            // Get the latest floor data from ProgressionManager instead of cloning
                            // and manually modifying the data we received
                            const progressionManager = this.game.registry.get('progressionManager');
                            if (progressionManager) {
                                // Start GameScene with fresh data from ProgressionManager
                                this.scene.start('GameScene', { 
                                    fromFloorTransition: true
                                });
                            } else {
                                console.error('ProgressionManager not found in registry');
                            }
                        }
                    });
                }
            },
            {
                fontSize: '32px',
                width: 280,
                height: 70,
                bgColor: 0x222255,
                hoverColor: 0x334499,
                stroke: '#ffffff',
                strokeThickness: 2
            }
        );
        
        // Add button to scene
        const buttonObjects = continueButton.getGameObjects();
        this.add.existing(buttonObjects[0]);
        this.add.existing(buttonObjects[1]);
        
        // Fade in effect
        this.cameras.main.fadeIn(1000);
        
        // Add animated particles for visual effect
        this.addParticleEffects();
    }
    
    private createNeonGrid(): void {
        const gridSize = 50;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x00ffff, 0.3);
        
        // Draw horizontal lines
        for (let y = 0; y < height; y += gridSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        // Draw vertical lines
        for (let x = 0; x < width; x += gridSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        gridGraphics.strokePath();
    }
    
    private addGlowEffect(text: Phaser.GameObjects.Text, color: number): void {
        const textGlow = this.add.graphics();
        textGlow.fillStyle(color, 0.2);
        const bounds = text.getBounds();
        textGlow.fillRoundedRect(
            bounds.x - 20, 
            bounds.y - 10, 
            bounds.width + 40, 
            bounds.height + 20, 
            20
        );
        textGlow.setBlendMode(Phaser.BlendModes.ADD);
        textGlow.setDepth(text.depth - 1);
    }
    
    private addParticleEffects(): void {
        const particles = this.add.particles(0, 0, 'pixel', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            lifespan: 3000,
            blendMode: Phaser.BlendModes.ADD,
            tint: this.floorData.isBossFloor ? 0xff0055 : 0x00ffff,
            frequency: 100,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, this.cameras.main.width, this.cameras.main.height),
                quantity: 50
            }
        });
    }
} 