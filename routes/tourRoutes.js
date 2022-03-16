const { Router } = require('express')
const {
  getAllTours,
  createTour,
  getTour,
} = require('../controllers/tourControllers')

const router = Router()

// router.param('id', checkId)

router.route('/').get(getAllTours).post(createTour)

router.route('/:id').get(getTour)

module.exports = router
