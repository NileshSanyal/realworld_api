// middleware code for validating validation schemas

const ApiError = require('../error/api-error')

/**
 *
 * @param {object} schema The validation schema to which the validation must be applied
 * @description This function acts as a middleware to validate the schema
 */
function validateSchema(schema) {
  return async (req, res, next) => {
    try {
      await schema.validate(req.body, { abortEarly: false })
      next()
    } catch (err) {
      if (Array.isArray(err.errors)) {
        next(ApiError.badRequest(err.errors))
      } else {
        next(ApiError.badRequest(err))
      }
    }
  }
}

module.exports = validateSchema
