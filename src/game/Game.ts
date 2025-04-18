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
    
    constructor(public deck: Deck, public difficulty: number) {
        this.deck = deck;
        this.difficulty = difficulty;
        this.currentRecipe = new Recipe();
        this.generateNewRequest();
        this.hand = [];
        for (let i = 0; i < this.handSize; i++) {
            this.hand.push(this.deck.draw());
        }
    }

    public playIngredient(index: number) {
        const played = this.hand.splice(index, 1)[0];
        this.deck.returnCard(played);
        this.currentRecipe.addIngredient(played);
    }

    public finishTurn() {
        this.currentRecipe.resetAttributes();
        this.hand = [];
        for (let i = 0; i < this.handSize; i++) {
            this.hand.push(this.deck.draw());
        }
    }
    
    /**
     * Generate a new random customer request based on current difficulty
     */
    generateNewRequest(): Request {
        this.currentRequest = Request.createRandom(this.difficulty);
        return this.currentRequest;
    }
    
    /**
     * Get the current customer request
     */
    getCurrentRequest(): Request {
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
        details: { [key: string]: { diff: number, match: number } } 
    } {
        return this.currentRecipe.compareWithRequest(this.currentRequest);
    }
    
    /**
     * Complete the current order and generate a new request
     * @returns The score earned for this order
     */
    completeOrder(): number {
        const result = this.evaluateRecipe();
        const scoreEarned = Math.ceil(result.matchPercentage);
        this.addScore(scoreEarned);
        
        // Reset recipe and generate new request
        this.currentRecipe = new Recipe();
        this.generateNewRequest();
        
        return scoreEarned;
    }
    
    /**
     * Draw a card from the deck
     */
    drawCard(): any {
        return this.deck.draw();
    }
    
    /**
     * Increase difficulty
     */
    increaseDifficulty(): void {
        this.difficulty = Math.min(3, this.difficulty + 1);
    }
}