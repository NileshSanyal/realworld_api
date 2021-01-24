const { User } = require('../models/user.model')
const { hashPassword, verifyPassword } = require('../helpers/hash-verify.helper')
const { generateJwtToken } = require('../helpers/jwt.helper')

class UserService {
  /**
   *
   * @param {object} userObj User details such as username,email,password etc.
   * @description It performs the registration procedure of a user
   * @returns {Promise<document>} userSaved
   */
  static async saveUser(userObj) {
    const user = await User.findOne({ email: userObj.email })
    if (user) {
      throw new Error('User already exists. Please use another email address')
    } else {
      const newUser = new User()
      newUser.username = userObj.username
      newUser.email = userObj.email

      const hashedPassword = await hashPassword(userObj.password)

      newUser.password = hashedPassword
      const userSaved = await newUser.save()
      return userSaved
    }
  }

  /**
   *
   * @param {object} loginDetails Login credentials such as email and password
   * @description It performs the login procedure of a user
   * @returns {Promise<document>} userDetails
   */
  static async loginUser(loginDetails) {
    let userDetails = {}
    const user = await User.findOne({ email: loginDetails.email })
    if (user) {
      const isVerified = await verifyPassword(loginDetails.password, user.password)
      if (isVerified) {
        const token = generateJwtToken(user)
        userDetails = {
          email: user.email,
          token,
          username: user.username,
          bio: user.bio,
          image: user.image,
        }
        return userDetails
      } else {
        throw new Error('Invalid Email or password')
      }
    } else {
      throw new Error('User does not exist')
    }
  }

  /**
   *
   * @param {string} userId User id
   * @description It gets details about the currently logged in user
   * @returns {Promise<document>} currentUserDetails
   */
  static async currentUser(userId) {
    const currentUserDetails = await User.findById(userId, {
      _id: 0,
      __v: 0,
      password: 0,
    })
    return currentUserDetails
  }

  /**
   *
   * @param {string} userId User id
   * @param {object} updatedUserData User details
   * @description It updates details for the currently logged in user
   * @returns {Promise<document>} updatedUserDetails
   */
  static async updateUser(userId, updatedUserData) {
    try {
      let { email, username, password, image, bio } = updatedUserData
      const updateUserObj = {}
      if (password !== undefined) {
        password = await hashPassword(password)
        updateUserObj.password = password
      }

      if (email !== undefined) {
        updateUserObj.email = email
      }

      if (username !== undefined) {
        updateUserObj.username = username
      }

      if (image !== undefined) {
        updateUserObj.image = image
      }

      if (bio !== undefined) {
        updateUserObj.bio = bio
      }
      const updatedUserDetails = await User.findByIdAndUpdate(userId, updateUserObj, {
        new: true,
        useFindAndModify: false,
        fields: { _id: 0, __v: 0 },
      })
      return updatedUserDetails
    } catch (err) {
      throw new Error(err)
    }
  }

  /**
   *
   * @param {string} userName Name of the user
   * @description It returns profile details of a user
   * @returns {Promise<document>} userProfileDetails
   */
  static async userProfile(userName) {
    const userProfileDetails = await User.findOne(
      { username: userName },
      { _id: 0, __v: 0, email: 0, password: 0 }
    )
    return userProfileDetails
  }

  /**
   *
   * @param {string} authorName Author name whom an user want to follow
   * @param {string} userId Id of the user who want to follow that author
   * @returns {Promise<document>} followedUserDetails
   * @description It adds the functionality to follow an author
   */
  static async followUser(authorName, userId) {
    const authorProfileDetails = await User.findOne({ username: authorName })
    if (authorProfileDetails) {
      const authorId = authorProfileDetails._id

      const followerDetails = await User.findById(userId)

      if (followerDetails.following.indexOf(authorId) === -1) {
        followerDetails.following.push(authorId)
      }

      const updatedfollowerDetails = await User.findByIdAndUpdate(
        userId,
        { following: followerDetails.following },
        {
          new: true,
          useFindAndModify: false,
          fields: { _id: 0, __v: 0, password: 0, favorites: 0 },
        }
      )
      return updatedfollowerDetails
    }
  }

  /**
   *
   * @param {string} authorName Author name whom an user want to unfollow
   * @param {string} userId Id of the user who want to unfollow that author
   * @returns {Promise<document>} unFollowedUserDetails
   * @description It adds the functionality to unfollow an author
   */
  static async unFollowUser(authorName, userId) {
    const authorProfileDetails = await User.findOne({ username: authorName })
    if (authorProfileDetails) {
      const authorId = authorProfileDetails._id

      const followerDetails = await User.findById(userId)

      const foundFollower = followerDetails.following.find(
        (author) => author === authorId
      )
      if (foundFollower !== 'undefined') {
        const authorIndex = followerDetails.following.indexOf(authorId)
        if (authorIndex > -1) {
          followerDetails.following.splice(authorIndex, 1)
        }

        const updatedfollowerDetails = await User.findByIdAndUpdate(
          userId,
          { following: followerDetails.following },
          {
            new: true,
            useFindAndModify: false,
            fields: { _id: 0, __v: 0, password: 0, favorites: 0 },
          }
        )
        return updatedfollowerDetails
      }
    }
  }

  /**
   *
   * @param {string} articleId Id of the article
   * @param {string} userId Id of the user
   * @description It checks whether an article has already been favorited by an user
   * @returns {Promise<document>} articleId
   */
  static async isAlreadyFavorited(articleId, userId) {
    const articleDetails = await User.findById(userId)
    if (articleDetails.favorites.indexOf(articleId) === -1) {
      articleDetails.favorites.push(articleId)

      const favorited = await User.findByIdAndUpdate(
        userId,
        { favorites: articleDetails.favorites },
        { new: true, useFindAndModify: false }
      )

      return favorited
    }
  }

  /**
   *
   * @param {string} articleId Id of the article
   * @param {string} userId Id of the user
   * @description It removes an article from favorited list by an user
   * @returns {string} articleId
   */
  static async isRemovedFromFavorited(articleId, userId) {
    const userDetails = await User.findById(userId)
    const foundFavoriteArticle = userDetails.favorites.find(
      (favoriteArticleId) => favoriteArticleId === articleId
    )
    if (foundFavoriteArticle !== 'undefined') {
      const articleIndex = userDetails.favorites.indexOf(articleId)
      if (articleIndex > -1) {
        userDetails.favorites.splice(articleIndex, 1)
      }

      await User.findByIdAndUpdate(
        userId,
        { favorites: userDetails.favorites },
        { new: true, useFindAndModify: false }
      )

      return articleId
    }
  }
}

module.exports = UserService
