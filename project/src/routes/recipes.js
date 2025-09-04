const express = require("express");
const controller = require("../controllers/recipesController");
const { validateRecipe } = require("../middleware/validateRecipe");
const router = express.Router();

// GET /api/recipes/stats (keep stats route before :id to avoid collision)
router.get("/stats", controller.getStats);
router.get("/", controller.getAllRecipes);
router.get("/:id", controller.getRecipeById);
router.post("/", validateRecipe, controller.createRecipe);
router.put("/:id", validateRecipe, controller.updateRecipe);
router.delete("/:id", controller.deleteRecipe);

module.exports = router;
