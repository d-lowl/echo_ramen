class Attribute {
    constructor(public name: string, public value: number, public min: number, public max: number) {
        this.name = name;
        this.value = value;
        this.min = min;
        this.max = max;
    }

    /**
     * Add a value to the attribute, respecting min/max constraints
     * @param amount Amount to add (can be negative)
     * @returns The new constrained value
     */
    addValue(amount: number): number {
        return this.setValue(this.value + amount);
    }

    /**
     * Set the attribute to a specific value, respecting min/max constraints
     * @param newValue The value to set
     * @returns The new constrained value
     */
    setValue(newValue: number): number {
        this.value = Math.max(this.min, Math.min(this.max, newValue));
        return this.value;
    }

    /**
     * Get the opposite attribute name (e.g., Richness → Lightness)
     * @returns The opposite attribute name
     */
    getOppositeName(): string {
        switch (this.name) {
            case 'Richness': return 'Lightness';
            case 'Spiciness': return 'Mildness';
            case 'Sweetness': return 'Savory';
            default: return `Not ${this.name}`;
        }
    }

    /**
     * Get the display name based on the current value
     * @returns The appropriate name based on positive/negative value
     */
    getDisplayName(): string {
        return this.value >= 0 ? this.name : this.getOppositeName();
    }

    /**
     * Get the absolute display value
     * @returns Absolute value for display
     */
    getDisplayValue(): number {
        return Math.abs(this.value);
    }
}

export default Attribute;