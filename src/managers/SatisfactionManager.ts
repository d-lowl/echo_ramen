export type SatisfactionLevel = 'ecstatic' | 'satisfied' | 'neutral' | 'dissatisfied' | 'disgusted';

export default class SatisfactionManager {
    /**
     * Determine satisfaction level based on match percentage
     */
    static getSatisfactionLevel(matchPercentage: number): SatisfactionLevel {
        if (matchPercentage >= 90) return 'ecstatic';
        if (matchPercentage >= 70) return 'satisfied';
        if (matchPercentage >= 50) return 'neutral';
        if (matchPercentage >= 30) return 'dissatisfied';
        return 'disgusted';
    }

    /**
     * Get feedback message based on satisfaction level and details
     */
    static getFeedbackMessage(
        level: SatisfactionLevel, 
        details: { [key: string]: { diff: number, match: number } }
    ): string {
        // Find the attribute with lowest match percentage
        let worstAttribute: string | null = null;
        let worstMatch = 100;
        
        Object.entries(details).forEach(([attr, data]) => {
            if (data.match < worstMatch) {
                worstMatch = data.match;
                worstAttribute = attr;
            }
        });
        
        // Generic messages by satisfaction level
        const genericMessages = {
            'ecstatic': "Perfect! Exactly what I wanted!",
            'satisfied': "This is good, I enjoyed it!",
            'neutral': "It's okay, but could be better.",
            'dissatisfied': "This isn't what I asked for...",
            'disgusted': "This is terrible! Nothing like what I wanted!"
        };
        
        // For good satisfaction levels (ecstatic or satisfied), don't add specific complaints
        if (level === 'ecstatic' || level === 'satisfied') {
            return genericMessages[level];
        }
        
        // If we have a worst attribute, add specific feedback
        if (worstAttribute) {
            const attributeMessages = {
                'richness': {
                    high: "It's too rich for my taste.",
                    low: "It's too light, I wanted something richer."
                },
                'spiciness': {
                    high: "It's too spicy for me!",
                    low: "I wanted more spice in this."
                },
                'sweetness': {
                    high: "It's too sweet.",
                    low: "It's too savoury."
                }
            };
            
            const attrData = details[worstAttribute];
            // If diff > 0, recipe value is higher than requested (too much)
            // If diff < 0, recipe value is lower than requested (too little)
            const direction = attrData.diff > 0 ? 'high' : 'low';
            
            return `${genericMessages[level]} ${attributeMessages[worstAttribute.toLowerCase()][direction]}`;
        }
        
        return genericMessages[level];
    }
} 