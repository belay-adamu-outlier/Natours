const Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.query)

    // Build query

    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach((el) => delete queryObj[el])

    const query = Tour.find(queryObj)

    // Execute query

    const tours = await query
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
