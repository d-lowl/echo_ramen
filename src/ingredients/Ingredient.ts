import Effect, { SpecialEffect } from "../attributes/Effects";
import Recipe from "../attributes/Recipe";

class Ingredient {
    private name: string;
    private effects: Effect[];
    
    /**
     * Create a new ingredient
     * @param _name The ingredient name
     * @param _effects Array of effects this ingredient has
     */
    constructor(
        public _name: string, 
        public _effects: Effect[], 
    ) {
        this.name = _name;
        this.effects = _effects;
    }

    /**
     * Apply all effects of this ingredient to the recipe
     * @param recipe The recipe to apply the effects to
     */
    applyEffects(recipe: Recipe) {
        let clearSpecialEffects = false;
        for (const effect of this.effects) {
            if (effect instanceof SpecialEffect && clearSpecialEffects) {
                recipe.clearSpecialEffects();
                clearSpecialEffects = false;
            } else if (!(effect instanceof SpecialEffect)) {
                clearSpecialEffects = true;
            }
            effect.apply(recipe);
        }
        if (clearSpecialEffects) {
            recipe.clearSpecialEffects();
        }
    }
    
    /**
     * Get the name of the ingredient
     */
    getName(): string {
        return this.name;
    }
    
    /**
     * Get the list of effects this ingredient has
     */
    getEffects(): Effect[] {
        return [...this.effects];
    }
}

export default Ingredient;
