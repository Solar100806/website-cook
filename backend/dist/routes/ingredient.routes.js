"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingredient_controller_1 = require("../controllers/ingredient.controller");
const ingredientRouter = (0, express_1.Router)();
const controller = new ingredient_controller_1.IngredientController();
// Định nghĩa endpoint: GET
ingredientRouter.get("/search", controller.search);
ingredientRouter.get('/popular', controller.getPopular);
exports.default = ingredientRouter;
