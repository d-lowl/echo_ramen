import Phaser from 'phaser';
import Button from '../components/Button';
import Game from '../game/Game';
import IngredientCard from '../components/IngredientCard';
import Ingredient from '../ingredients/Ingredient';
import { getPrebuiltDeck } from "../deck/PrebuiltDecks";
import AudioManager from '../managers/AudioManager';
import SatisfactionManager, { SatisfactionLevel } from '../managers/SatisfactionManager';
import SatisfactionUI from '../components/SatisfactionUI';
import ProgressionManager, { FloorData, ProgressionEvent } from '../managers/ProgressionManager';
import ProgressionUI from '../components/ProgressionUI';

interface GameData {
    difficulty?: string;
    floorData?: FloorData;
    fromFloorTransition?: boolean;
    newGame?: boolean;
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
    private audioManager: AudioManager;
    private satisfactionUI: SatisfactionUI;
    private progressionManager: ProgressionManager;
    private progressionUI: ProgressionUI;
    private totalCustomersServed: number = 0;
    private waitingForNextCustomer: boolean = false;
    
    constructor() {
        super('GameScene');
    }

    init(data: GameData): void {
        // Reset game state if starting new game
        if (data.newGame) {
            this.totalCustomersServed = 0;
        }
        
        // Initialize the game with passed difficulty or default to 1
        const difficultyLevel = data.difficulty === 'hard' ? 3 : 
                              data.difficulty === 'medium' ? 2 : 1;
        
        // Create deck with all basic ingredients
        const deck = getPrebuiltDeck("basic");
        
        // Check if this is a floor transition
        if (data.fromFloorTransition) {
            // Coming from floor transition - try to get the existing game instance from registry
            const progressionManager = this.game.registry.get('progressionManager') as ProgressionManager;
            if (progressionManager) {
                // Preserve the existing Game instance to maintain score
                this.gameLogic = progressionManager.getGameInstance();
                
                // Update difficulty but preserve the score
                this.gameLogic.setDifficulty(difficultyLevel);
            } else {
                // Fallback - create new game logic
                this.gameLogic = new Game(deck, difficultyLevel);
            }
        } else {
            // Fresh start - create new game logic
            this.gameLogic = new Game(deck, difficultyLevel);
        }
        
        // If not coming from floor transition, we need to reset/initialize progression
        this.waitingForNextCustomer = false;
        
        // Clear existing UI elements to prevent stale references
        this.requestText = null;
    }

    preload(): void {
        // Initialize and preload audio
        this.audioManager = new AudioManager(this);
        this.audioManager.preload();
        
        // Create a pixel texture for particles if it doesn't exist
        if (!this.textures.exists('pixel')) {
            const graphics = this.make.graphics({ x: 0, y: 0 });
            graphics.fillStyle(0xffffff);
            graphics.fillRect(0, 0, 2, 2);
            graphics.generateTexture('pixel', 2, 2);
            graphics.destroy();
        }

        // Create a scan line texture
        if (!this.textures.exists('scanline')) {
            const scanGraphics = this.make.graphics({ x: 0, y: 0 });
            scanGraphics.fillStyle(0xffffff);
            scanGraphics.fillRect(0, 0, 800, 1);
            scanGraphics.generateTexture('scanline', 800, 1);
            scanGraphics.destroy();
        }
    }

