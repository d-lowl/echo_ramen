import Ingredient from "../ingredients/Ingredient";

export default class Deck {
    deck: Ingredient[];
    discard: Ingredient[];
    constructor(public ingredients: Ingredient[]) {
        // Ensure ingredients array is valid
        if (!ingredients || !Array.isArray(ingredients)) {
            console.error("Invalid ingredients provided to Deck constructor");
            this.deck = [];
            this.discard = [];
            return;
        }
        
        // Filter out any undefined ingredients
        this.deck = ingredients
            .filter(ingredient => ingredient !== undefined)
            .sort(() => Math.random() - 0.5);
        this.discard = [];
    }

    draw(): Ingredient {
        // Check if deck is empty and needs to be reshuffled
        if (this.deck.length === 0) {
            if (this.discard.length === 0) {
                console.warn("Both deck and discard pile are empty!");
                return null;
            }
            
            this.deck = this.discard
                .filter(ingredient => ingredient !== undefined);
            this.discard = [];
            this.deck.sort(() => Math.random() - 0.5);
        }
        
        return this.deck.pop() || null;
    }

    returnCard(ingredient: Ingredient) {
        if (ingredient) {
            this.discard.push(ingredient);
        }
    }

    /**
     * Get the number of cards left in the deck
     */
    getSize(): number {
        return this.deck.length;
    }
}

