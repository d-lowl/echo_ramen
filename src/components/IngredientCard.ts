import Phaser from 'phaser';
import Ingredient from '../ingredients/Ingredient';
import Effect from '../attributes/Effects';

export default class IngredientCard extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private innerBg: Phaser.GameObjects.Rectangle;
    private nameText: Phaser.GameObjects.Text;
    private effectsTexts: Phaser.GameObjects.Text[] = [];
    private ingredient: Ingredient;
    private index: number;
    private clickCallback: (index: number) => void;
    private initialY: number;
    private glow: Phaser.GameObjects.Rectangle;
    
    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        ingredient: Ingredient,
        index: number,
        onClick: (index: number) => void
    ) {
        super(scene, x, y);

        const cardWidth = 130;
        const cardHeight = 130;
        
        this.ingredient = ingredient;
        this.index = index;
        this.clickCallback = onClick;
        this.initialY = y;
        
        // Create glow effect
        this.glow = scene.add.rectangle(0, 0, cardWidth + 10, cardHeight + 10, 0xffffff, 0.2)
            .setVisible(false)
            .setBlendMode(Phaser.BlendModes.ADD);
            
        // Create card background with border
        this.background = scene.add.rectangle(0, 0, cardWidth, cardHeight, 0xffffff, 1)
            .setStrokeStyle(2, 0xffffff);
        
        // Create inner background with gradient effect
        this.innerBg = scene.add.rectangle(0, 0, cardWidth - 4, cardHeight - 4, 0x222244, 1);
        
        // Create name with more stylish text
        this.nameText = scene.add.text(0, -cardHeight/2 + 15, ingredient.getName(), {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1,
            wordWrap: { width: cardWidth - 20 }
        }).setOrigin(0.5, 0);
        
        // Get effects from ingredient
        const effects = ingredient.getEffects();
        const effectCount = effects.length;
        let yPos = cardHeight/2 - effectCount * 20;
        
        // Create effect texts with proper formatting
        effects.forEach(effect => {
            const effectDisplay = effect.display();
            const [name, value] = this.parseEffectDisplay(effectDisplay);
            
            const effectText = scene.add.text(
                0, 
                yPos, 
                effectDisplay, 
                {
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    color: this.getEffectColor(name),
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 1
                }
            ).setOrigin(0.5);
            
            this.effectsTexts.push(effectText);
            yPos += 20;
        });
        
        // Add elements to container
        this.add([this.glow, this.background, this.innerBg, this.nameText, ...this.effectsTexts]);
        
        // Make card interactive
        this.setSize(cardWidth, cardHeight);
        this.setInteractive({ useHandCursor: true });
        
        // Add hover effects
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerdown', this.onPointerDown, this);
        
        // Add to scene
        scene.add.existing(this);
    }
    
    private parseEffectDisplay(effectDisplay: string): [string, number] {
        // Parse effect display strings like "Richness 2" into [attribute, value]
        const parts = effectDisplay.split(' ');
        if (parts.length >= 2 && !isNaN(Number(parts[parts.length - 1]))) {
            return [parts[0], Number(parts[parts.length - 1])];
        }
        return [effectDisplay, 0];
    }
    
    private getEffectColor(effectName: string): string {
        // Color mapping for different attributes
        const colors: {[key: string]: string} = {
            'Savory': '#ffc857',
            'Spiciness': '#ff5757',
            'Sweetness': '#ff9eee',
            'Richness': '#ffcc00',
            'Lightness': '#00ffff',
            'Mildness': '#9eebcf',
            'Amplify': '#ffaa00',
            'Balance': '#00ff99',
            'Neutralize': '#aa88ff'
        };
        
        return colors[effectName] || '#ffffff';
    }
    
    private onPointerOver(): void {
        if (!this.background) return;
        
        // Show glow effect
        this.glow.setVisible(true);
        
        // Scale up and lift card
        this.scene.tweens.add({
            targets: this,
            y: this.initialY - 15,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 150,
            ease: 'Sine.easeOut'
        });
        
        // Pulse glow effect
        this.scene.tweens.add({
            targets: this.glow,
            alpha: 0.4,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Highlight border
        this.background.setStrokeStyle(2, 0x00ffff);
    }
    
    private onPointerOut(): void {
        if (!this.background) return;
        
        // Hide glow
        this.glow.setVisible(false);
        this.scene.tweens.killTweensOf(this.glow);
        
        // Return to original position and scale
        this.scene.tweens.add({
            targets: this,
            y: this.initialY,
            scaleX: 1,
            scaleY: 1,
            duration: 150,
            ease: 'Sine.easeIn'
        });
        
        // Reset border
        this.background.setStrokeStyle(2, 0xffffff);
    }
    
    private onPointerDown(): void {
        if (this.clickCallback && this.ingredient) {
            // Flash effect when clicked
            this.scene.tweens.add({
                targets: this.background,
                fillAlpha: 0.8,
                yoyo: true,
                duration: 100
            });
            
            this.clickCallback(this.index);
        }
    }
    
    public getIngredient(): Ingredient {
        return this.ingredient;
    }
} 