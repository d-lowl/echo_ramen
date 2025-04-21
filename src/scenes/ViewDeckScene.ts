import Phaser from 'phaser';
import Button from '../components/Button';
import Deck from '../deck/Deck';
import IngredientCard from '../components/IngredientCard';
import Ingredient from '../ingredients/Ingredient';

export default class ViewDeckScene extends Phaser.Scene {
    private deck: Deck;
    private cardsContainer: Phaser.GameObjects.Container;
    private closeButton: Button;
    private modalBg: Phaser.GameObjects.Rectangle;
    private scrollMask: Phaser.GameObjects.Graphics;
    private contentHeight: number = 0;
    private maskHeight: number = 0;
    private isScrollable: boolean = false;
    private scrollBackground: Phaser.GameObjects.Rectangle;
    
    constructor() {
        super('ViewDeckScene');
    }
    
    init(data: { deck: Deck }): void {
        this.deck = data.deck;
        // Reset values each time scene initializes
        this.contentHeight = 0;
        this.isScrollable = false;
    }
    
    create(): void {
        const { width, height } = this.cameras.main;
        
        // Add semi-transparent background to create modal effect
        this.modalBg = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive();
        
        // Create title text
        const titleText = this.add.text(
            width / 2,
            50,
            'YOUR DECK',
            {
                fontFamily: 'Arial',
                fontSize: '36px',
                color: '#00ffff',
                stroke: '#000000',
                strokeThickness: 3
            }
        ).setOrigin(0.5);
        
        // Set the mask area
        const maskStartY = 120;
        this.maskHeight = height - 220; // 120 from top, 100 from bottom
        
        // Add visual indicator for scroll area
        this.scrollBackground = this.add.rectangle(
            width / 2,
            maskStartY + this.maskHeight / 2,
            width - 100,
            this.maskHeight,
            0x111122,
            0.3
        ).setStrokeStyle(1, 0x3333ff, 0.3);
        
        // Create scrollable container for cards
        this.cardsContainer = this.add.container(0, maskStartY + (this.contentHeight - this.maskHeight) + 30);
        
        // Add mask for scrolling
        this.scrollMask = this.make.graphics({});
        this.scrollMask.fillStyle(0xffffff);
        this.scrollMask.fillRect(0, maskStartY, width, this.maskHeight);
        
        // Apply mask to container
        const mask = this.scrollMask.createGeometryMask();
        this.cardsContainer.setMask(mask);
        
        // Display cards from deck
        this.displayDeckCards();
        this.cardsContainer.y = maskStartY + (this.contentHeight - this.maskHeight) + 30;
        
        // Add close button
        this.closeButton = new Button(
            this,
            width / 2,
            height - 60,
            'CLOSE',
            () => {
                this.scene.stop();
            },
            {
                fontSize: '28px',
                width: 200,
                height: 60,
                bgColor: 0x222255,
                hoverColor: 0x334499
            }
        );
        
        // Add close button to scene
        const buttonObjects = this.closeButton.getGameObjects();
        this.add.existing(buttonObjects[0]);
        this.add.existing(buttonObjects[1]);
        
        // Add scroll instructions if scrollable
        if (this.isScrollable) {
            const scrollText = this.add.text(
                width / 2,
                height - 110,
                'Scroll with mouse wheel',
                {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    color: '#aaaaaa'
                }
            ).setOrigin(0.5);
        }
        
        // Enable scrolling using mouse wheel
        this.input.on('wheel', (pointer: Phaser.Input.Pointer, gameObjects: any, deltaX: number, deltaY: number) => {
            // If content height is shorter than mask, no need to scroll
            if (!this.isScrollable) return;
            
            // Calculate scrolling bounds
            const minY = maskStartY; // Upper bound (starting position)
            const maxY = Math.max(maskStartY, maskStartY + (this.contentHeight - this.maskHeight) + 30); // Lower bound
            
            // Move the container, ensuring it stays within bounds
            let newY = this.cardsContainer.y - Math.sign(deltaY) * 30; // Fixed scroll amount
            newY = Phaser.Math.Clamp(newY, minY, maxY);
            
            // Apply the new position
            this.cardsContainer.y = newY;
            
            // Debug info
            console.log(`Scrolling: container.y=${this.cardsContainer.y}, bounds: ${minY} to ${maxY}`);
        });
        
        // Add debug counters
        const cardCount = [...this.deck.deck, ...this.deck.discard].length;
        console.log(`Cards: ${cardCount}, Content height: ${this.contentHeight}, Mask height: ${this.maskHeight}`);
        console.log(`Is scrollable: ${this.isScrollable}`);
    }
    
    private displayDeckCards(): void {
        // Get all cards from deck and discard pile
        const allIngredients = [...this.deck.deck, ...this.deck.discard];
        const { width } = this.cameras.main;
        
        // Configure grid layout
        const cardWidth = 130;
        const cardHeight = 130;
        const cardsPerRow = 4;
        const horizontalSpacing = (width - 100) / cardsPerRow;
        const verticalSpacing = cardHeight + 20;
        
        // Add cards to container
        allIngredients.forEach((ingredient, index) => {
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            
            const x = 50 + col * horizontalSpacing + horizontalSpacing / 2;
            const y = row * verticalSpacing;
            
            // Create a non-interactive version of the card
            const card = this.createNonInteractiveCard(x, y, ingredient, index);
            this.cardsContainer.add(card);
            
            // Update content height based on last card's position
            this.contentHeight = Math.max(this.contentHeight, y + cardHeight);
        });
        
        // Determine if content is scrollable
        this.isScrollable = this.contentHeight > this.maskHeight;
        
        // If no cards, show a message
        if (allIngredients.length === 0) {
            const emptyText = this.add.text(
                width / 2,
                50,
                'Your deck is empty!',
                {
                    fontFamily: 'Arial',
                    fontSize: '24px',
                    color: '#aaaaaa'
                }
            ).setOrigin(0.5);
            
            this.cardsContainer.add(emptyText);
        }
    }
    
    private createNonInteractiveCard(x: number, y: number, ingredient: Ingredient, index: number): Phaser.GameObjects.Container {
        // Create card without click functionality
        const card = new IngredientCard(this, x, y, ingredient, index, () => {});
        
        // Remove interactivity
        card.removeInteractive();
        
        return card;
    }
} 