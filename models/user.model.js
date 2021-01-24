const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  bio: { type: String },
  image: { type: String },
  favorites: [{ type: mongoose.Types.ObjectId, ref: 'Article' }],
  following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
})

const User = mongoose.model('User', userSchema)
module.exports.User = User
