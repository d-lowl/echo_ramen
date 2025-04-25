import Deck from "../deck/Deck";
import Request from "../attributes/Request";
import Recipe from "../attributes/Recipe";
import Ingredient from "../ingredients/Ingredient";

export default class Game {
    private score: number = 0;
    private currentRequest: Request;
    private currentRecipe: Recipe;
    private hand: Ingredient[] = [];
    private handSize: number = 9;
    public difficulty: number;
    private isBossCustomer: boolean = false;
    
    constructor(public deck: Deck, difficulty: number) {
        this.deck = deck;
        this.difficulty = difficulty;
        this.currentRecipe = new Recipe();
        this.generateNewRequest();
        this.hand = [];
        
        // Fill the hand with cards from the deck
        this.drawNewHand();
    }

    /**
     * Draw a new hand of cards
     */
    private drawNewHand(): void {
        while (this.hand.length > 0) {
            this.deck.returnCard(this.hand.pop());
        }
        for (let i = 0; i < this.handSize; i++) {
            const card = this.deck.draw();
            if (card) {
                this.hand.push(card);
            } else {
                console.warn(`Failed to draw card ${i+1} of ${this.handSize}`);
            }
        }
        
        // Log the hand size for debugging
        console.log(`Hand contains ${this.hand.length} cards`);
    }

    public playIngredient(index: number) {
        // Validate index
        if (index < 0 || index >= this.hand.length) {
            console.error(`Invalid index: ${index}, hand size: ${this.hand.length}`);
            return;
        }
        
        const played = this.hand.splice(index, 1)[0];
        
        // Make sure we have a valid ingredient
        if (!played) {
            console.error(`No ingredient at index ${index}`);
            return;
        }
        
        this.deck.returnCard(played);
        this.currentRecipe.addIngredient(played);
    }

    public finishTurn() {
        this.currentRecipe.resetAttributes();
        this.drawNewHand();
    }
    
    /**
     * Generate a new random customer request based on current difficulty
     * @param isBoss Whether this customer is a boss (for special requests)
     */
    generateNewRequest(isBoss: boolean = false): Request {
        this.isBossCustomer = isBoss;
        this.currentRequest = Request.createRandom(this.difficulty, isBoss);
        return this.currentRequest;
    }
    
    /**
     * Get the current customer request
     */
    getCurrentRequest(): Request {
        // Ensure we always have a valid request
        if (!this.currentRequest) {
            this.generateNewRequest(this.isBossCustomer);
        }
        return this.currentRequest;
    }
    
    /**
     * Get the current score
     */
    getScore(): number {
        return this.score;
    }
    
    /**
     * Add points to the current score
     * @param points The number of points to add
     */
    addScore(points: number): void {
        this.score += points;
    }
    
    /**
     * Reset the score to zero
     */
    resetScore(): void {
        this.score = 0;
    }
    
    /**
     * Get the current recipe
     */
    getCurrentRecipe(): Recipe {
        return this.currentRecipe;
    }
    
    /**
     * Evaluate the current recipe against the customer request
     * @returns Object with match percentage and details
     */
    evaluateRecipe(): { 
        matchPercentage: number, 
        details: { [key: string]: { diff: number, match: number } },
        score: number,
    } {
        return this.currentRecipe.compareWithRequest(this.currentRequest);
    }
    
    /**
     * Complete the current order and generate a new request
     * @returns Object with score earned, match percentage and details
     */
    completeOrder(): { scoreEarned: number, matchPercentage: number, details: { [key: string]: { diff: number, match: number } } } {
        const result = this.evaluateRecipe();
        console.log({
            currentRequest: this.currentRequest,
            currentRecipe: this.currentRecipe,
            result
        })
        const scoreEarned = Math.ceil(result.score);
        this.addScore(scoreEarned);
        
        // Store the result for returning
        const orderResult = {
            scoreEarned,
            matchPercentage: result.matchPercentage,
            details: result.details
        };
        
        // Reset recipe and generate new request
        this.currentRecipe = new Recipe();
        this.generateNewRequest();
        
        return orderResult;
    }
    
    /**
     * Draw a card from the deck
     */
    drawCard(): Ingredient {
        return this.deck.draw();
    }
    
    /**
     * Increase difficulty
     */
    increaseDifficulty(): void {
        this.difficulty = Math.min(4, this.difficulty + 1);
    }
    
    /**
     * Set the difficulty level
     * @param level The new difficulty level (1-4)
     */
    setDifficulty(level: number): void {
        this.difficulty = Math.min(4, Math.max(1, level));
    }

    /**
     * Check if current customer is a boss
     */
    isCurrentCustomerBoss(): boolean {
        return this.isBossCustomer;
    }
    
    /**
     * Set current customer as boss or regular
     */
    setCurrentCustomerAsBoss(isBoss: boolean): void {
        this.isBossCustomer = isBoss;
        // Regenerate request with boss status if needed
        if (this.isBossCustomer !== isBoss) {
            this.generateNewRequest(isBoss);
        }
    }
    
    /**
     * Get a copy of the current hand
     */
    getHand(): Ingredient[] {
        return [...this.hand];
    }
    
    /**
     * Get the number of cards left in the deck
     */
    getDeckSize(): number {
        return this.deck.getSize();
    }
}