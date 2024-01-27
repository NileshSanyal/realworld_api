const { Comment } = require('../models/comment.model');
const { Article } = require('../models/article.model');

class CommentService {
  /**
   *
   * @param {string} userId Id of the user
   * @param {string} commentBody Body of the comment
   * @param {string} articleSlug Slug used for the article
   * @description It saves a comment for an article
   * @returns {Promise<Document>} existingArticle
   */
  static async saveComment(userId, commentBody, articleSlug) {
    const newComment = new Comment();
    newComment.body = commentBody.body;
    newComment.author = userId;
    const existingArticle = await Article.findOne(
      { slug: articleSlug },
      { _id: 1, body: 1, createdAt: 1, updatedAt: 1 }
    ).populate('author', '-_id username bio image following');

    if (existingArticle) {
      newComment.article = existingArticle._id;
      const savedComment = await newComment.save();
      if (savedComment) {
        const commentID = savedComment._id;
        await Article.findByIdAndUpdate(existingArticle._id, { comments: commentID });
      }
    }
    return existingArticle;
  }

  /**
   *
   * @param {string} commentId Id of the comment
   * @description It gets comment regarding a specific comment id
   * @returns {Promise<Document>} comment
   */
  static async getComment(commentId) {
    const comment = await Comment.findById(commentId);
    return comment;
  }

  /**
   *
   * @param {string} articleSlug Slug used for the article
   * @description It gets all comments for an article
   * @returns {Promise<Document>} comments
   */
  static async getAllComments(articleSlug) {
    const existingArticle = await Article.findOne({ slug: articleSlug }, { _id: 1 });
    if (existingArticle) {
      const getCommentForExistingArticle = await Comment.findOne(
        { article: existingArticle._id },
        { article: 0, __v: 0 }
      ).populate('author', '-_id username bio image following');
      return getCommentForExistingArticle;
    }
  }

  /**
   *
   * @param {string} userId User id
   * @param {string} articleSlug Slug used for the article
   * @param {string} commentId Id of the comment
   * @description It removes comment for an article
   * @returns {boolean} Returns whether the delete operation is successful or not
   */
  static async removeComment(userId, articleSlug, commentId) {
    const commentByLoggedInUser = await Comment.findOne({ author: userId });
    const articleId = commentByLoggedInUser.article;

    const articleInfo = await Article.findOne({ slug: articleSlug });
    if (articleInfo) {
      const removedComment = await Comment.findByIdAndDelete(commentId);
      if (removedComment) {
        const isSuccess = await Article.findByIdAndUpdate(
          articleId,
          { $pull: { comments: commentId } },
          { useFindAndModify: false }
        );
        if (isSuccess) {
          return true;
        } else {
          return false;
        }
      }
    }
  }
}

module.exports = CommentService;
