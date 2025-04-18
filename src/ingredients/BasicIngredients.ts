import { BasicEffect } from "../attributes/Effects";
import Ingredient from "./Ingredient";

export const BasicIngredients: { [key: string]: Ingredient } = {
    "synthetic_miso": new Ingredient("Synthetic Miso", [
        new BasicEffect("Richness", 2),
        new BasicEffect("Sweetness", -1),
    ]),
    "nano_chili_oil": new Ingredient("Nano-Chili Oil", [
        new BasicEffect("Spiciness", 2),
        new BasicEffect("Richness", -1),
    ]),
    "bio_engineered_green_onions": new Ingredient("Bio-Engineered Green Onions", [
        new BasicEffect("Sweetness", 2),
        new BasicEffect("Spiciness", -1),
    ]),
    "quantum_lightness_broth": new Ingredient("Quantum Lightness Broth", [
        new BasicEffect("Richness", -2),
        new BasicEffect("Sweetness", 1),
    ]),
    "cryo_mildness_extract": new Ingredient("Cryo-Mildness Extract", [
        new BasicEffect("Spiciness", -2),
        new BasicEffect("Richness", 1),
    ]),
    "synthetic_savory_umami": new Ingredient("Synthetic Savory Umami", [
        new BasicEffect("Sweetness", -2),
        new BasicEffect("Spiciness", 1),
    ]),
}