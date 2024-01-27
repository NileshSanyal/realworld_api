const {
  saveArticle,
  updateArticle,
  removeArticle,
  getArticle,
  getAllTags,
  getAllArticles,
  feedArticles,
  favoriteArticle,
  unFavoriteArticle,
} = require('../services/article.service');

exports.createArticle = async (req, res, next) => {
  saveArticle(req.user._id, req.body.article)
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
    updateArticle(slugText, req.user._id, req.body.article)
      .then((isUpdated) => {
        if (isUpdated) {
          return res.status(200).json({ article: isUpdated });
        } else {
          return res.sendStatus(404);
        }
      })
      .catch(next);
  }
};

exports.removeArticle = async (req, res, next) => {
  const slugText = req.params.slug;
  if (slugText) {
    removeArticle(slugText, req.user._id)
      .then((removedArticle) => {
        if (removedArticle) {
          return res.status(200).json({ message: 'Article deleted successfully' });
        } else {
          return res.sendStatus(404);
        }
      })
      .catch(next);
  }
};

exports.getArticle = async (req, res, next) => {
  const slugText = req.params.slug;
  if (slugText) {
    getArticle(slugText)
      .then((article) => {
        if (article) {
          return res.status(200).json({ article: article });
        } else {
          return res.sendStatus(404);
        }
      })
      .catch(next);
  }
};

exports.getAllArticles = async (req, res, next) => {
  getAllArticles(req.query)
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
  getAllTags()
    .then((tags) => {
      return res.status(200).json({ tags: tags });
    })
    .catch(next);
};

exports.articlesFeed = async (req, res, next) => {
  feedArticles(req.user._id, req.query)
    .then((articles) => {
      return res.status(200).json({ articles: articles, articlesCount: articles.length });
    })
    .catch(next);
};

exports.favoriteArticle = async (req, res, next) => {
  getArticle(req.params.slug)
    .then((article) => {
      if (article) {
        favoriteArticle(req.user._id, req.params.slug).then((isFavorited) => {
          if (isFavorited) {
            return res.status(200).json({ article: isFavorited });
          }
        });
      } else {
        return res.sendStatus(404);
      }
    })
    .catch(next);
};

exports.unFavoriteArticle = async (req, res, next) => {
  getArticle(req.params.slug)
    .then((article) => {
      if (article) {
        unFavoriteArticle(req.user._id, req.params.slug).then((isUnFavorited) => {
          if (isUnFavorited) {
            return res.status(200).json({ article: isUnFavorited });
          }
        });
      } else {
        return res.sendStatus(404);
      }
    })
    .catch(next);
};
