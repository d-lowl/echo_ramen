import Phaser from 'phaser';
import Button from '../components/Button';
import Game from '../game/Game';
import IngredientCard from '../components/IngredientCard';
import Ingredient from '../ingredients/Ingredient';
import { getPrebuiltDeck } from "../deck/PrebuiltDecks";

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
    private viewDeckButton: Button;
    private requestText: Phaser.GameObjects.Text;
    private handContainer: Phaser.GameObjects.Container;
    private deckImage: Phaser.GameObjects.Rectangle;
    private deckText: Phaser.GameObjects.Text;
    private recipeContainer: Phaser.GameObjects.Container;
    private recipeText: Phaser.GameObjects.Text;
    private recipeIngredients: Phaser.GameObjects.Text;
    
    constructor() {
        super('GameScene');
    }

    init(data: GameData): void {
        // Initialize the game with passed difficulty
        const difficultyLevel = data.difficulty === 'hard' ? 3 : 
                              data.difficulty === 'medium' ? 2 : 1;
        
        // Create deck with all basic ingredients
        const deck = getPrebuiltDeck("basic")
        
        // Initialize game logic
        this.gameLogic = new Game(deck, difficultyLevel);
    }

    preload(): void {
        // No assets to load for now
    }

    create(): void {
        // Set background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add score display
        this.scoreText = this.add.text(
            20, 
            20, 
            `SCORE: ${this.gameLogic.getScore()}`, 
            { fontFamily: 'Arial', fontSize: '32px', color: '#00ffff', stroke: '#000000', strokeThickness: 3 } as TextStyle
        );
        
        // Display customer request
        this.displayCustomerRequest();
        
        // Create container for hand
        this.handContainer = this.add.container(0, 0);
        
        // Display the recipe area
        this.createRecipeArea();
        
        // Display player's hand
        this.displayHand();
        
        // Create button container for game control buttons - moved to bottom left
        const buttonContainer = this.add.container(180, this.cameras.main.height - 100);
        
        // Add complete order button
        const completeOrderButton = new Button(
            this,
            0,
            0,
            'COMPLETE ORDER',
            () => {
                const scoreEarned = this.gameLogic.completeOrder();
                console.log(`Order completed! Earned ${scoreEarned} points`);
                this.updateScore();
                this.displayCustomerRequest();
                this.updateRecipeDisplay();
                this.gameLogic.finishTurn();
                this.displayHand();
            },
            { 
                fontSize: '28px', 
                width: 320, 
                height: 80, 
                bgColor: 0x222255, 
                hoverColor: 0x334499,
                stroke: '#ff00ff',
                strokeThickness: 2,
                shadow: {
                    offsetX: 3,
                    offsetY: 3,
                    color: '#000000',
                    blur: 5,
                    stroke: true,
                    fill: true
                }
            }
        );
        
        // Add both the background rectangle and text from the button to the container
        buttonContainer.add(completeOrderButton.getGameObjects());
        
        // Add a decorative neon border around the button
        const borderWidth = 360;
        const borderHeight = 120;
        const border = this.add.rectangle(0, 0, borderWidth, borderHeight, 0x000000, 0)
            .setStrokeStyle(2, 0xff00ff)
            .setOrigin(0.5);
            
        // Add border glow effect
        const borderGlow = this.add.rectangle(0, 0, borderWidth, borderHeight, 0xff00ff, 0.1)
            .setOrigin(0.5)
            .setBlendMode(Phaser.BlendModes.ADD);
            
        // Place the border and glow behind the button
        borderGlow.setDepth(0);
        border.setDepth(1);
        
        buttonContainer.add([borderGlow, border]);
        
        // Add "View Deck" button
        this.viewDeckButton = new Button(
            this,
            this.cameras.main.width - 120,
            80,
            'VIEW DECK',
            () => {
                // Launch the ViewDeckScene
                this.scene.launch('ViewDeckScene', { deck: this.gameLogic.deck });
            },
            {
                fontSize: '20px',
                width: 160,
                height: 50,
                bgColor: 0x222255,
                hoverColor: 0x334499
            }
        );
        
        // Add button to scene
        const viewDeckButtonObjects = this.viewDeckButton.getGameObjects();
        this.add.existing(viewDeckButtonObjects[0]);
        this.add.existing(viewDeckButtonObjects[1]);
    }

    update(): void {
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
        const requestString = `CUSTOMER REQUEST:\n${request.getDescription()}`;
        
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
                    fontSize: '28px', 
                    color: '#ffcc00',
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 2,
                    shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
                } as TextStyle
            ).setOrigin(0.5);
        }
    }
    
    /**
     * Create the recipe display area
     */
    private createRecipeArea(): void {
        // Create a recipe area on the left side
        const recipeX = 200;
        const recipeY = 280;
        const recipeWidth = 300;
        const recipeHeight = 150;
        
        this.recipeContainer = this.add.container(recipeX, recipeY);
        
        const recipeBg = this.add.rectangle(0, 0, recipeWidth, recipeHeight, 0x222244)
            .setStrokeStyle(3, 0x00ffff)
            .setAlpha(0.9);
            
        this.recipeText = this.add.text(
            0, 
            -100, 
            'CURRENT RECIPE', 
            { 
                fontFamily: 'Arial', 
                fontSize: '24px', 
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 1
            } as TextStyle
        ).setOrigin(0.5);
        
        this.recipeIngredients = this.add.text(
            0, 
            -60, 
            'No ingredients added yet', 
            { 
                fontFamily: 'Arial', 
                fontSize: '16px', 
                color: '#cccccc', 
                align: 'center',
                wordWrap: { width: 280 }
            } as TextStyle
        ).setOrigin(0.5, 0); // Changed to align to top by setting y origin to 0
        
        this.recipeContainer.add([recipeBg, this.recipeText, this.recipeIngredients]);
        this.updateRecipeDisplay();
    }
    
    /**
     * Display the player's hand of ingredients in a 9x9 grid on the right side
     */
    private displayHand(): void {
        // Clear any existing cards
        this.handContainer.removeAll(true);
        
        // Get the player's hand
        const hand = this.gameLogic.getHand();
        
        // Check if hand exists and has items
        if (!hand || hand.length === 0) {
            console.warn('Hand is empty or undefined');
            return;
        }
        
        // Position variables for 9x9 grid layout on right side
        const cardWidth = 140;
        const cardHeight = 140;
        const margin = 20;
        const gridStartX = this.cameras.main.width - (cardWidth * 3) - margin;
        const gridStartY = cardHeight;
        const gridCols = 3;
        const gridRows = 3;

        console.log('Hand:', hand);
        
        // Create a card for each ingredient in hand
        hand.forEach((ingredient, index) => {
            // Skip undefined ingredients
            if (!ingredient) {
                console.warn(`Undefined ingredient at index ${index}`);
                return;
            }
            
            // Calculate grid position
            const col = index % gridCols;
            const row = Math.floor(index / gridCols) % gridRows;
            
            // Calculate actual position
            const x = gridStartX + (col * cardWidth) + (cardWidth / 2);
            const y = gridStartY + (row * cardHeight) + (cardHeight / 2);
            
            const card = new IngredientCard(
                this,
                x,
                y,
                ingredient,
                index,
                this.onCardClick.bind(this)
            );
            
            this.handContainer.add(card);
        });
    }
    
    /**
     * Handle card click event
     */
    private onCardClick(index: number): void {
        console.log(`Playing ingredient at index ${index}`);
        this.gameLogic.playIngredient(index);
        this.displayHand();
        this.updateRecipeDisplay();
        
        // Add visual effect for playing card
        this.addPlayedCardEffect();
    }
    
    /**
     * Add visual effect when a card is played
     */
    private addPlayedCardEffect(): void {
        const x = this.cameras.main.centerX;
        const y = this.cameras.main.centerY;
        
        const effect = this.add.rectangle(x, y, 50, 50, 0x00ff00, 0.5)
            .setAlpha(0);
        
        this.tweens.add({
            targets: effect,
            alpha: 0.8,
            scale: 2,
            duration: 300,
            yoyo: true,
            onComplete: () => {
                effect.destroy();
            }
        });
    }
    
    /**
     * Update the recipe display with current ingredients
     */
    private updateRecipeDisplay(): void {
        const recipe = this.gameLogic.getCurrentRecipe();
        const ingredients = this.gameLogic.getCurrentRecipe()['ingredients'] as Ingredient[];
        
        if (ingredients && ingredients.length > 0) {
            const ingredientNames = ingredients.map(ing => ing.getName()).join(', ');
            this.recipeIngredients.setText(ingredientNames);
        } else {
            this.recipeIngredients.setText('No ingredients added yet');
        }
        
        // Display recipe attributes
        const attributes = recipe.attributes;
        let attributeText = '';
        
        // Create properly formatted attribute table with even spacing
        const nameWidth = 10; // Width for attribute name column
        const valueWidth = 2;  // Width for value columns
        
        for (const attribute of Object.values(attributes)) {
          const leftValue = attribute.value > 0 ? attribute.value : 0;
          const rightValue = attribute.value < 0 ? -attribute.value : 0;
          
          // Format each value with padding to ensure alignment
          const name = attribute.name.padStart(nameWidth, ' ');
          const left = leftValue.toString().padStart(valueWidth, ' ');
          const right = rightValue.toString().padEnd(valueWidth, ' ');
          const opposite = attribute.getOppositeName();
          
          attributeText += `${name} - ${left} | ${right} - ${opposite}\n`;
        }
        
        // Create or update attributes text display
        if (this.recipeContainer.getByName('attributes')) {
            (this.recipeContainer.getByName('attributes') as Phaser.GameObjects.Text).setText(attributeText);
        } else {
            const attributesText = this.add.text(
                0, 
                50, 
                attributeText, 
                { 
                    fontFamily: 'monospace', // Using monospace font ensures equal character width
                    fontSize: '14px', 
                    color: '#ffffff', 
                    align: 'left' 
                } as TextStyle
            ).setOrigin(0.5).setName('attributes');
            
            this.recipeContainer.add(attributesText);
        }
    }
} 