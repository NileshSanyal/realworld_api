const jwt = require('jsonwebtoken')

/**
 *
 * @param {object} userObj An object containing user details
 * @returns {string} token
 * @description It generates a json web token and uses user id as a payload to
 * generate that token
 */
exports.generateJwtToken = (userObj) => {
  const token = jwt.sign({ _id: userObj._id }, process.env.JWT_SECRET, {
    algorithm: 'HS512',
    expiresIn: '1d',
  })
  return token
}

/**
 *
 * @param {string} token A token to verify
 * @description It verifies a json web token and then decodes
 * that token after using jwt secret key
 * @returns {any} decodedData
 */
exports.verifyJwtToken = (token) => {
  const decodedData = jwt.verify(token, process.env.JWT_SECRET, { algorithms: 'HS512' })
  return decodedData
}
