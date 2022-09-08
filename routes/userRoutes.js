const { Router } = require('express')
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userControllers')
const { signup } = require('../controllers/authController')

const Route = Router()

Route.post('/signup', signup)

Route.route('/').get(getAllUsers).post(createUser)

Route.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = Route
