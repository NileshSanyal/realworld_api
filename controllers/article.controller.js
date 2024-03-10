const {
  saveArticle,
  updateArticle,
  deleteArticle,
  getArticleData,
  getAllTags,
  getAllArticlesData,
  feedArticles,
  markArticleAsFavorite,
  markArticleAsUnfavorite,
} = require('../services/article.service');

exports.createArticle = async (req, res, next) => {
  return saveArticle(req.user._id, req.body.article)
    .then((savedArticle) => {
      if (savedArticle) {
        return res.status(200).json({ article: savedArticle });
      }
    })
    .catch(next);
};

exports.editArticle = async (req, res, next) => {
  const slugText = req.params.slug;
  if (slugText) {
    return updateArticle(slugText, req.user._id, req.body.article)
      .then((isUpdated) => {
        if (isUpdated) {
          return res.status(200).json({ article: isUpdated });
        }
      })
      .catch(next);
  }
};

exports.removeArticle = async (req, res, next) => {
  const slugText = req.params.slug;
  if (slugText) {
    return deleteArticle(slugText, req.user._id)
      .then((removedArticle) => {
        if (removedArticle) {
          return res.status(200).json({ message: 'Article deleted successfully' });
        }
      })
      .catch(next);
  }
};

exports.getArticle = async (req, res, next) => {
  const slugText = req.params.slug;
  if (slugText) {
    return getArticleData(slugText)
      .then((article) => {
        if (article) {
          return res.status(200).json({ article: article });
        }
      })
      .catch(next);
  }
};

exports.getAllArticles = async (req, res, next) => {
  return getAllArticlesData(req.query)
    .then((articles) => {
      if (articles) {
        return res
          .status(200)
          .json({ articles: articles, articlesCount: articles.length });
      }
    })
    .catch(next);
};

exports.getAllTags = async (req, res, next) => {
  return getAllTags()
    .then((tags) => {
      return res.status(200).json({ tags: tags });
    })
    .catch(next);
};

exports.articlesFeed = async (req, res, next) => {
  return feedArticles(req.user._id, req.query)
    .then((articles) => {
      return res.status(200).json({ articles: articles, articlesCount: articles.length });
    })
    .catch(next);
};

exports.favoriteArticle = async (req, res, next) => {
  return getArticleData(req.params.slug)
    .then((article) => {
      if (article) {
        return markArticleAsFavorite(req.user._id, req.params.slug).then(
          (isFavorited) => {
            return res.status(200).json({ article: isFavorited });
          }
        );
      }
    })
    .catch(next);
};

exports.unFavoriteArticle = async (req, res, next) => {
  return getArticleData(req.params.slug)
    .then((article) => {
      if (article) {
        return markArticleAsUnfavorite(req.user._id, req.params.slug).then(
          (isUnFavorited) => {
            return res.status(200).json({ article: isUnFavorited });
          }
        );
      }
    })
    .catch(next);
};
