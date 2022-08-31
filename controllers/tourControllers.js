const Tour = require('../models/tourModel')
const { ApiFeatures } = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

exports.getTop5BestTours = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTours = catchAsync(async (req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(req.query)

  // build the query
  const features = new ApiFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  // Execute query
  const tours = await features.query
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) {
    return next(new AppError(`No tour found with id ${req.params.id}`, 404))
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  })
})

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour
    }
  })
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!updatedTour) {
    return next(new AppError(`No tour found with id ${req.params.id}`, 404))
  }

  res.status(204).json({
    status: 'success',
    data: {
      updatedTour
    }
  })
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) {
    return next(new AppError(`No tour found with id ${req.params.id}`, 404))
  }

  res.status(204).json({
    status: 'success'
  })
})

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4 } }
    },
    {
      $group: {
        _id: '$difficulty',
        numRecords: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: -1 }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1
  const plans = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numberOfTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $sort: {
        numberOfTourStarts: -1,
        month: -1
      }
    },
    {
      $project: { _id: 0 }
    }
  ])

  res.status(200).json({
    status: 'success',
    results: plans.length,
    data: {
      plans
    }
  })
})

// exports.checkBody = (req, res, next) => {
//   const { body: { name, price } = {} } = req
//   if (!name || !price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Missing name or price' })
//   }

//   next()
// }

// const fs = require('fs')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
// )

// exports.checkId = (req, res, next, value) => {
//   const tour = tours.find((tour) => tour.id === value * 1)

//   if (!tour) {
//     res.status(404)
//     return res.json({
//       status: 'fail',
//       message: 'Invalid id',
//     })
//   }

//   next()
// }
