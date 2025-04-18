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
     * @param difficulty Level 1-3 determining how many attributes are set
     * @returns A new request with random attributes based on difficulty
     */
    static createRandom(difficulty: number = 1): Request {
        // Get random attribute names to set based on difficulty
        const attributeNames = ["Richness", "Spiciness", "Sweetness"];
        const shuffled = attributeNames.sort(() => 0.5 - Math.random());
        const toSet = shuffled.slice(0, Math.min(difficulty, 3));

        // Set random values for selected attributes
        const attributes = {}
        toSet.forEach(attr => {
            attributes[attr] = new Attribute(attr, Math.floor(Math.random() * 21) - 10, -10, 10);
        });
        
        return new Request(attributes);
    }

    static create(richness: number, spiciness: number, sweetness: number): Request {
        return new Request({
            Richness: new Attribute("Richness", richness, -10, 10),
            Spiciness: new Attribute("Spiciness", spiciness, -10, 10),
            Sweetness: new Attribute("Sweetness", sweetness, -10, 10)
        });
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
     * Get a description of the request using display names
     * @returns A human-readable description of the request
     */
    getDescription(): string {
        const descriptions: string[] = [];
        
        Object.keys(this.attributes).forEach(key => {
            const attr = this.attributes[key];
            const value = Math.abs(attr.value);
            let intensity = "Medium";
            
            if (value <= 3) {
                intensity = "Slight";
            } else if (value >= 7) {
                intensity = "Great";
            }
            
            descriptions.push(`${intensity} ${attr.getDisplayName()}`);
        });
        
        return descriptions.join(", ");
    }
}

export default Request;