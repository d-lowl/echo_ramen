import Attribute from "./Attribute";
import Ingredient from "../ingredients/Ingredient";
import { SpecialEffect } from "./Effects";

class Recipe {
    private ingredients: Ingredient[];
    private specialEffectQueue: SpecialEffect[];
    attributes: { [key: string]: Attribute };

    constructor() {
        this.ingredients = [];
        this.specialEffectQueue = [];
        this.attributes = {
            "richness": new Attribute("Richness", 0, -10, 10),
            "spiciness": new Attribute("Spiciness", 0, -10, 10),
            "sweetness": new Attribute("Sweetness", 0, -10, 10),
        };
    }

    /**
     * Add an ingredient to the recipe
     * @param ingredient The ingredient to add
     */
    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        ingredient.applyEffects(this);
    }
    
    /**
     * Reset all attributes to their default values
     */
    resetAttributes() {
        Object.keys(this.attributes).forEach(key => {
            this.attributes[key].setValue(0);
        });
    }
    
    /**
     * Register a special effect that will apply to future ingredients
     * @param effect The special effect to register
     */
    registerSpecialEffect(effect: SpecialEffect) {
        this.specialEffectQueue.push(effect);
    }

    applySpecialEffects(value: number) {
        for (const effect of this.specialEffectQueue) {
            value = effect.applySpecial(value);
        }
        return value;
    }

    clearSpecialEffects() {
        this.specialEffectQueue = [];
    }
    
    /**
     * Compare recipe attributes with a customer request
     * @param customerRequest The customer's requested attribute values
     * @returns Object with match percentage and details
     */
    compareWithRequest(customerRequest: { [key: string]: number }): { 
        matchPercentage: number, 
        details: { [key: string]: { diff: number, match: number } } 
    } {
        let totalDifference = 0;
        const maxPossibleDifference = 60; // 3 attributes * 20 range (from -10 to 10)
        const details: { [key: string]: { diff: number, match: number } } = {};
        
        // Calculate difference for each attribute
        Object.keys(this.attributes).forEach(attr => {
            const currentValue = this.attributes[attr].value;
            const requestedValue = customerRequest[attr] || 0;
            const diff = Math.abs(currentValue - requestedValue);
            
            totalDifference += diff;
            details[attr] = {
                diff: diff,
                match: 100 - (diff / 20) * 100 // 20 is the max difference per attribute
            };
        });
        
        // Calculate overall match percentage
        const matchPercentage = 100 - (totalDifference / maxPossibleDifference) * 100;
        
        return {
            matchPercentage: Math.max(0, Math.round(matchPercentage)),
            details: details
        };
    }
}

export default Recipe;
