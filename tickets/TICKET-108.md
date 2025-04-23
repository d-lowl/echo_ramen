# TICKET-108: Ingredient Addition System ("Ingredient Acquisition")

## Description
Implement the "Ingredient Acquisition" interface that allows players to add one new card to their deck after each customer. This system presents three random ingredient options and is crucial for building a strong and synergistic deck throughout the game.

## Tasks
- Create the "Ingredient Acquisition" interface
- Implement system to generate three random ingredient cards based on current floor difficulty
- Support different ingredient types (standard, modified, special)
- Display the three options with clear visual distinction between ingredient types
- Implement preview system showing how each ingredient would affect overall attribute balance
- Add visual indicators highlighting potential synergies with existing deck
- Create transition between this interface and the next customer
- Implement scaling of ingredient power/rarity based on floor difficulty

## Acceptance Criteria
- "Ingredient Acquisition" interface appears after the card removal phase
- Three random ingredient cards are presented as options
- The options reflect the current floor's difficulty level
- Interface shows different visual styling for different ingredient types
- Player can see how each option would affect their deck's attribute balance
- Potential synergies with existing cards are highlighted
- Player must select one card to add to their deck (interface cannot be skipped)
- Selected card is immediately added to the player's deck
- Interface provides clear visual feedback on card selection

## Additional Notes
- The card addition interface must not be skippable - player must choose one card
- Consider adding special animations for rare or powerful ingredients
- Include tooltips explaining special effects on ingredients
- Balance the random selection pool to ensure meaningful choices
- Consider showing the relative rarity/power level of each ingredient
- Interface should have cyberpunk styling consistent with game theme
- Refer to the GDD for detailed descriptions of the card addition system 