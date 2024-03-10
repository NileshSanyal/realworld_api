const { getArticleData } = require('../services/article.service');
const {
  saveComment,
  getComment,
  getAllComments,
  deleteComment,
} = require('../services/comment.service');

exports.addComment = async (req, res, next) => {
  return await getArticleData(req.params.slug)
    .then(async (article) => {
      return await saveComment(req.user._id, req.body.comment, req.params.slug).then(
        (isSaved) => {
          if (isSaved) return res.status(200).json({ comment: isSaved });
        }
      );
    })
    .catch(next);
};

exports.getComments = async (req, res, next) => {
  return await getArticleData(req.params.slug)
    .then(async (article) => {
      return await getAllComments(req.params.slug).then((comments) => {
        if (comments) return res.status(200).json({ comments });
      });
    })
    .catch(next);
};

exports.removeComment = async (req, res, next) => {
  return await getArticleData(req.params.slug)
    .then(async (article) => {
      if (article) {
        return await getComment(req.params.id).then(async (comment) => {
          if (comment) {
            return await deleteComment(req.user._id, req.params.slug, req.params.id).then(
              (deletedComment) => {
                if (deletedComment)
                  return res
                    .status(200)
                    .json({ message: 'Comment Deleted Successfully' });
              }
            );
          }
        });
      }
    })
    .catch(next);
};
