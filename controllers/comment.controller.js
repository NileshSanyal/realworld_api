const { getArticle } = require('../services/article.service')
const {
  saveComment,
  getComment,
  getAllComments,
  removeComment,
} = require('../services/comment.service')

exports.addComment = async (req, res, next) => {
  getArticle(req.params.slug)
    .then((article) => {
      if (article) {
        saveComment(req.user._id, req.body.comment, req.params.slug).then((isSaved) => {
          if (isSaved) return res.status(200).json({ comment: isSaved })
        })
      } else {
        return res.sendStatus(404)
      }
    })
    .catch(next)
}

exports.getComments = async (req, res, next) => {
  getArticle(req.params.slug)
    .then((article) => {
      if (article) {
        getAllComments(req.params.slug).then((comments) => {
          if (comments) return res.status(200).json({ comments })
        })
      } else {
        return res.sendStatus(404)
      }
    })
    .catch(next)
}

exports.removeComment = async (req, res, next) => {
  getArticle(req.params.slug)
    .then((article) => {
      getComment(req.params.id).then((comment) => {
        if (article && comment) {
          const deletedComment = removeComment(
            req.user._id,
            req.params.slug,
            req.params.id
          )
          if (deletedComment) {
            return res.status(200).json({ message: 'Comment Deleted Successfully' })
          }
        } else {
          return res.sendStatus(404)
        }
      })
    })
    .catch(next)
}
