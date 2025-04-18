import Phaser from 'phaser';
import Button from '../components/Button';
import Request from '../attributes/Request';
import Game from '../game/Game';
import Deck from '../deck/Deck';
import { BasicIngredients } from '../ingredients/BasicIngredients';
import IngredientCard from '../components/IngredientCard';
import Ingredient from '../ingredients/Ingredient';

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
        const deck = new Deck(Object.values(BasicIngredients));
        
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
            { fontFamily: 'Arial', fontSize: '24px', color: '#00ffff' } as TextStyle
        );
        
        // Display customer request
        this.displayCustomerRequest();
        
        // Create container for hand
        this.handContainer = this.add.container(0, 0);
        
        // Display the deck
        this.createDeckVisual();
        
        // Display the recipe area
        this.createRecipeArea();
        
        // Display player's hand
        this.displayHand();
        
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
            this.cameras.main.width - 100,
            this.cameras.main.height - 50,
            'END GAME',
            () => {
                // Go to results scene with current score
                this.scene.start('ResultScene', { score: this.gameLogic.getScore() });
            }
        );
        
        // Add complete order button
        new Button(
            this,
            this.cameras.main.width - 250,
            this.cameras.main.height - 50,
            'COMPLETE ORDER',
            () => {
                const scoreEarned = this.gameLogic.completeOrder();
                console.log(`Order completed! Earned ${scoreEarned} points`);
                this.updateScore();
                this.displayCustomerRequest();
                this.updateRecipeDisplay();
                this.gameLogic.finishTurn();
                this.displayHand();
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
    
    /**
     * Create a visual representation of the deck
     */
    private createDeckVisual(): void {
        // Create a deck visual in the top left corner
        const deckX = 80;
        const deckY = 120;
        
        this.deckImage = this.add.rectangle(deckX, deckY, 100, 140, 0x333399).setStrokeStyle(2, 0xffffff);
        
        this.deckText = this.add.text(
            deckX, 
            deckY, 
            'DECK', 
            { fontFamily: 'Arial', fontSize: '18px', color: '#ffffff' } as TextStyle
        ).setOrigin(0.5);
    }
    
    /**
     * Create the recipe display area
     */
    private createRecipeArea(): void {
        // Create a recipe area on the right side
        const recipeX = this.cameras.main.width - 200;
        const recipeY = 240;
        
        this.recipeContainer = this.add.container(recipeX, recipeY);
        
        const recipeBg = this.add.rectangle(0, 0, 300, 200, 0x222244).setStrokeStyle(2, 0xcccccc);
        this.recipeText = this.add.text(
            0, 
            -80, 
            'CURRENT RECIPE', 
            { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff' } as TextStyle
        ).setOrigin(0.5);
        
        this.recipeIngredients = this.add.text(
            0, 
            0, 
            'No ingredients added yet', 
            { fontFamily: 'Arial', fontSize: '16px', color: '#cccccc', align: 'center', wordWrap: { width: 280 } } as TextStyle
        ).setOrigin(0.5);
        
        this.recipeContainer.add([recipeBg, this.recipeText, this.recipeIngredients]);
    }
    
    /**
     * Display the player's hand of ingredients
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
        
        // Position variables
        const startX = 140;
        const endX = this.cameras.main.width - 140;
        const cardSpacing = (endX - startX) / Math.max(8, hand.length - 1);
        const y = this.cameras.main.height - 100;
        
        // Create a card for each ingredient in hand
        hand.forEach((ingredient, index) => {
            // Skip undefined ingredients
            if (!ingredient) {
                console.warn(`Undefined ingredient at index ${index}`);
                return;
            }
            
            const x = startX + index * cardSpacing;
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
        for (const key in attributes) {
            attributeText += `${key}: ${attributes[key].value}\n`;
        }
        
        // Create or update attributes text display
        if (this.recipeContainer.getByName('attributes')) {
            (this.recipeContainer.getByName('attributes') as Phaser.GameObjects.Text).setText(attributeText);
        } else {
            const attributesText = this.add.text(
                0, 
                60, 
                attributeText, 
                { fontFamily: 'Arial', fontSize: '14px', color: '#ffffff', align: 'center' } as TextStyle
            ).setOrigin(0.5).setName('attributes');
            
            this.recipeContainer.add(attributesText);
        }
    }
} 