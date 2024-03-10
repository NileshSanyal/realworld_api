const articleController = require('../controllers/article.controller');
const { isAuthenticatedUser } = require('../middlewares/auth.middleware');
const articleValidationSchema = require('../validation-schemas/article-validation.schema');
const validateSchema = require('../middlewares/validate-schema');

module.exports = function (app) {
  app.get('/api/tags', articleController.getAllTags);
  app.get('/api/articles', articleController.getAllArticles);
  app.get('/api/articles/:slug', articleController.getArticle);
  app.post(
    '/api/articles',
    isAuthenticatedUser,
    validateSchema(articleValidationSchema),
    articleController.createArticle
  );
  app.put('/api/articles/:slug', isAuthenticatedUser, articleController.editArticle);
  app.delete('/api/articles/:slug', isAuthenticatedUser, articleController.removeArticle);
  app.get('/api/articles/feed', isAuthenticatedUser, articleController.articlesFeed);
  app.post(
    '/api/articles/:slug/favorite',
    isAuthenticatedUser,
    articleController.favoriteArticle
  );
  app.delete(
    '/api/articles/:slug/favorite',
    isAuthenticatedUser,
    articleController.unFavoriteArticle
  );
};
