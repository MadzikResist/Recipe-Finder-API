const express = require('express');
const authRoute = require('./auth.route');
const recipeRoute = require('./recipe.route');
const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/recipe',
    route: recipeRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
