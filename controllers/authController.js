const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body)

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION
  })

  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })
})
