import Recipe from "./Recipe";

interface Effect {
    apply(recipe: Recipe): void;
    display(): string;
}

export abstract class SpecialEffect implements Effect {
    abstract applySpecial(value: number): number;
    
    apply(recipe: Recipe): void {
        recipe.registerSpecialEffect(this);
    }
    
    /**
     * Abstract method for displaying effect description
     */
    abstract display(): string;
}

/**
 * Basic effect that directly modifies an attribute value
 */
export class BasicEffect implements Effect {
    constructor(public attribute: string, public value: number) {}

    apply(recipe: Recipe) {
        recipe.attributes[this.attribute].addValue(recipe.applySpecialEffects(this.value));
    }
    
    /**
     * Get a human-readable description of this effect
     * @returns Description string
     */
    display(): string {
        const attributeName = this.value >= 0 ? 
            this.attribute.charAt(0).toUpperCase() + this.attribute.slice(1) : 
            this.getOppositeAttributeName(this.attribute);
        return `${attributeName} ${Math.abs(this.value)}`;
    }
    
    /**
     * Helper to get opposite attribute name for negative values
     */
    private getOppositeAttributeName(attribute: string): string {
        switch (attribute.toLowerCase()) {
            case 'richness': return 'Lightness';
            case 'spiciness': return 'Mildness';
            case 'sweetness': return 'Savory';
            default: return `Not ${attribute}`;
        }
    }
}

/**
 * Amplify effect doubles the next ingredient's effect for a specific attribute
 */
export class AmplifyEffect extends SpecialEffect {
    applySpecial(value: number): number {
        return value * 2;
    }
    
    /**
     * Get a human-readable description of this effect
     * @returns Description string
     */
    display(): string {
        return `Amplify`;
    }
}

/**
 * Balance effect brings an attribute closer to 0 by a specified amount
 */
export class BalanceEffect implements Effect {
    constructor(public attribute: string, public amount: number = 3) {}

    apply(recipe: Recipe) {
        const attr = recipe.attributes[this.attribute];
        const currentValue = attr.value;
        
        // Move the value closer to 0
        if (currentValue > 0) {
            attr.addValue(-Math.min(currentValue, this.amount));
        } else if (currentValue < 0) {
            attr.addValue(Math.min(-currentValue, this.amount));
        }
    }
    
    /**
     * Get a human-readable description of this effect
     * @returns Description string
     */
    display(): string {
        return `Balance`;
    }
}

/**
 * Neutralize effect cancels negative effects from the next ingredient
 */
export class NeutralizeEffect extends SpecialEffect {
    applySpecial(value: number): number {
        return value > 0 ? value : 0;
    }
    
    /**
     * Get a human-readable description of this effect
     * @returns Description string
     */
    display(): string {
        return "Neutralize";
    }
}

export default Effect;