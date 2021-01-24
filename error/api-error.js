class ApiError {
  /**
   *
   * @param {number} httpCode HTTP Code
   * @param {string} message Error message
   */
  constructor(httpCode, message) {
    this.httpCode = httpCode
    this.message = message
  }

  /**
   *
   * @param {string | string []} message Error message to display while handling bad request
   * @description It handles bad request error of the application
   */
  static badRequest(message) {
    return new ApiError(422, { errors: { body: message } })
  }
}

module.exports = ApiError
