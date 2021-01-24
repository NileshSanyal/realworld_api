const mongoose = require('mongoose')

const Schema = mongoose.Schema

const articleSchema = new Schema(
  {
    slug: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    body: { type: String, required: true },
    tagList: [String],
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

const Article = mongoose.model('Article', articleSchema)
module.exports.Article = Article
