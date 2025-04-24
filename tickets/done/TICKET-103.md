# TICKET-103: Customer and Floor Progression System

## Description
Implement the progression system for customers and floors as described in the GDD. The game consists of 3 regular floors with increasing difficulty, followed by a boss floor. Each regular floor has 10 customers, and the boss floor has 2 customers (bosses). The progression system should handle the transition between customers and floors, as well as the increasing difficulty.

## Tasks
- Implement floor progression system with 3 regular floors and 1 boss floor
- Create customer queue system that handles 10 customers per regular floor
- Implement difficulty scaling between floors (difficulty 1, 2, 3, and 4 for boss floor)
- Create transition between customers with appropriate UI feedback
- Implement boss customer stubs for now
- Create floor completion UI and transition to next floor
- Implement game completion state after defeating final boss

## Acceptance Criteria
- Game starts at floor 1 with difficulty level 1
- Each floor correctly generates 10 customers (or 2 for boss floor)
- Difficulty level increases correctly when advancing to next floor
- Customer requests become appropriately more challenging with higher difficulty
- Boss customers have unique visual appearance and special mechanics
- Appropriate UI feedback is shown when completing a floor
- Player can see their current floor and customer progress
- Game completion state is reached after defeating the final boss

## Additional Notes
- The transition between customers should include the card removal and addition events
- Random events should trigger at the end of each floor
- Consider adding visual and audio feedback for floor transitions 