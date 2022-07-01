const { Router } = require('express')
const {
  getTop5BestTours,
  getAllTours,
  getTour,
  getTourStats,
  createTour,
  updateTour,
  deleteTour
} = require('../controllers/tourControllers')

const router = Router()

// router.param('id', checkId)
router.route('/').get(getAllTours).post(createTour)
router.route('/top-5-best').get(getTop5BestTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
