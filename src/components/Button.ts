import Phaser from 'phaser';

interface ButtonStyle {
    fontSize?: string;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    padding?: {
        x: number;
        y: number;
    };
    stroke?: string;
    strokeThickness?: number;
    shadow?: {
        offsetX: number;
        offsetY: number;
        color: string;
        blur: number;
        stroke: boolean;
        fill: boolean;
    };
}

export default class Button {
    private scene: Phaser.Scene;
    private text: Phaser.GameObjects.Text;
    private bg: Phaser.GameObjects.Rectangle;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, onClick?: () => void, style: ButtonStyle = {}) {
        this.scene = scene;
        
        // Default style with cyberpunk theme
        const defaultStyle: ButtonStyle = {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#00ffff',
            backgroundColor: '#1a1a3a',
            padding: {
                x: 20,
                y: 10
            },
            stroke: '#ff00ff',
            strokeThickness: 1,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                stroke: true,
                fill: true
            }
        };
        
        // Merge default and custom styles
        const buttonStyle = {...defaultStyle, ...style};
        
        // Create button text
        this.text = scene.add.text(x, y, text, buttonStyle)
            .setOrigin(0.5)
            .setPadding(buttonStyle.padding)
            .setInteractive({ useHandCursor: true });
            
        // Add background
        this.bg = scene.add.rectangle(
            x, 
            y, 
            this.text.width + buttonStyle.padding.x * 2, 
            this.text.height + buttonStyle.padding.y * 2, 
            0x1a1a3a
        ).setOrigin(0.5).setStrokeStyle(2, 0xff00ff);
        
        // Ensure text is on top
        this.bg.setDepth(1);
        this.text.setDepth(2);
        
        // Add hover and click effects
        this.text.on('pointerover', () => {
            this.bg.setStrokeStyle(2, 0x00ffff);
            this.text.setStyle({ color: '#ffffff' });
        });
        
        this.text.on('pointerout', () => {
            this.bg.setStrokeStyle(2, 0xff00ff);
            this.text.setStyle({ color: '#00ffff' });
        });
        
        this.text.on('pointerdown', () => {
            this.bg.setFillStyle(0x3a3a5a);
        });
        
        this.text.on('pointerup', () => {
            this.bg.setFillStyle(0x1a1a3a);
            if (onClick) {
                onClick();
            }
        });
    }
    
    setVisible(visible: boolean): this {
        this.text.setVisible(visible);
        this.bg.setVisible(visible);
        return this;
    }
    
    destroy(): void {
        this.text.destroy();
        this.bg.destroy();
    }
} 