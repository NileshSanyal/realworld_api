const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12

/**
 *
 * @param {string} plainTextPassword Plain text password
 * @description Generates salt, then using that salt generates a hash
 * for storing password
 */
exports.hashPassword = async (plainTextPassword) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  const hash = await bcrypt.hash(plainTextPassword, salt)
  return hash
}

/**
 *
 * @param {string} plainTextPassword Plain text password
 * @param {string} hashedPassword Hashed password
 * @returns {Promise<boolean>} isVerified
 * @description Checks if plaintext password matches with hashed password
 */
exports.verifyPassword = async (plainTextPassword, hashedPassword) => {
  const isVerified = await bcrypt.compare(plainTextPassword, hashedPassword)
  return isVerified
}
