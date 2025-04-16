# Ramen Balance Master - Game Design Document

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
   - Earn cryptocurrency from satisfied customers
   - Buy new ingredients for fridge
   - Upgrade kitchen capabilities with cybernetic enhancements
   - Handle random events affecting inventory

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
- Cryptocurrency earned from successful orders
- New ingredient unlocks from various districts
- Kitchen upgrades with cybernetic enhancements
- Special recipe discoveries from data fragments
- Reputation system affecting customer types and access to premium ingredients

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

