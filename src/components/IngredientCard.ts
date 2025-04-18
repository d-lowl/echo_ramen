import Phaser from 'phaser';
import Ingredient from '../ingredients/Ingredient';
import Effect from '../attributes/Effects';

export default class IngredientCard extends Phaser.GameObjects.Container {
    private background: Phaser.GameObjects.Rectangle;
    private nameText: Phaser.GameObjects.Text;
    private effectsText: Phaser.GameObjects.Text;
    private ingredient: Ingredient;
    private index: number;
    private clickCallback: (index: number) => void;
    private initialY: number;
    
    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        ingredient: Ingredient,
        index: number,
        onClick: (index: number) => void
    ) {
        super(scene, x, y);
        
        // Validate ingredient
        if (!ingredient) {
            console.error('Attempted to create IngredientCard with undefined ingredient');
            ingredient = null;
            // Create an empty card as a fallback
            this.createEmptyCard(scene);
            return;
        }
        
        this.ingredient = ingredient;
        this.index = index;
        this.clickCallback = onClick;
        this.initialY = y;
        
        // Create card background
        this.background = scene.add.rectangle(0, 0, 140, 180, 0xdddddd, 1);
        this.background.setStrokeStyle(2, 0x333333);
        
        // Create text elements
        this.nameText = scene.add.text(0, -70, ingredient.getName(), {
            fontFamily: 'Arial',
            fontSize: '16px',
            color: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Format effects text
        const effectsStr = this.formatEffects(ingredient.getEffects());
        this.effectsText = scene.add.text(0, 0, effectsStr, {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#333333',
            align: 'center',
            wordWrap: { width: 120 }
        }).setOrigin(0.5);
        
        // Add elements to container
        this.add([this.background, this.nameText, this.effectsText]);
        
        // Make card interactive
        this.setSize(140, 180);
        this.setInteractive({ useHandCursor: true });
        
        // Add hover effects
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerdown', this.onPointerDown, this);
        
        // Add to scene
        scene.add.existing(this);
    }

    private createEmptyCard(scene: Phaser.Scene): void {
        // Create a placeholder card for when ingredient is undefined
        this.background = scene.add.rectangle(0, 0, 140, 180, 0x999999, 1);
        this.background.setStrokeStyle(2, 0x333333);
        
        this.nameText = scene.add.text(0, 0, 'Invalid Card', {
            fontFamily: 'Arial',
            fontSize: '14px',
            color: '#ff0000',
            align: 'center'
        }).setOrigin(0.5);
        
        this.add([this.background, this.nameText]);
        scene.add.existing(this);
    }
    
    private formatEffects(effects: Effect[]): string {
        if (!effects || effects.length === 0) {
            return 'No effects';
        }
        
        return effects.map(effect => {
            if (!effect) return 'Unknown effect';
            return effect.display();
        }).join('\n');
    }
    
    private onPointerOver(): void {
        if (!this.background) return;
        
        this.background.setFillStyle(0xeeeeee);
        this.scene.tweens.add({
            targets: this,
            y: this.initialY - 10,
            duration: 100
        });
    }
    
    private onPointerOut(): void {
        if (!this.background) return;
        
        this.background.setFillStyle(0xdddddd);
        this.scene.tweens.add({
            targets: this,
            y: this.initialY,
            duration: 100
        });
    }
    
    private onPointerDown(): void {
        if (this.clickCallback && this.ingredient) {
            this.clickCallback(this.index);
        }
    }
    
    public getIngredient(): Ingredient {
        return this.ingredient;
    }
} 