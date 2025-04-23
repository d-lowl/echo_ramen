# TICKET-107: Ingredient Removal System ("Fridge Cleanup")

## Description
Implement the "Fridge Cleanup" interface that allows players to remove one card from their deck after serving each customer. This system is essential for deck optimization and strategy refinement throughout the game.

## Tasks
- Create the "Fridge Cleanup" interface
- Implement visual display of current deck composition by attribute balance
- Add ability to select and permanently remove one ingredient card
- Implement highlight system showing impact on attribute balance when hovering over cards
- Show strategic considerations for each possible removal (e.g., "Removing this will increase your average Spiciness")
- Create transition between customer satisfaction screen and the removal interface
- Add option to skip card removal if player wishes to keep all current cards

## Acceptance Criteria
- After serving each customer, the "Fridge Cleanup" interface appears
- Player can view their current deck composition and attribute balance
- Player can select and permanently remove one card from their deck
- Interface shows real-time feedback on how removal would affect deck balance
- Strategic considerations are displayed when hovering over cards
- The interface can be skipped if player wants to keep all cards
- Removed cards are permanently deleted from the deck
- Interface provides clear visual feedback on card selection and removal

## Additional Notes
- Ensure the UI clearly communicates the permanence of card removal
- Consider color-coding the attribute impact (red for negative, green for positive)
- Add a confirmation step before finalizing card removal
- Interface should have cyberpunk styling consistent with game theme
- Refer to the GDD for detailed descriptions of the card removal system
- Consider adding sound effects for card removal 