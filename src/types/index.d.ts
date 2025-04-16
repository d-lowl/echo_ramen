// This file ensures Phaser types are available throughout the project
import 'phaser';

export interface TextStyle {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    stroke?: string;
    strokeThickness?: number;
    fill?: string;
}

export interface ButtonStyle {
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