const ApiError = require('./api-error')

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.httpCode).json(err.message)
  }
  return res.status(500).json({
    errors: { message: 'Something went wrong, please try again later', err: {} },
  })
}

module.exports = apiErrorHandler
