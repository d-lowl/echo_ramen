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
    width?: number;
    height?: number;
    bgColor?: number;
    hoverColor?: number;
}

export default class Button {
    private scene: Phaser.Scene;
    private text: Phaser.GameObjects.Text;
    private bg: Phaser.GameObjects.Rectangle;
    private shadow: Phaser.GameObjects.Rectangle;

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
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 3,
                stroke: true,
                fill: true
            },
            bgColor: 0x222255,
            hoverColor: 0x334499
        };
        
        // Merge default and custom styles
        const buttonStyle = {...defaultStyle, ...style};
        
        // Create text with basic styles first (without shadow effects that cause overflow)
        const textStyle = {
            fontFamily: buttonStyle.fontFamily,
            fontSize: buttonStyle.fontSize,
            color: buttonStyle.color,
            stroke: buttonStyle.stroke,
            strokeThickness: buttonStyle.strokeThickness
        };
        
        // Create button text
        this.text = scene.add.text(x, y, text, textStyle)
            .setOrigin(0.5)
            
        // Calculate dimensions based on text and style
        const width = buttonStyle.width || (this.text.width + buttonStyle.padding.x * 2);
        const height = buttonStyle.height || (this.text.height + buttonStyle.padding.y * 2);
        
        // Add background with proper dimensions to contain the text
        this.bg = scene.add.rectangle(
            x, 
            y, 
            width + 10, // Add extra padding to accommodate glow effects
            height + 10, 
            buttonStyle.bgColor
        ).setOrigin(0.5).setStrokeStyle(2, 0xff00ff);
        
        // Shadow effect for 3D appearance
        this.shadow = scene.add.rectangle(
            x + 4, 
            y + 4, 
            width + 10,
            height + 10, 
            0x000000,
            0.3
        ).setOrigin(0.5);
        
        // Ensure proper rendering order
        this.shadow.setDepth(0);
        this.bg.setDepth(1);
        this.text.setDepth(2);
        
        // Make text interactive after setting all properties
        this.text.setInteractive({ useHandCursor: true });
        
        // Add hover and click effects
        this.text.on('pointerover', () => {
            this.bg.setStrokeStyle(2, 0x00ffff);
            this.text.setStyle({ color: '#ffffff' });
            if (buttonStyle.hoverColor) {
                this.bg.setFillStyle(buttonStyle.hoverColor);
            }
        });
        
        this.text.on('pointerout', () => {
            this.bg.setStrokeStyle(2, 0xff00ff);
            this.text.setStyle({ color: '#00ffff' });
            if (buttonStyle.bgColor) {
                this.bg.setFillStyle(buttonStyle.bgColor);
            }
        });
        
        this.text.on('pointerdown', () => {
            this.bg.setFillStyle(0x3a3a5a);
        });
        
        this.text.on('pointerup', () => {
            if (buttonStyle.bgColor) {
                this.bg.setFillStyle(buttonStyle.bgColor);
            } else {
                this.bg.setFillStyle(0x222255);
            }
            if (onClick) {
                onClick();
            }
        });
    }
    
    setVisible(visible: boolean): this {
        this.text.setVisible(visible);
        this.bg.setVisible(visible);
        this.shadow.setVisible(visible);
        return this;
    }
    
    destroy(): void {
        this.text.destroy();
        this.bg.destroy();
        this.shadow.destroy();
    }

    getGameObjects(): (Phaser.GameObjects.Text | Phaser.GameObjects.Rectangle)[] {
        return [this.shadow, this.bg, this.text];
    }
} 