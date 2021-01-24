const articleController = require('../controllers/article.controller')
const auth = require('../middlewares/auth.middleware')
const articleValidationSchema = require('../validation-schemas/article-validation.schema')
const validateSchema = require('../middlewares/validate-schema')

module.exports = function (app) {
  app.get('/api/tags', articleController.getAllTags)
  app.get('/api/articles', articleController.getAllArticles)
  app.get('/api/articles/:slug', articleController.getArticle)
  app.post(
    '/api/articles',
    auth,
    validateSchema(articleValidationSchema),
    articleController.createArticle
  )
  app.put('/api/articles/:slug', auth, articleController.editArticle)
  app.delete('/api/articles/:slug', auth, articleController.removeArticle)
  app.get('/api/articles/feed', auth, articleController.articlesFeed)
  app.post('/api/articles/:slug/favorite', auth, articleController.favoriteArticle)
  app.delete('/api/articles/:slug/favorite', auth, articleController.unFavoriteArticle)
}
