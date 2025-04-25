import Attribute from "./Attribute";
import Ingredient from "../ingredients/Ingredient";
import { SpecialEffect } from "./Effects";
import Request from "./Request";

class Recipe {
    private ingredients: Ingredient[];
    private specialEffectQueue: SpecialEffect[];
    attributes: { [key: string]: Attribute };

    constructor() {
        this.ingredients = [];
        this.specialEffectQueue = [];
        this.attributes = {
            "Richness": new Attribute("Richness", 0, -10, 10),
            "Spiciness": new Attribute("Spiciness", 0, -10, 10),
            "Sweetness": new Attribute("Sweetness", 0, -10, 10),
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
    compareWithRequest(customerRequest: Request): { 
        matchPercentage: number, 
        details: { [key: string]: { diff: number, match: number } },
        score: number,
    } {
        const details: { [key: string]: { diff: number, match: number } } = {};
        
        // Calculate difference for each attribute
        Object.keys(customerRequest.attributes).forEach(attr => {
            const requestedValue = customerRequest.attributes[attr].value;
            const currentValue = this.attributes[attr]?.value || 0;
            // const maxDiff = 10 + Math.abs(requestedValue);
            const maxDiff = 12;
            // Store actual difference (positive means recipe value is higher than requested)
            const actualDiff = currentValue - requestedValue;
            const absDiff = Math.abs(actualDiff);
            
            details[attr] = {
                diff: actualDiff, // Store directional difference (positive or negative)
                match: 100 - (absDiff / maxDiff) * 100
            };
        });
        
        // Calculate overall match percentage
        const matchPercentage = Object.values(details).reduce((sum, detail) => sum + detail.match, 0) / Object.keys(details).length;
        const score = Math.exp((matchPercentage/100 - 1)*4)*100

        return {
            matchPercentage: Math.max(0, Math.round(matchPercentage)),
            score: Math.max(0, Math.round(score)),
            details: details
        };
    }
}

export default Recipe;
