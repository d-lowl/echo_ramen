# TICKET-016: Add customer satisfaction feedback system

## Description
Implement a system that provides visual and audio feedback on customer satisfaction based on how well the player's ramen recipe matches their preferences. The system should communicate satisfaction levels and provide helpful feedback on how to improve.

## Tasks
- Implement visual feedback for different satisfaction levels
- Implement audio feedback for different satisfaction levels

## Satisfaction Levels
1. **Ecstatic** - Perfect or near-perfect match (90-100%)
2. **Satisfied** - Good match with minor issues (70-89%)
3. **Neutral** - Acceptable match with clear issues (50-69%)
4. **Dissatisfied** - Poor match with major issues (30-49%)
5. **Disgusted** - Terrible match (0-29%)

## Plan
- Take the current recipe and compare it to the customer request
- Use existing evaluateRecipe method to get the match percentage
- Use the match percentage to determine the satisfaction level
- Display the satisfaction level visually
- Play the appropriate audio feedback

## Story Points
2 