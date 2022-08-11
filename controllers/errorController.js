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

  sendErrorProd(err, res)
}
