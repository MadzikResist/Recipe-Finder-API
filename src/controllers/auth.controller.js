const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, tokenService } = require('../services');
const { User, Recipe } = require('../models');
const ApiError = require('../utils/ApiError');
const Token = require('../models/token.model');
const { tokenTypes } = require('../config/tokens');
const bcrypt = require('bcryptjs');

const arr=[]

const register = catchAsync(async ({ body }, res) => {
  // let i=0;
  // for (const args of arr) {
  //   console.log('Args', args.id);
  //   console.log("element", i);
  //   const recipe = await Recipe.findOne({ id: args.id }, { _id: 1 }).lean();
  //   if (!recipe) {
  //     await new Recipe(args).save();
  //   }
  //   i++;
  // }

  if (await User.isEmailTaken(body.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const user = await User.create(body);
  const [tokens] = await Promise.all([tokenService.generateAuthTokens(user), tokenService.generateVerifyEmailToken(user)]);
  res.status(httpStatus.CREATED).send({ tokens, _id: user?._id });
});

const login = catchAsync(async ({ body }, res) => {
  const { email, password } = body;
  const user = await User.findOne({ email }, { _id: 1, password: 1, name: 1 }).lean();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ tokens, _id: user?._id });
});

const logout = catchAsync(async ({ body }, res) => {
  const refreshTokenDoc = await Token.findOneAndDelete({
    token: body.refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  })
    .select({ _id: 1 })
    .lean();
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async ({ body, query }, res) => {
  await authService.resetPassword(query.token, body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async ({ query }, res) => {
  await authService.verifyEmail(query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  resetPassword,
  verifyEmail,
};
