import { BasicIngredients } from "src/ingredients/BasicIngredients";
import Deck from "./Deck";

export function getPrebuiltDeck(name: string) {
    switch (name) {
        case "basic":
            return new Deck([
                ...Object.values(BasicIngredients),
                ...Object.values(BasicIngredients),
                ...Object.values(BasicIngredients),
            ]);
    }
}
