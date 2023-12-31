const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION
  })

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  })

  const token = signToken(newUser._id)

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password)
    return next(new AppError('Please provide email and password'), 400)

  const user = await User.findOne({ email }).select('+password')

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new AppError('Incorrect user or password', 400))

  const token = signToken(user._id)

  res.status(200).json({
    status: 'success',
    token
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers
  let token

  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1]
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    )
  }

  // This will throw error if token is invalid or if token has expired
  const decodedJWT = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  const user = await User.findById(decodedJWT.id)

  if (!user) {
    return next(
      new AppError('The user belonging to this token no longer exists!', 401)
    )
  }

  if (user.hasPasswordChangedAfterTokenIssued(decodedJWT.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    )
  }

  req.user = user

  next()
})
