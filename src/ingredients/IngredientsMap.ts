import Ingredient from "./Ingredient";
import { BasicIngredients } from "./BasicIngredients";

export const IngredientsMap: { [key: string]: Ingredient } = {
    ...BasicIngredients,
}