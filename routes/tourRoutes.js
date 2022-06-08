const { Router } = require('express')
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour
} = require('../controllers/tourControllers')

const router = Router()

// router.param('id', checkId)

router.route('/').get(getAllTours).post(createTour)

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
