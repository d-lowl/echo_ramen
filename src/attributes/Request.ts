import Attribute from "./Attribute";
import Recipe from "./Recipe";

class Request {
    /**
     * Create a new customer request
     * @param attributes The requested attribute values (Richness, Spiciness, Sweetness)
     */
    constructor(public attributes: { [key: string]: Attribute }) {}

    /**
     * Set a specific attribute value in the request
     * @param attributeName The name of the attribute
     * @param value The requested value
     */
    setAttribute(attributeName: string, value: number): void {
        if (attributeName in this.attributes) {
            this.attributes[attributeName].setValue(value);
        }
    }

    /**
     * Create a new random request with random attribute values
     * @returns A new request with random attributes
     */
    static createRandom(): Request {
        const attributes = {
            "richness": new Attribute("Richness", Math.floor(Math.random() * 21) - 10, -10, 10),
            "spiciness": new Attribute("Spiciness", Math.floor(Math.random() * 21) - 10, -10, 10),
            "sweetness": new Attribute("Sweetness", Math.floor(Math.random() * 21) - 10, -10, 10),
        };
        
        return new Request(attributes);
    }
    
    /**
     * Create a request with specific attribute values
     * @param richness Richness value (-10 to 10)
     * @param spiciness Spiciness value (-10 to 10)
     * @param sweetness Sweetness value (-10 to 10)
     * @returns A new request with the specified attributes
     */
    static create(richness: number, spiciness: number, sweetness: number): Request {
        const attributes = {
            "richness": new Attribute("Richness", richness, -10, 10),
            "spiciness": new Attribute("Spiciness", spiciness, -10, 10),
            "sweetness": new Attribute("Sweetness", sweetness, -10, 10),
        };
        
        return new Request(attributes);
    }
    
    /**
     * Compare this request with a recipe to determine match percentage
     * @param recipe The recipe to compare against
     * @returns Object with match percentage and details
     */
    compareWithRecipe(recipe: Recipe): { 
        matchPercentage: number, 
        details: { [key: string]: { diff: number, match: number } } 
    } {
        let totalDifference = 0;
        const maxPossibleDifference = 60; // 3 attributes * 20 range (from -10 to 10)
        const details: { [key: string]: { diff: number, match: number } } = {};
        
        // Calculate difference for each attribute
        Object.keys(this.attributes).forEach(attr => {
            const requestedValue = this.attributes[attr].value;
            const recipeValue = recipe.attributes[attr]?.value || 0;
            const diff = Math.abs(recipeValue - requestedValue);
            
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
    
    /**
     * Get a serialized representation of the request attributes
     * @returns Simple object with attribute values
     */
    serialize(): { [key: string]: number } {
        const result: { [key: string]: number } = {};
        
        Object.keys(this.attributes).forEach(key => {
            result[key] = this.attributes[key].value;
        });
        
        return result;
    }
    
    /**
     * Get a description of the request using display names
     * @returns A human-readable description of the request
     */
    getDescription(): string {
        const descriptions: string[] = [];
        
        Object.keys(this.attributes).forEach(key => {
            const attr = this.attributes[key];
            const value = Math.abs(attr.value);
            let intensity = "medium";
            
            if (value <= 3) {
                intensity = "slight";
            } else if (value >= 7) {
                intensity = "very";
            }
            
            descriptions.push(`${intensity} ${attr.getDisplayName()}`);
        });
        
        return descriptions.join(", ");
    }
}

export default Request;