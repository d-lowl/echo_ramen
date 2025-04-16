# TICKET-021: Build complete game loop

## Description
Implement the core game loop that ties together all game systems, from customer arrival to order completion and progression to the next customer. This system forms the backbone of gameplay and ensures all components work together properly.

## Tasks
- Implement customer arrival sequence
- Create order preparation phase with time management
- Develop order submission and evaluation system
- Implement result display and feedback
- Create transition to next customer/order
- Add game progression tracking

## Game Loop Phases
1. **Customer Arrival** - Customer appears with specific requests
2. **Ingredient Selection** - Player draws ingredients from fridge
3. **Recipe Creation** - Player combines ingredients to match request
4. **Order Evaluation** - System evaluates match with customer preferences
5. **Results & Feedback** - Display results and customer reaction
6. **Progression** - Award cryptocurrency and advance to next customer

## Acceptance Criteria
- Complete game loop functions from start to finish
- All game systems integrate properly within the loop
- Player can progress through multiple customers/orders
- Game state is maintained correctly between loop iterations
- Loop provides appropriate pacing for gameplay
- Game difficulty progresses appropriately over time
- Loop handles edge cases (no ingredients, perfect/terrible matches)

## Story Points
3 