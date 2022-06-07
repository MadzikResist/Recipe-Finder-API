const catchAsync = require('../utils/catchAsync');
const { Recipe, User } = require('../models');

const getRecipes = catchAsync(async ({ body: { products, onlySelectedIngredients } }, res) => {
  if (onlySelectedIngredients) {
    let recipes = await Recipe.find({
      'extendedIngredients.name': { $in: products.map((product) => new RegExp(`.*${product}.*`)) },
    }).lean();
    recipes = recipes?.filter((recipe) => {
      const ingredients = recipe?.extendedIngredients?.map((ing) => ing?.name);
      if (ingredients?.some((ing) => !products.find((el) => el.includes(ing) || ing.includes(el)))) {
        return false;
      }
      return true;
    });
    res.send({ recipes });
    return;
  }
  const recipes = await Recipe.find({
    'extendedIngredients.name': { $in: products.map((product) => new RegExp(`.*${product}.*`)) },
  })
    .limit(100)
    .lean();

  let sortedRecipes = {};

  recipes.forEach((recipe) => {
    let countIngredients = 0;
    const ingredients = recipe?.extendedIngredients?.map((ing) => ing?.name) || [];

    if (ingredients?.length) {
      ingredients.forEach((ing) => {
        if (products.find((el) => el.includes(ing) || ing.includes(el))) {
          countIngredients += 1;
        }
      });
    }

    const percentage = parseInt(Math.round((countIngredients / ingredients.length) * 100));

    if (sortedRecipes?.[percentage]?.length) {
      sortedRecipes[percentage] = [...sortedRecipes[percentage], recipe];
    } else {
      sortedRecipes[percentage] = [recipe];
    }
  });
  sortedRecipes = Object.fromEntries(Object.entries(sortedRecipes).sort(([a], [b]) => a - b));
  res.send({ recipes: sortedRecipes });
});
const getRecipe = catchAsync(async ({ body: { recipeId } }, res) => {
  const recipe = await Recipe.findById(recipeId).lean();
  res.send(recipe);
});
const getRecipesPagination = catchAsync(async ({ body: { cursor } }, res) => {
  const limit = 16;
  const parsedCursor = !!cursor && JSON.parse(cursor);
  const cursorOptions = parsedCursor || {};
  const querySearchUser = {};
  if (cursorOptions?.lastId) {
    querySearchUser._id = { $gt: cursorOptions?.lastId };
  }
  if (cursorOptions?.title) {
    querySearchUser.title = { $regex: cursorOptions.title, $options: 'i' };
  }
  const recipes = await Recipe.find(querySearchUser)
    .limit(limit + 1)
    .lean();
  const hasNextPage = recipes?.length > limit;
  if (hasNextPage) {
    recipes.pop();
  }
  res.send({
    edges: recipes,
    pageInfo: {
      endCursor: recipes[recipes.length - 1]._id,
      hasNextPage,
    },
  });
});
const updateIngredients = catchAsync(async ({ body: { userIngredients, _id } }, res) => {
  await User.findByIdAndUpdate(_id, { $set: { userIngredients } }).lean();
  res.send({});
});
const getIngredients = catchAsync(async ({ body }, res) => {
  const foundUser = await User.findById(body?._id).lean();
  res.send({ userIngredients: foundUser?.userIngredients || [] });
});
module.exports = {
  getRecipes,
  getRecipe,
  getRecipesPagination,
  updateIngredients,
  getIngredients,
};
