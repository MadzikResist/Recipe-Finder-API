const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/recipe.validation');
const authController = require('../../controllers/recipe.controller');

const router = express.Router();

router.post('/get-recipes', validate(authValidation.getRecipes), authController.getRecipes);
router.post('/update-ingredients', validate(authValidation.updateIngredients), authController.updateIngredients);
router.post('/get-ingredients', validate(authValidation.getIngredients), authController.getIngredients);
router.post('/get-recipe', validate(authValidation.getRecipe), authController.getRecipe);
router.post('/get-recipes-pagination', validate(authValidation.getRecipesPagination), authController.getRecipesPagination);

module.exports = router;

