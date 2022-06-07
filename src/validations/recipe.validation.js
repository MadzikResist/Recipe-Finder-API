const Joi = require('joi');

const getRecipes = {
  body: Joi.object().keys({
    products: Joi.array().required(),
    onlySelectedIngredients: Joi.bool(),
  }),
};
const getRecipe = {
  body: Joi.object().keys({
    recipeId: Joi.string().required(),
  }),
};
const getRecipesPagination = {
  body: Joi.object(),
};
const getIngredients = {
  body: Joi.object(),
};
const updateIngredients = {
  body: Joi.object(),
};
module.exports = {
  getRecipes,
  getRecipe,
  getRecipesPagination,
  getIngredients,
  updateIngredients
};
