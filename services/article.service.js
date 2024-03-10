const { Article } = require('../models/article.model');
const { currentUser } = require('../services/user.service');
const { slugify } = require('../helpers/slugify.helper');
const { User } = require('../models/user.model');

const {
  isAlreadyFavorited,
  isRemovedFromFavorited,
} = require('../services/user.service');

class ArticleService {
  /**
   * @param {string} userId Id of the user
   * @param {object} articleObj Article details such as title, description etc.
   * @returns {Promise<document>} savedArticleObj
   * @description Creates an article
   */
  static async saveArticle(userId, articleObj) {
    const newArticle = new Article();
    newArticle.title = articleObj.title;
    newArticle.slug = slugify(articleObj.title);
    newArticle.description = articleObj.description;
    newArticle.body = articleObj.body;

    if (articleObj.tagList) {
      if (Array.isArray(articleObj.tagList) && articleObj.tagList.length > 0) {
        newArticle.tagList = articleObj.tagList;
      }
    }
    const userDetails = await currentUser(userId);

    if (userDetails) {
      newArticle.author = userId;
      const savedArticleObj = await newArticle.save();
      return savedArticleObj;
    }
  }

  /**
   *
   * @param {string} slug Slug text used for displaying the url of the article
   * @param {string} userId User id
   * @param {object} articleObj Article details such as title, description etc.
   * @returns {Promise<document>} updatedArticle
   * @description It updates an existing article
   */
  static async updateArticle(slug, userId, articleObj) {
    const articleToUpdate = await Article.findOne({ slug: slug });
    let updatedArticle;
    const updateArticleObj = {};
    if (articleToUpdate) {
      if (articleToUpdate.author.toString() === userId.toString()) {
        const articleId = articleToUpdate._id;

        updatedArticle = new Article();

        if (articleObj.title !== undefined) {
          updateArticleObj.title = articleObj.title;
          updateArticleObj.slug = slugify(articleObj.title);
        }
        if (articleObj.description !== undefined) {
          updateArticleObj.description = articleObj.description;
        }

        if (articleObj.body !== undefined) {
          updateArticleObj.body = articleObj.body;
        }

        if (articleToUpdate.tagList) {
          if (
            Array.isArray(articleToUpdate.tagList) &&
            articleToUpdate.tagList.length > 0
          ) {
            updatedArticle.tagList = articleToUpdate.tagList;
          }
        }
        const userDetails = await currentUser(userId);
        if (userDetails) {
          updatedArticle.author = userId;
        }
        updatedArticle = await Article.findByIdAndUpdate(articleId, updateArticleObj, {
          new: true,
          useFindAndModify: false,
        });
      } else {
        throw new Error('Permission denied for updating the article');
      }
    }
    return updatedArticle;
  }

  /**
   *
   * @param {string} slug Slug text used for displaying the url of the article
   * @param {string} userId User id
   * @returns {Promise<document>} removedArticle
   * @description It removes an existing article
   */
  static async deleteArticle(slug, userId) {
    const articleToDelete = await Article.findOne({ slug: slug });
    if (articleToDelete) {
      if (articleToDelete.author.toString() === userId.toString()) {
        const articleId = articleToDelete._id;
        if (articleId) {
          const removedArticle = await Article.findByIdAndDelete(articleId);
          return removedArticle;
        }
      } else {
        throw new Error('Permission denied for deleting the article');
      }
    }
  }

  /**
   *
   * @param {string} slug Slug text used for displaying the url of the article
   * @returns {Promise<document>} article
   * @description It retrieves an existing article
   */
  static async getArticleData(slug) {
    const article = await Article.findOne({ slug: slug });
    if (article) {
      return article;
    }
  }

  /**
   * @param {string} [queryString] It allows to add certain query modifiers
   * @returns {Promise<document[]>} articles
   * @description It retrieves all existing articles
   */
  static async getAllArticlesData(queryString) {
    const query = {};
    let limit = 20;
    let offset = 0;

    if (typeof queryString.limit !== 'undefined') {
      limit = queryString.limit;
    }

    if (typeof queryString.offset !== 'undefined') {
      offset = queryString.offset;
    }

    if (typeof queryString.tag !== 'undefined') {
      query.tagList = { $in: [queryString.tag] };
    }

    const author = queryString.author
      ? await User.findOne({ username: queryString.author })
      : null;

    const favoriter = queryString.favorited
      ? await User.findOne({ username: queryString.favorited })
      : null;

    if (author) {
      query.author = author._id;
    }

    if (favoriter) {
      query._id = { $in: favoriter.favorites };
    } else if (queryString.favorited) {
      query._id = { $in: [] };
    }

    const articles = await Article.find(query)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: 'desc' })
      .populate('author', 'username email bio image favorites following');

    return articles;
  }

  /**
   *
   * @param {string} userId Id of the user
   * @param {object} [queryString] Query String supplied by the user
   * @returns {Promise<document[]>} articles
   * @description It returns all articles of the author who was followed by an user
   */
  static async feedArticles(userId, queryString) {
    let limit = 20;
    let offset = 0;

    if (typeof queryString.limit !== 'undefined') {
      limit = queryString.limit;
    }

    if (typeof queryString.offset !== 'undefined') {
      offset = queryString.offset;
    }

    const userData = await currentUser(userId);

    if (userData) {
      const articles = await Article.find({ author: { $in: userData.following } })
        .limit(limit)
        .skip(offset)
        .populate('author');
      if (articles) return articles;
    }
  }

  /**
   *
   * @param {string} userId Id of the user
   * @param {string} articleSlug Slug used for the article
   * @description It allows to mark an article as favorite by the user
   * @returns {Promise<document>} favoritedArticleData
   */
  static async markArticleAsFavorite(userId, articleSlug) {
    const articleDetails = await Article.findOne({ slug: articleSlug });
    const articleId = articleDetails._id;

    if (articleDetails) {
      const favoritedArticleId = isAlreadyFavorited(articleId, userId);
      if (favoritedArticleId) {
        const favoritedArticleData = await Article.findByIdAndUpdate(
          articleId,
          { $inc: { favoritesCount: 1 } },
          { new: true, useFindAndModify: false, fields: { _id: 0, __v: 0 } }
        ).populate('author', '-_id username bio image following');
        return favoritedArticleData;
      }
    }
  }

  /**
   *
   * @param {string} userId Id of the user
   * @param {string} articleSlug Slug used for the article
   * @description It allows to mark an article as unfavorite by the user
   * @returns {Promise<document>} unFavoritedArticleData
   */
  static async markArticleAsUnfavorite(userId, articleSlug) {
    const articleDetails = await Article.findOne({ slug: articleSlug });
    const articleId = articleDetails._id;

    if (articleDetails) {
      const favoritedArticleId = isRemovedFromFavorited(articleId, userId);
      if (favoritedArticleId) {
        const favoritedArticleData = await Article.findByIdAndUpdate(
          articleId,
          { $inc: { favoritesCount: -1 } },
          { new: true, useFindAndModify: false, fields: { _id: 0, __v: 0 } }
        ).populate('author', '-_id username bio image following');
        return favoritedArticleData;
      }
    }
  }

  /**
   * @description It returns list of tags regarding an article
   * @returns {Promise<document[]>} tags
   */
  static async getAllTags() {
    const tags = await Article.find().distinct('tagList');
    return tags;
  }
}
module.exports = ArticleService;
