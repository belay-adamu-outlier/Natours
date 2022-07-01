const Tour = require('../models/tourModel')

exports.getAllTours = async (req, res) => {
  try {
    // eslint-disable-next-line no-console
    console.log(req.query)

    // Build query

    let queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']

    excludedFields.forEach((el) => delete queryObj[el])

    // Advanced query

    // queryStrings with greater than or less than etc... operators are written as
    // price[gte]=1000, price[lte]=2000 (/?price[gte]=1000&price[lte]=2000)
    // when accessed from query object they come in the form => price: { gte: 1000, lte: 2000 }
    // we need to convert the keys to $gte and $lte etc... for mongo to reconize them as operators

    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )

    queryObj = JSON.parse(queryString)
    let query = Tour.find(queryObj)

    // Sorting

    if (req.query.sort) {
      // mongoose uses field names(strings) for sorting
      // you can use multiple field names separated by a space to sort a query.
      // if there are ties in the sort order, mongoose will use the additional field names to further sort the query.
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // Fields selecting

    // if the fields parameter is specified, mongoose will only return the fields specified in the fields parameter.

    if (req.query.fields) {
      const fields = req.query.fields.split(',').concat('-__v').join(' ')
      query = query.select(fields)
    } else {
      // the minus sign tells mongoose to exclude the field
      query = query.select('-__v')
    }

    // Pagination

    const { page = 1, limit = 10 } = req.query
    const skipped = (page - 1) * limit
    query = query.skip(skipped).limit(parseInt(limit, 10))

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (numTours <= skipped) throw new Error('This page does not exist')
    }

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
