import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import ingredientRouter from './routes/ingredient.routes';
import { errorHandler } from './middlewares/errorHandler';
import recipeRouter from './routes/recipe.route';

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/ingredients', ingredientRouter);
app.use('/api/recipes', recipeRouter);

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(ENV.PORT, () => {
  console.log(`✅ Server is running on http://localhost:${ENV.PORT}`);
});