# Audio Assets

## Sources
- Sound effects: https://raylibtech.itch.io/rfxgen
- Background music: DavidKBD's "Pink Bloom Synthwave Music Pack" - https://davidkbd.itch.io/pink-bloom-synthwave-music-pack

The rfx files are also provided in [assets/audio/source](assets/audio/source)

## Sound Effects

### Current Sound Effects

- **glitch.wav** - Digital distortion sound used for score glitch effect animations (like "zzzt-brrt").
- **add_ingredient.wav** - Light "pop" sound (like "blip") when an ingredient is added to the recipe.
- **perfect_match.wav** - Harmonious "perfect" sound (like "shing-waaaah") when match percentage is above 90%.
- **bad_match.wav** - Negative "error" alert sound (like "dzzzt") when match percentage is below 60%.
- **new_customer.wav** - Soft bell-like electronic tone (like "ding-ding") when a new customer arrives.
- **new_floor.wav** - Triumphant rising tone sequence (like "ta-da-daaa") when a floor is completed.

## Background Music

- **DavidKBD - Pink Bloom Pack - 04 - Valley of Spirits.ogg** 

The background music loops indefinitely during gameplay to create an immersive cyberpunk atmosphere.

## Implementation

Sound effects and music are loaded and played through the AudioManager class in the game. To add more sound effects:

1. Add the sound file to the assets/audio directory
2. Update AudioManager.ts to preload and create the sound
3. Call audioManager.play('sound-name') where needed in the code

## Acknowledgments

Special thanks to DavidKBD for the "Pink Bloom Pack" music track, licensed under CC-BY 4.0.
Visit https://davidkbd.itch.io/ for more amazing game music.

## Implementation Note

Until actual sound files are added, the game will display a console warning when trying to play these sounds but will continue to function properly with visual feedback. 