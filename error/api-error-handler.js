const ApiError = require('./api-error');

function apiErrorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.httpCode).json({ message: err.message });
  }
  return res.status(500).json({
    message: 'Something went wrong, please try again later',
  });
}

module.exports = apiErrorHandler;
