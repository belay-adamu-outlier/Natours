const { Router } = require('express')
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/userControllers')

const Route = Router()

Route.route('/').get(getAllUsers).post(createUser)

Route.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = Route
