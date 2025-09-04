const { readDb, writeDb } = require("../utils/fileDb");
const { v4: uuidv4 } = require("uuid");
async function getAllRecipes(req, res, next) {
  try {
    const recipes = await readDb();
    let result = recipes;
    // filtering
    const { difficulty, maxCookingTime, search } = req.query;
    if (difficulty) {
      result = result.filter((r) => r.difficulty === difficulty);
    }
    if (maxCookingTime) {
      const max = Number(maxCookingTime);
      if (!Number.isNaN(max))
        result = result.filter((r) => r.cookingTime <= max);
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        (r) =>
          (r.title && r.title.toLowerCase().includes(q)) ||
          (r.description && r.description.toLowerCase().includes(q))
      );
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}
async function getRecipeById(req, res, next) {
  try {
    const id = req.params.id;
    const recipes = await readDb();
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe)
      return res
        .status(404)
        .json({ error: true, message: "Recipe not found", statusCode: 404 });
    res.json(recipe);
  } catch (err) {
    next(err);
  }
}
async function createRecipe(req, res, next) {
  try {
    const payload = req.body;
    const recipes = await readDb();
    const newRecipe = {
      id: uuidv4(),
      title: payload.title,
      description: payload.description,
      ingredients: payload.ingredients,
      instructions: payload.instructions,
      cookingTime: payload.cookingTime,
      servings: payload.servings,
      difficulty: payload.difficulty,
      rating: typeof payload.rating === "number" ? payload.rating : null,
      createdAt: new Date().toISOString(),
    };
    recipes.push(newRecipe);
    await writeDb(recipes);
    res.status(201).json(newRecipe);
  } catch (err) {
    next(err);
  }
}
async function updateRecipe(req, res, next) {
  try {
    const id = req.params.id;
    const payload = req.body;
    const recipes = await readDb();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1)
      return res
        .status(404)
        .json({ error: true, message: "Recipe not found", statusCode: 404 });
    // keep immutable fields: id, createdAt
    const updated = Object.assign({}, recipes[idx], {
      title: payload.title,
      description: payload.description,
      ingredients: payload.ingredients,
      instructions: payload.instructions,
      cookingTime: payload.cookingTime,
      servings: payload.servings,
      difficulty: payload.difficulty,
      rating:
        typeof payload.rating === "number"
          ? payload.rating
          : recipes[idx].rating,
    });
    recipes[idx] = updated;
    await writeDb(recipes);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
async function deleteRecipe(req, res, next) {
  try {
    const id = req.params.id;
    const recipes = await readDb();
    const idx = recipes.findIndex((r) => r.id === id);
    if (idx === -1)
      return res
        .status(404)
        .json({ error: true, message: "Recipe not found", statusCode: 404 });
    recipes.splice(idx, 1);
    await writeDb(recipes);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
async function getStats(req, res, next) {
  try {
    const recipes = await readDb();
    const total = recipes.length;
    const avgCookingTime =
      total === 0
        ? 0
        : recipes.reduce((s, r) => s + (r.cookingTime || 0), 0) / total;
    const byDifficulty = recipes.reduce((acc, r) => {
      acc[r.difficulty] = (acc[r.difficulty] || 0) + 1;
      return acc;
    }, {});
    // most common ingredients (bonus): flatten and count
    const ingredientCounts = {};
    recipes.forEach((r) => {
      if (Array.isArray(r.ingredients)) {
        r.ingredients.forEach((ing) => {
          const key = String(ing).toLowerCase().trim();
          if (!key) return;
          ingredientCounts[key] = (ingredientCounts[key] || 0) + 1;
        });
      }
    });
    const mostCommonIngredients = Object.entries(ingredientCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ingredient, count]) => ({ ingredient, count }));
    res.json({ total, avgCookingTime, byDifficulty, mostCommonIngredients });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getStats,
};
