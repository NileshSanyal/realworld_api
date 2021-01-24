const commentController = require('../controllers/comment.controller')
const auth = require('../middlewares/auth.middleware')
const commentValidationSchema = require('../validation-schemas/comment-validation.schema')
const validateSchema = require('../middlewares/validate-schema')

module.exports = function (app) {
  app.post(
    '/api/articles/:slug/comments',
    auth,
    validateSchema(commentValidationSchema),
    commentController.addComment
  )
  app.get('/api/articles/:slug/comments', commentController.getComments)
  app.delete('/api/articles/:slug/comments/:id', auth, commentController.removeComment)
}
