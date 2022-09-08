const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    validator: [validator.isEmail, 'Please provide a valid email']
  },
  photo: {
    type: String,
    required: [true, 'A user must have a photo']
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password']
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
