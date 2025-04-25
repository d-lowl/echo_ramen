# EchoRamen - Game Design Document

## Game Overview

### Executive Summary
A cyberpunk-themed cooking game where players balance ingredients to create the perfect ramen bowl based on customer requests in a neon-lit future. Players draw ingredients from their high-tech fridge, combine them strategically, and try to match customer preferences while managing their ingredient inventory in a world where traditional cuisine meets cutting-edge technology.

### Theme and Setting
- Setting: A neon-lit ramen shop in a sprawling cyberpunk metropolis
- Art Style: Cyberpunk aesthetic with neon colors, holographic UI elements, and a blend of traditional Japanese and futuristic design
- Mood: Atmospheric yet relaxing, with synthwave music and the glow of neon signs

### Main Features
- Dynamic ingredient token system
- Three-attribute balancing mechanics
- Customer request system with cyberpunk characters
- Holographic fridge management and progression
- Special ingredient effects with tech enhancements
- Score-based success system

## Minimal Scope (2-Day Game Jam)

### Core Features to Implement
1. **Basic Game Loop**
   - Single customer type with fixed attribute requests
   - Three main attributes to balance (Richness, Spiciness, Sweetness)
   - Simple ingredient drawing system (3-5 ingredients)
   - Basic recipe creation and scoring

2. **Essential UI Elements**
   - Attribute sliders with visual feedback
   - Simple ingredient tokens
   - Customer request display
   - Basic scoring system

3. **Minimal Content**
   - 5-7 basic ingredients with simple effects
   - 1-2 special effects
   - 3-5 customer requests
   - Basic sound effects and background music

## Game Description

### Core Game Loop
1. **Customer Arrival**
   - Cyberpunk characters appear with specific attribute requests
   - Three main attributes to balance:
     - Richness (Umami) vs. Lightness
     - Spiciness vs. Mildness
     - Sweetness vs. Savory

2. **Ingredient Selection**
   - Draw tokens from the holographic fridge (limited number per turn)
   - Each ingredient affects multiple attributes
   - Special effects add strategic depth

3. **Recipe Creation**
   - Combine ingredients to match customer requests
   - Balance positive and negative effects
   - Utilize special ingredient abilities

4. **Customer Satisfaction**
   - Score based on how close to target values
   - Rewards for perfect matches
   - Feedback on what could be improved

5. **Progression**
   - TBD

## Game Elements

### Ingredient System
- **Basic Ingredients**
  - Synthetic Miso: Richness +2, Sweetness +1
  - Nano-Chili Oil: Spiciness +3, Richness +1
  - Bio-Engineered Green Onions: Lightness +2, Savory +1

- **Special Effects**
  - "Neural Enhancement" (enhance next ingredient)
  - "Quantum Duplication" (double effect)
  - "Negative Ion Cancellation" (cancel negative effects)
  - "Thermal Regulation" (balance spicy ingredients)

### Customer System
- Different cyberpunk character types with varying preferences
- Special requests that require specific combinations
- Customer satisfaction affects reputation and rewards
- Holographic customer profiles with personality traits

### Fridge Management
- Limited space for ingredients in holographic storage
- Special events that affect available ingredients (supply chain issues, black market opportunities)
- Upgrade system for fridge capacity and draw limits
- Cybernetic enhancements for kitchen efficiency

### Progression System
- TBD

### UI/UX Elements
- Holographic attribute sliders
- Ingredient token visualization with cyberpunk aesthetics
- Customer request display with personality indicators
- Holographic inventory management
- Progress tracking with neon visualizations
- Tutorial system with AI assistant

## Technical Requirements

### Core Mechanics
- Token drawing system
- Attribute calculation engine
  - **Data Structure**
    - Attribute class tracking name, value, min (-10) and max (10) bounds
    - RecipeAttributes class containing the three main attributes (Richness, Spiciness, Sweetness)
    - Ingredient class with name, attribute effects, and optional special effect
  - **Calculation Rules**
    - Adding ingredients adds their attribute effects to recipe attributes
    - Removing ingredients subtracts their attribute effects from recipe
    - Attribute values constrained between -10 and 10
    - Positive values represent Richness, Spiciness, or Sweetness
    - Negative values represent Lightness, Mildness, or Savory
  - **Attribute Comparison**
    - Match percentage calculation: 100 - (sum of absolute differences / maximum possible difference) * 100
    - Perfect match (100%) when all attributes exactly match customer request
    - Minimum acceptable match: 70%
  - **Special Effects Implementation**
    - Amplify: Doubles one attribute effect from the next ingredient
    - Balance: Brings one attribute closer to neutral (0)
    - Neutralize: Cancels negative effects from the next ingredient
- Special effect processor
- Score calculator
- Save/load system

### Visual Elements
- Ingredient icons with cyberpunk styling
- Customer avatars with diverse cyberpunk designs
- UI elements with holographic effects
- Animation system with neon trails
- Feedback effects with technological flair

### Audio Elements
- Synthwave background music
- Sound effects for:
  - Drawing ingredients (holographic sounds)
  - Combining ingredients (tech-enhanced cooking sounds)
  - Customer reactions (varied cyberpunk character voices)
  - Success/failure feedback (neon UI sounds)

