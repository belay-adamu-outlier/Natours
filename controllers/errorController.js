const AppError = require('../utils/appError')

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400)

const handleDuplicateFieldsDB = (err) => {
  console.log(err)
  const duplicateField = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0]

  return new AppError(
    `Duplicate field in ${duplicateField}. Please use another value`,
    400
  )
}

const handleValidationErrorsDB = (err) => {
  const errorMessages = Object.values(err.errors).map((value) => value.message)
  return new AppError(`Invalid input Data: ${errorMessages.join('. ')}`, 400)
}

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }

  // Programming or other unknown error: don't leak error details
  // eslint-disable-next-line no-console
  console.error('ERROR: ', err)

  res.status(err.statusCode).json({
    status: 'error',
    message: 'Something went very wrong!'
  })
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    return sendErrorDev(err, res)
  }

  let error = JSON.parse(JSON.stringify(err))

  if (error.name === 'CastError') error = handleCastErrorDB(error)
  if (error.code === 11000) error = handleDuplicateFieldsDB(err)
  if (error.name === 'ValidationError') error = handleValidationErrorsDB(err)

  sendErrorProd(error, res)
}
