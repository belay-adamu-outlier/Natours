const { Router } = require('express')
const {
  getTop5BestTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan
} = require('../controllers/tourControllers')
const { protect } = require('../controllers/authController')

const router = Router()

// router.param('id', checkId)
router.route('/').get(protect, getAllTours).post(createTour)
router.route('/top-5-best').get(getTop5BestTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