## Ingredients

Attribute triad:
- Richness
- Spiciness
- Sweetness

Attribute anti-triad:
- Lightness
- Mildness
- Savory

### Basic Ingredients

Basic ingredients structure:
- Name
- Effects:
    - Attribute +2
    - Next in triad -1

```yaml
- Name: Synthetic Miso
  Effects:
    - Richness +2
    - Sweetness -1 (i.e. Savoryness +1)

- Name: Nano-Chili Oil
  Effects:
    - Spiciness +2
    - Richness -1 (i.e. Lightness +1)

- Name: Bio-Engineered Green Onions
  Effects:
    - Sweetness +2
    - Spiciness -1 (i.e. Mildness +1)

- Name: Quantum Lightness Broth
  Effects:
    - Richness -2 (i.e. Lightness +2)
    - Sweetness +1

- Name: Cryo-Mildness Extract
  Effects:
    - Spiciness -2 (i.e. Mildness +2)
    - Richness +1

- Name: Synthetic Savory Umami
  Effects:
    - Sweetness -2 (i.e. Savoryness +2)
    - Spiciness +1
```

## Demo Game Loop

3 floors:
- 1st floor: difficulty 1, 10 customers
- 2nd floor: difficulty 2, 10 customers
- 3rd floor: difficulty 3, 10 customers
- Boss floor: difficulty 4, 2 customers

Loop:
- Floor starts
    - Customer arrives
    - Select ingredients
    - Create recipe
    - Serve ramen
    - Receive score
    - You can remove one card from the fridge
    - You can add one of three random cards to the fridge
- Random Special Event when Floor ends

## Floor End Random Events

When a floor ends, one of the following three events will trigger:

1. **Quantum Fusion Lab**
   - Two options:
     - Fusion: Combine two thirds of the deck randomly pairwise, to create a new ones combining the effects of each pair. I.e. if the deck is [Aa, Bb, Cc, Dd, Ee, Ff], the new deck may be [AaBb, CcDd, Ee, Ff].
     - Crossover: Crossover two thirds of the deck randomly pairwise, to create a new ones shuffling the effects of each pair. I.e. if the deck is [Aa, Bb, Cc, Dd, Ee, Ff], the new deck may be [Ab, Ba, Cd, Dc, Ee, Ff].

2. **Black Market Dealer**
   - Two options:
     - Risk Deal: Add three powerful black market ingredients to your deck. Each ingredient has a major positive effect (+3 to one attribute) but also includes a significant drawback (e.g., -1 to other attributes, 30% chance to glitch, or locks a different random ingredient for one customer).
     - Safe Deal: Remove up to three ingredients from your deck and receive one guaranteed stable ingredient for each removed (basic ingredients with standard effects but no drawbacks).

3. **Cybernetic Enhancement**
   - Two options:
     - Amplification: Boost the positive effects of all ingredients in your deck by 25%, but also intensify all negative effects by 25% (e.g., +2 becomes +2.5, -1 becomes -1.25).
     - Stabilization: Reduce all positive effects in your deck by 25%, but also reduce all negative effects by 50% (e.g., +2 becomes +1.5, -1 becomes -0.5).

## Card Management Events

### Removing a Card Event
- The "Fridge Cleanup" interface appears after serving each customer
- You can select one ingredient card to permanently remove from your deck
- The interface shows your current deck composition by attribute balance
- Removing cards helps maintain deck efficiency and strategy focus
- When hovering over a card, the interface highlights its impact on your overall attribute balance
- Strategic considerations are shown (e.g., "Removing this will increase your average Spiciness")
- Higher difficulty floors provide special removal options (e.g., remove and gain a small additional benefit)

### Adding a Card Event
- The "Ingredient Acquisition" interface presents three random ingredient cards
- You must select one card to add to your fridge
- Options include:
  - Standard ingredients (basic attribute effects)
  - Modified ingredients (enhanced standard ingredients with stronger effects)
  - Special ingredients (unique effects that modify game mechanics)
- Higher difficulty floors offer more powerful ingredient options
- The interface provides a preview of how each ingredient would affect your overall attribute balance
- Cards that create powerful synergies with your existing deck are highlighted

## Boss Encounters

### Boss 1: "The Food Critic"
- A notorious cyberpunk food critic with an extremely refined palate
- Requires perfect balance across multiple attributes
- Special mechanic: "Refined Palate" - Changes preferred attributes mid-service
- Requires the player to adapt their strategy and ingredient use on the fly
- Defeat rewards: A signature ingredient with the ability to adjust an attribute by +/-1 after being played

### Boss 2: "Chef Neuromancer"
- A legendary ramen chef augmented with cutting-edge AI technology
- Creates "perfect" ramen that sets an extremely high benchmark
- Special mechanic: "Neural Recipe Network" - Learns from player's ingredient choices
- Counters the player's strategy by adapting preferences based on previous ingredient selections
- Defeat rewards: A special "AI Assistant" effect that can predict customer preferences one turn in advance






