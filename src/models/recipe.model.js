const mongoose = require('mongoose');

const productMatchesSchema = mongoose.Schema({
  averageRating: Number,
  description: String,
  imageUrl: String,
  link: String,
  price: String,
  ratingCount: Number,
  score: Number,
  title: String,
});
const lengthSchema = mongoose.Schema({
  number: Number,
  unit: String,
});
const equipmentSchema = mongoose.Schema({
  image: String,
  localizedName: String,
  name: String,
});
const stepsSchema = mongoose.Schema({
  equipment: [equipmentSchema],
  ingredients: [equipmentSchema],
  length: [lengthSchema],
  number: Number,
  step: String,
});
const analyzedInstructionsSchema = mongoose.Schema({
  name: String,
  steps: [stepsSchema],
});
const nutrientsSchema = mongoose.Schema({
  amount: Number,
  name: String,
  percentOfDailyNeeds: Number,
  unit: String,
});
const ingredientsSchema = mongoose.Schema({
  amount: Number,
  name: String,
  nutrients: [nutrientsSchema], //without percentOfDailyNeeds
  unit: String,
});
const propertiesSchema = mongoose.Schema({
  amount: Number,
  name: String,
  unit: String,
});
const weightPerServingSchema = mongoose.Schema({
  amount: Number,
  unit: String,
});
const flavonoidsSchema = mongoose.Schema({
  amount: Number,
  name: String,
  unit: String,
});
const caloricBreakdownSchema = mongoose.Schema({
  percentCarbs: Number,
  percentFat: Number,
  percentProtein: Number,
});
const nutritionSchema = mongoose.Schema({
  caloricBreakdown: caloricBreakdownSchema,
  flavonoids: [flavonoidsSchema],
  ingredients: [ingredientsSchema],
  nutrients: [nutrientsSchema],
  properties: [propertiesSchema],
  weightPerServing: weightPerServingSchema,
});
const winePairingSchema = mongoose.Schema({
  pairedWines: [String],
  pairingText: String,
  productMatches: [productMatchesSchema],
});
const measures = mongoose.Schema({
  amount: Number,
  unitLong: String,
  unitShort: String,
});
const measuresSchema = mongoose.Schema({
  metric: measures,
  us: measures,
});
const extendedIngredients = mongoose.Schema({
  aisle: [String],
  amount: Number,
  consistency: String,
  image: String,
  measures: measuresSchema,
  meta: [String],
  name: String,
  nameClean: String,
  original: String,
  originalName: String,
  unit: String,
});
const recipeSchema = mongoose.Schema({
  aggregateLikes: Number,
  analyzedInstructions: [analyzedInstructionsSchema],
  cheap: Boolean,
  creditsText: String,
  cuisines: [String],
  dairyFree: Boolean,
  dishTypes: [String],
  extendedIngredients: [extendedIngredients],
  gaps: String,
  glutenFree: Boolean,
  healthScore: Number,
  image: String,
  imageType: String,
  instructions: String,
  lowFodmap: Boolean,
  nutrition: [nutritionSchema],
  occasions: [],
  pricePerServing: Number,
  readyInMinutes: Number,
  servings: Number,
  summary: String,
  sustainable: Boolean,
  title: String,
  vegan: Boolean,
  vegetarian: Boolean,
  veryHealthy: Boolean,
  veryPopular: Boolean,
  winePairing: winePairingSchema,
  id: String,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