    create(data: GameData): void {
        // Set background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x0a0a1e).setOrigin(0);
        
        // Add cyberpunk grid shader effect
        this.createCyberpunkBackgroundEffect();
        
        // Add scan lines overlay
        this.createScanLinesEffect();
        
        // Initialize audio
        this.audioManager.create();
        
        // Create progression manager if it doesn't exist or get it from registry if it does
        if (!this.progressionManager) {
            if (data.fromFloorTransition) {
                // Coming from floor transition, get the existing progression manager
                this.progressionManager = this.game.registry.get('progressionManager');
                if (!this.progressionManager) {
                    console.error('ProgressionManager not found in registry after floor transition');
                    // Create a new one as fallback
                    this.progressionManager = new ProgressionManager(this, this.gameLogic);
                } else {
                    // Make sure the progression manager has a reference to our game logic
                    // This is needed to preserve the score between floors
                    if (this.gameLogic !== this.progressionManager.getGameInstance()) {
                        // We have a new game logic instance, update the progression manager
                        this.progressionManager = new ProgressionManager(this, this.gameLogic);
                        this.game.registry.set('progressionManager', this.progressionManager);
                    }
                }
            } else {
                // Starting fresh, create a new progression manager
                this.progressionManager = new ProgressionManager(this, this.gameLogic);
            }
            
            // Store in registry for other scenes to access
            this.game.registry.set('progressionManager', this.progressionManager);
        }
        
        // Get current floor data
        const floorData = this.progressionManager.getCurrentFloorData();
        
        // Set game difficulty based on current floor
        this.gameLogic.setDifficulty(floorData.difficulty);
        
        // Generate appropriate customer request
        const isBossCustomer = this.progressionManager.isCurrentCustomerBoss();
        this.gameLogic.generateNewRequest(isBossCustomer);
        
        // Start background music
        if (floorData.floorNumber === 1) {
            this.audioManager.playMusic(2000);
        }
        
        // Create progression UI
        this.progressionUI = new ProgressionUI(
            this,
            this.cameras.main.width - 150,
            60,
            floorData
        );
        
        // Setup progression event listeners
        this.setupProgressionEvents();
        
        // Create satisfaction UI (centered and slightly above center)
        this.satisfactionUI = new SatisfactionUI(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100
        );
        
        // Add score display
        this.scoreText = this.add.text(
            20, 
            20, 
            `SCORE: ${this.gameLogic.getScore()}`, 
            { fontFamily: 'Arial', fontSize: '32px', color: '#00ffff', stroke: '#000000', strokeThickness: 3 } as TextStyle
        );
        
        // Add neon glow effect to score
        this.addNeonGlowEffect(this.scoreText);
        
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
              if (this.waitingForNextCustomer) return;
              
              // Get order result with details
              const result = this.gameLogic.completeOrder();
              console.log(`Order completed! Earned ${result.scoreEarned} points, Match: ${result.matchPercentage}%`);
              
              // Increment total customers served
              this.totalCustomersServed++;
              
              // Determine satisfaction level
              const satisfactionLevel = SatisfactionManager.getSatisfactionLevel(result.matchPercentage);
              
              // Get feedback message
              const feedbackMessage = SatisfactionManager.getFeedbackMessage(
                  satisfactionLevel,
                  result.details
              );
              
              // Display satisfaction feedback
              this.showSatisfactionFeedback(
                  satisfactionLevel,
                  feedbackMessage,
                  result.matchPercentage
              );
              
              // Prevent clicking during transition
              this.waitingForNextCustomer = true;
              
              // Update UI after a delay
              this.time.delayedCall(3000, () => {
                  this.satisfactionUI.hide();
                  this.updateScore();
                  this.progressionManager.nextCustomer();
                  this.updateRecipeDisplay();
                  this.gameLogic.finishTurn();
                  this.displayHand();
                  this.waitingForNextCustomer = false;
              });
            },
            { 
                fontSize: '28px', 
                width: 320, 
                height: 80, 
                bgColor: 0x222255, 
                hoverColor: 0x334499,
                stroke: '#ff00ff',
                strokeThickness: 2,
                color: '#00ffff',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 3,
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
            110,
            110,
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
                hoverColor: 0x334499,
                stroke: '#ff00ff',
                strokeThickness: 2,
                color: '#00ffff',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#000000',
                    blur: 3,
                    stroke: true,
                    fill: true
                }
            }
        );
        
        // Add button to scene
        const viewDeckButtonObjects = this.viewDeckButton.getGameObjects();
        this.add.existing(viewDeckButtonObjects[0]);
        this.add.existing(viewDeckButtonObjects[1]);

        // Update initial boss state if needed
        if (this.progressionManager.isCurrentCustomerBoss()) {
            this.gameLogic.setCurrentCustomerAsBoss(true);
            this.displayCustomerRequest();
        }
    }

    private setupProgressionEvents(): void {
        // Handle new customer event
        this.progressionManager.on(ProgressionEvent.NEW_CUSTOMER, (data: any) => {
            // Update UI
            this.progressionUI.update(this.progressionManager.getCurrentFloorData());
            
            // Set boss state if needed
            this.gameLogic.setCurrentCustomerAsBoss(data.isBoss);
            
            // Update customer request display
            this.displayCustomerRequest();
        });
        
        // Handle floor completion
        this.progressionManager.on(ProgressionEvent.FLOOR_COMPLETE, (data: any) => {
            // Just fade out - no need to switch music since we're using one track
            this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                if (progress === 1) {
                    // Don't need to pass floor data since FloorTransitionScene will get it from the registry
                    this.scene.start('FloorTransitionScene');
                }
            });
        });
        
        // Handle game completion
        this.progressionManager.on(ProgressionEvent.GAME_COMPLETE, (data: any) => {
            // Transition to game completion scene
            this.cameras.main.fadeOut(500, 0, 0, 0, (camera, progress) => {
                if (progress === 1) {
                    this.scene.start('GameCompletionScene', {
                        score: this.gameLogic.getScore(),
                        totalCustomers: this.totalCustomersServed
                    });
                }
            });
        });
    }

    update(): void {
    }
    
    /**
     * Update the score display
     */
    private updateScore(): void {
        // Update score display
        if (this.scoreText) {
            this.scoreText.setText(`SCORE: ${this.gameLogic.getScore()}`);
        }
        
        // Add glitch effect to score when it updates
        this.addGlitchEffect(this.scoreText);
    }
    
    /**
     * Adds a brief digital glitch effect to a text object
     */
    private addGlitchEffect(target: Phaser.GameObjects.Text): void {
        // Store original position and text
        const originalX = target.x;
        const originalText = target.text;
        const originalColor = target.style.color;
        // Play glitch sound effect
        this.audioManager.play('glitch');
        
        // First glitch - position shift
        this.tweens.add({
            targets: target,
            x: originalX + Phaser.Math.Between(-5, 5),
            duration: 50,
            yoyo: true,
            onComplete: () => {
                // Corrupt text with random characters
                const corruptedText = originalText.split('').map(char => {
                    return Math.random() > 0.7 ? 
                        String.fromCharCode(Phaser.Math.Between(33, 126)) : char;
                }).join('');
                target.setText(corruptedText);
                target.setColor('#ff00ff');
                
                // Wait a bit then restore text
                this.time.delayedCall(50, () => {
                    // Restore original text
                    target.setText(originalText);
                    target.setColor(originalColor);
                    
                    // Second glitch - position shift
                    this.tweens.add({
                        targets: target,
                        x: originalX + Phaser.Math.Between(-3, 3),
                        duration: 30,
                        yoyo: true
                    });
                });
            }
        });
    }
    
    /**
     * Display the current customer request on screen
     */
    private displayCustomerRequest(): void {
        const request = this.gameLogic.getCurrentRequest();
        
        // Safety check - ensure we have a valid request
        if (!request) {
            console.warn('No valid customer request found');
            return;
        }
        
        // Get request description with safety check
        let requestDescription;
        try {
            requestDescription = request.getDescription();
        } catch (error) {
            console.error('Error getting request description:', error);
            requestDescription = 'Customer Request';
        }
        
        // Check if we need to create the request text
        if (!this.requestText) {
            this.requestText = this.add.text(
                this.cameras.main.centerX-40,
                20,
                `Customer Request:\n${requestDescription}`,
                { 
                    fontFamily: 'Arial', 
                    fontSize: '28px', 
                    color: '#00ffff',
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 2,
                    shadow: { offsetX: 2, offsetY: 2, color: '#000000', blur: 2, stroke: true, fill: true }
                } as TextStyle
            ).setOrigin(0.5, 0.0);
        } else {
            // Update existing text
            this.requestText.setText(`Customer Request:\n${requestDescription}`);
        }
        
        // Highlight boss requests with red text
        if (this.gameLogic.isCurrentCustomerBoss()) {
            this.requestText.setColor('#ff5555');
        } else {
            this.requestText.setColor('#00ffff');
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
            .setStrokeStyle(3, 0xff00ff)
            .setAlpha(0.9);
            
        this.recipeText = this.add.text(
            0, 
            -100, 
            'CURRENT RECIPE', 
            { 
                fontFamily: 'Arial', 
                fontSize: '24px', 
                color: '#00ffff',
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
                color: '#ffffff', 
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
        
        // Create explosion particle effect
        const particles = this.add.particles(x, y, 'pixel', {
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            lifespan: 800,
            blendMode: Phaser.BlendModes.ADD,
            tint: [ 0x00ffff, 0xff00ff, 0xffff00 ],
            quantity: 30,
            gravityY: 200
        });
        
        // Emit particles once then destroy the emitter
        particles.explode();
        
        // Add a ripple effect
        const ripple = this.add.circle(x, y, 5, 0x00ffff, 0.7);
        ripple.setStrokeStyle(2, 0xff00ff);
        
        // Scale and fade the ripple
        this.tweens.add({
            targets: ripple,
            radius: 100,
            alpha: 0,
            duration: 600,
            ease: 'Quad.easeOut',
            onComplete: () => {
                ripple.destroy();
            }
        });
        
        // Play a sound effect
        this.audioManager.play('add_ingredient');
        
        // Flash the recipe container
        const recipeGlow = this.add.rectangle(
            this.recipeContainer.x, 
            this.recipeContainer.y, 
            310, 
            160, 
            0xff00ff, 
            0.4
        );
        recipeGlow.setBlendMode(Phaser.BlendModes.ADD);
        
        // Animate the recipe glow
        this.tweens.add({
            targets: recipeGlow,
            alpha: 0,
            duration: 500,
            ease: 'Quad.easeOut',
            onComplete: () => {
                recipeGlow.destroy();
            }
        });
        
        // Create data lines effect (connecting particles to recipe)
        this.createDataLinesEffect(x, y, this.recipeContainer.x, this.recipeContainer.y);
    }
    
    /**
     * Create "data transfer" effect with moving particles along a line
     */
    private createDataLinesEffect(startX: number, startY: number, endX: number, endY: number): void {
        // Calculate the angle between start and end points
        const angle = Phaser.Math.Angle.Between(startX, startY, endX, endY);
        
        // Create straight line of particles from card to recipe
        for (let i = 0; i < 20; i++) {
            // Create individual particles along the line
            const t = i / 20;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            
            // Delay each particle slightly for sequence effect
            this.time.delayedCall(i * 15, () => {
                const particle = this.add.particles(x, y, 'pixel', {
                    scale: { start: 0.8, end: 0.1 },
                    alpha: { start: 1, end: 0 },
                    tint: 0x00ffff,
                    lifespan: 300,
                    quantity: 1,
                    frequency: 1000,
                    blendMode: Phaser.BlendModes.ADD
                });
                
                // Clean up particle after animation
                this.time.delayedCall(400, () => {
                    particle.destroy();
                });
            });
        }
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
                    color: '#00ffff', 
                    align: 'left',
                    stroke: '#000000',
                    strokeThickness: 1
                } as TextStyle
            ).setOrigin(0.5).setName('attributes');
            
            this.recipeContainer.add(attributesText);
        }
    }

    /**
     * Show satisfaction feedback with visual and audio effects
     */
    private showSatisfactionFeedback(
        level: SatisfactionLevel, 
        message: string, 
        matchPercentage: number
    ): void {
        // Display visual feedback
        this.satisfactionUI.display(level, message, matchPercentage);
        this.satisfactionUI.setDepth(1000); // Use high depth value to ensure it's on top
        
        // Play audio feedback
        this.audioManager.play(`satisfaction-${level}`);
        
        // Add visual effect based on satisfaction level
        const colors = {
            'ecstatic': 0x00ff00,
            'satisfied': 0x99ff00,
            'neutral': 0xffcc00,
            'dissatisfied': 0xff6600,
            'disgusted': 0xff0000
        };
        
        // Create a flash effect
        const flash = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            colors[level],
            0.3
        ).setAlpha(0);
        
        // Animate the flash
        this.tweens.add({
            targets: flash,
            alpha: { from: 0, to: 0.3 },
            yoyo: true,
            duration: 500,
            onComplete: () => {
                flash.destroy();
            }
        });
    }

    /**
     * Create a cyberpunk-styled background with animated grid and glow effects
     */
    private createCyberpunkBackgroundEffect(): void {
        // Add a subtle grid pattern
        const gridGraphics = this.add.graphics();
        gridGraphics.lineStyle(1, 0x00ffff, 0.2);
        
        const cellSize = 40;
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Draw vertical lines
        for (let x = 0; x <= width; x += cellSize) {
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, height);
        }
        
        // Draw horizontal lines
        for (let y = 0; y <= height; y += cellSize) {
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(width, y);
        }
        
        gridGraphics.strokePath();
        
        // Add ambient particles
        this.createAmbientParticles();
        
        // Animate grid with periodic pulse
        this.tweens.add({
            targets: gridGraphics,
            alpha: 0.1,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    /**
     * Create ambient cyberpunk particles floating in the background
     */
    private createAmbientParticles(): void {
        // Create particle emitter for cyan particles
        const cyanParticles = this.add.particles(0, 0, 'pixel', {
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            scale: { start: 0.5, end: 0 },
            speed: { min: 10, max: 50 },
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.ADD,
            tint: 0x00ffff,
            lifespan: 4000,
            gravityY: -10,
            frequency: 200,
            alpha: { start: 0.6, end: 0 },
        });
        
        // Create particle emitter for magenta particles
        const magentaParticles = this.add.particles(0, 0, 'pixel', {
            x: { min: 0, max: this.cameras.main.width },
            y: { min: 0, max: this.cameras.main.height },
            scale: { start: 0.5, end: 0 },
            speed: { min: 10, max: 50 },
            angle: { min: 0, max: 360 },
            blendMode: Phaser.BlendModes.ADD,
            tint: 0xff00ff,
            lifespan: 4000,
            gravityY: -10,
            frequency: 300,
            alpha: { start: 0.6, end: 0 },
        });
        
        // Set depth to ensure they appear behind other elements
        cyanParticles.setDepth(-10);
        magentaParticles.setDepth(-10);
    }

    /**
     * Creates a scan line effect overlay for a retro cyberpunk feel
     */
    private createScanLinesEffect(): void {
        // Create scan lines
        const scanLines = this.add.tileSprite(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            'scanline'
        );
        
        // Set blend mode and opacity
        scanLines.setBlendMode(Phaser.BlendModes.MULTIPLY);
        scanLines.setAlpha(0.07);
        
        // Set high depth to overlay on top of game elements
        scanLines.setDepth(1000);
        
        // Animate scan lines
        this.tweens.add({
            targets: scanLines,
            y: '+=' + this.cameras.main.height,
            duration: 4000,
            repeat: -1
        });
    }

    /**
     * Adds a neon glow effect to a text object
     */
    private addNeonGlowEffect(textObject: Phaser.GameObjects.Text): void {
        // Create glow rectangle that matches text size
        const bounds = textObject.getBounds();
        const glowRect = this.add.rectangle(
            bounds.centerX,
            bounds.centerY,
            bounds.width + 20,
            bounds.height + 10,
            0x00ffff,
            0.2
        );
        
        // Set blend mode for glow effect
        glowRect.setBlendMode(Phaser.BlendModes.ADD);
        
        // Position behind text
        glowRect.setDepth(textObject.depth - 1);
        
        // Add subtle pulsing animation to the glow
        this.tweens.add({
            targets: glowRect,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
} 