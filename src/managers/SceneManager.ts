import Phaser from 'phaser';

// The SceneConstructor type needs to be the class type, not instance type
type SceneConstructor = typeof Phaser.Scene;

/**
 * SceneManager - Handles scene transitions and data passing
 */
export default class SceneManager {
    private game: Phaser.Game;
    private scenes: Record<string, SceneConstructor>;
    private currentScene: string | null;

    constructor(game: Phaser.Game) {
        this.game = game;
        this.scenes = {};
        this.currentScene = null;
    }

    /**
     * Register a scene with the manager
     * @param {string} key - The scene key
     * @param {SceneConstructor} sceneClass - The scene class
     */
    register(key: string, sceneClass: SceneConstructor): void {
        this.scenes[key] = sceneClass;
        this.game.scene.add(key, sceneClass);
    }

    /**
     * Start a scene and optionally pass data to it
     * @param {string} key - The scene key to start
     * @param {object} data - Optional data to pass to the scene
     */
    start(key: string, data: object = {}): void {
        if (!this.scenes[key]) {
            console.error(`Scene ${key} not registered with SceneManager`);
            return;
        }

        // If we have a current scene, stop it first
        if (this.currentScene) {
            this.game.scene.stop(this.currentScene);
        }

        // Start the new scene with data
        this.game.scene.start(key, data);
        this.currentScene = key;
    }

    /**
     * Transition to a new scene with a fade effect
     * @param {string} key - The scene key to transition to
     * @param {object} data - Optional data to pass to the scene
     * @param {number} duration - Transition duration in milliseconds
     */
    transition(key: string, data: object = {}, duration: number = 500): void {
        if (!this.scenes[key]) {
            console.error(`Scene ${key} not registered with SceneManager`);
            return;
        }

        const currentScene = this.game.scene.getScene(this.currentScene);
        
        if (currentScene) {
            currentScene.cameras.main.fadeOut(duration);
            
            currentScene.cameras.main.once('camerafadeoutcomplete', () => {
                this.start(key, data);
                const targetScene = this.game.scene.getScene(key);
                if (targetScene) {
                    targetScene.cameras.main.fadeIn(duration);
                }
            });
        } else {
            this.start(key, data);
            const targetScene = this.game.scene.getScene(key);
            if (targetScene) {
                targetScene.cameras.main.fadeIn(duration);
            }
        }
    }
} 