import Ingredient from "src/ingredients/Ingredient";

export default class Deck {
    deck: Ingredient[];
    discard: Ingredient[];
    constructor(public ingredients: Ingredient[]) {
        this.deck = ingredients.sort(() => Math.random() - 0.5);
        this.discard = [];
    }

    draw(): Ingredient {
        if (this.deck.length === 0) {
            this.deck = this.discard;
            this.discard = [];
            this.deck.sort(() => Math.random() - 0.5);
        }
        return this.deck.pop();
    }

    returnCard(ingredient: Ingredient) {
        this.discard.push(ingredient);
    }
}

