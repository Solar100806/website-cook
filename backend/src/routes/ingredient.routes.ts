import { Router } from "express";
import { IngredientController } from "../controllers/ingredient.controller";

const ingredientRouter = Router();
const controller = new IngredientController();

// Định nghĩa endpoint: GET
ingredientRouter.get("/search", controller.search);
ingredientRouter.get('/popular', controller.getPopular);

export default ingredientRouter;