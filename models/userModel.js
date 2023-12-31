const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minLength: 8
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validator: {
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same!'
    }
  },
  passwordChangedAt: Date
})

userSchema.pre('save', async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified('password')) return next()

  //hash the password with cost of 12. the number indicates how cpu intensive the hashing is
  this.password = await bcrypt.hash(this.password, 12)

  // Delete passwordConfirm field as it is not needed
  this.passwordConfirm = undefined

  next()
})

userSchema.methods.isCorrectPassword = async (
  candidatePassword,
  userPassword
) => bcrypt.compare(candidatePassword, userPassword)

userSchema.methods.hasPasswordChangedAfterTokenIssued = function (
  JWTTimeStamp
) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt.getTime() / 1000 > JWTTimeStamp
  }

  return false
}

const User = mongoose.model('User', userSchema)

module.exports = User
