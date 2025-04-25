export default class AudioManager {
    private scene: Phaser.Scene;
    private sounds: Map<string, Phaser.Sound.BaseSound>;
    private volume: number = 0.5;
    private musicVolume: number = 0.3;
    private assetsLoaded: boolean = false;
    private backgroundMusic: Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.sounds = new Map();
    }

    preload(): void {
        // Add error handling for asset loading
        this.scene.load.on('loaderror', (fileObj) => {
            console.warn(`Error loading audio file: ${fileObj.src}`);
        });
        
        this.scene.load.on('complete', () => {
            this.assetsLoaded = true;
            console.log(this.scene.sys.game.device.audio)
            console.log('Audio assets loaded successfully');
            this.scene.sound.add('satisfaction-ecstatic');
            this.scene.sound.add('satisfaction-satisfied');
            this.scene.sound.add('satisfaction-dissatisfied');
            this.scene.sound.add('satisfaction-disgusted');
        });

        // Use absolute paths for audio assets
        this.scene.load.setBaseURL(window.location.origin);
        
        // Load sound effects
        this.scene.load.audio('glitch', 'assets/audio/glitch.wav');
        this.scene.load.audio('add_ingredient', 'assets/audio/add_ingredient.wav');
        this.scene.load.audio('satisfaction-ecstatic', 'assets/audio/perfect_match.wav');
        this.scene.load.audio('satisfaction-satisfied', 'assets/audio/perfect_match.wav');
        this.scene.load.audio('satisfaction-dissatisfied', 'assets/audio/bad_match.wav');
        this.scene.load.audio('satisfaction-disgusted', 'assets/audio/bad_match.wav');
        this.scene.load.audio('new_customer', 'assets/audio/new_customer.wav');
        this.scene.load.audio('new_floor', 'assets/audio/new_floor.wav');
        
        // Load only the Valley of Spirits background music
        this.scene.load.audio('background-music', 'assets/audio/DavidKBD - Pink Bloom Pack - 04 - Valley of Spirits.ogg');
    }

    create(): void {
        // Create sound objects
        try {
            this.sounds.set('glitch', this.scene.sound.add('glitch'));
            this.sounds.set('add_ingredient', this.scene.sound.add('add_ingredient'));
            this.sounds.set('satisfaction-ecstatic', this.scene.sound.add('satisfaction-ecstatic'));
            this.sounds.set('satisfaction-satisfied', this.scene.sound.add('satisfaction-satisfied'));
            this.sounds.set('satisfaction-dissatisfied', this.scene.sound.add('satisfaction-dissatisfied'));
            this.sounds.set('satisfaction-disgusted', this.scene.sound.add('satisfaction-disgusted'));
            this.sounds.set('new_customer', this.scene.sound.add('new_customer'));
            this.sounds.set('new_floor', this.scene.sound.add('new_floor'));
            
            // Create background music with a more specific type
            this.backgroundMusic = this.scene.sound.add('background-music', {
                loop: true,
                volume: this.musicVolume
            }) as Phaser.Sound.WebAudioSound | Phaser.Sound.HTML5AudioSound;
            
            console.log('Audio objects created successfully');
            
            // Setup audio unlock for autoplay restrictions
            this.setupAudioUnlock();
        } catch (error) {
            console.warn('Error creating sound objects:', error);
        }
    }
    
    private setupAudioUnlock(): void {
        if (this.scene.sound.locked) {
            console.log('Audio is locked. Waiting for user interaction to unlock...');
            
            const unlockAudio = () => {
                if (this.scene.sound.locked) {
                    this.scene.sound.unlock();
                    console.log('Audio unlocked successfully');
                }
                
                // Remove event listeners once audio is unlocked
                this.scene.input.off('pointerdown', unlockAudio);
                document.removeEventListener('click', unlockAudio);
                document.removeEventListener('touchstart', unlockAudio);
            };
            
            // Add event listeners to unlock audio
            this.scene.input.on('pointerdown', unlockAudio);
            document.addEventListener('click', unlockAudio);
            document.addEventListener('touchstart', unlockAudio);
        } else {
            console.log('Audio already unlocked');
        }
    }

    play(key: string): void {
        const sound = this.sounds.get(key);
        console.log('Playing sound:', key, sound);
        if (sound) {
            try {
                sound.play({ volume: this.volume });
            } catch (error) {
                console.warn(`Error playing sound '${key}':`, error);
            }
        } else {
            console.warn(`Sound '${key}' not found`);
        }
    }
    
    /**
     * Play background music
     * @param fadeTime Time in milliseconds to fade in (default: 1000)
     */
    playMusic(fadeTime: number = 1000): void {
        if (!this.backgroundMusic) {
            console.warn('Background music not loaded');
            return;
        }
        
        try {
            // Stop if already playing
            if (this.backgroundMusic.isPlaying) {
                this.backgroundMusic.stop();
            }
            
            // Set initial volume for fade in
            this.backgroundMusic.volume = 0;
            
            // Start playing the music
            this.backgroundMusic.play();
            
            // Fade in the music
            this.scene.tweens.add({
                targets: this.backgroundMusic,
                volume: this.musicVolume,
                duration: fadeTime,
                ease: 'Linear'
            });
            
            console.log('Background music started');
        } catch (error) {
            console.warn('Error playing background music:', error);
        }
    }
    
    /**
     * Stop the currently playing music with optional fade out
     * @param fadeTime Time in milliseconds to fade out (default: 1000)
     */
    stopMusic(fadeTime: number = 1000): void {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            if (fadeTime > 0) {
                // Fade out the music
                this.scene.tweens.add({
                    targets: this.backgroundMusic,
                    volume: 0,
                    duration: fadeTime,
                    ease: 'Linear',
                    onComplete: () => {
                        this.backgroundMusic.stop();
                    }
                });
            } else {
                this.backgroundMusic.stop();
            }
        }
    }
    
    /**
     * Pause the currently playing music
     */
    pauseMusic(): void {
        if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
            this.backgroundMusic.pause();
        }
    }
    
    /**
     * Resume the paused music
     */
    resumeMusic(): void {
        if (this.backgroundMusic && this.backgroundMusic.isPaused) {
            this.backgroundMusic.resume();
        }
    }

    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
    }
    
    /**
     * Set the volume of background music
     * @param volume Volume level between 0 and 1
     */
    setMusicVolume(volume: number): void {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        // Update current music volume if playing
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = this.musicVolume;
        }
    }
    
    isLoaded(): boolean {
        return this.assetsLoaded;
    }
} 