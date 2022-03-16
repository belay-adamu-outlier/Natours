const Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()

    res.status(200).json({
      status: 'success',
      data: tours,
    })
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      data: err,
    })
  }
}

exports.getTour = async (req, res) => {
  const tour = Tour.findById(req.params.id)

  res.status(200)
  res.json({
    status: 'success',
    data: tour,
  })
}

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    })
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
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
