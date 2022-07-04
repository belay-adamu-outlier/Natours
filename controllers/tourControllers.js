const Tour = require('../models/tourModel')
const { ApiFeatures } = require('../utils/apiFeatures')

exports.getTop5BestTours = async (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      data: err
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = Tour.findById(req.params.id)
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    })
  } catch (err) {
    res.status(200).json({
      status: 'success',
      data: {
        message: err
      }
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour
      }
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!'
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })

    res.status(204).json({
      status: 'success',
      data: {
        updatedTour
      }
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success'
    })
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    })
  }
}

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(200).json({
      status: 'success',
      data: {
        message: err
      }
    })
  }
}

exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1

  try {
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
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err
    })
  }
}

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
