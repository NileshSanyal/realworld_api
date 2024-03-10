const articleServiceHelper = require("../../../services/article.service");
const commentHelper = require("../../../services/comment.service");
const mockCommentsData = require("../fixtures/comments.json");

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
};

const mockNext = jest.fn();

const mockUser = {
  _id: "6368ad4347dkhs"
};

const mockArticle = {
  title: "Sample article title",
  description: "Sample article description",
  body: "Sample article body"
};

const mockComment = {
  id: 1,
  createdAt: "2016-02-18T03:22:56.637Z",
  updatedAt: "2016-02-18T03:22:56.637Z",
  body: "It takes a Jacobian",
  author: {
    username: "jake",
    bio: "I work at statefarm",
    image: "https://i.stack.imgur.com/xHWG8.jpg",
    following: false
  }
};

const getArticleSpy = jest.spyOn(articleServiceHelper, "getArticleData").mockResolvedValue(mockArticle);
const saveCommentSpy = jest.spyOn(commentHelper, "saveComment").mockResolvedValue(mockComment);
const getAllCommentsSpy = jest.spyOn(commentHelper, "getAllComments").mockResolvedValue(mockCommentsData);
const getCommentSpy = jest.spyOn(commentHelper, "getComment").mockResolvedValue(mockComment);
const removeCommentSpy = jest.spyOn(commentHelper, "deleteComment").mockResolvedValue(true);

describe("Unit tests for comment.controller.js file", () => {
  describe("addComment tests", () => {
    test("If user is able to add comment for an article", async () => {
      //Arrange
      const mockReq = { params: { slug: 'test-article-slug' }, user: { _id: "6368ad4347dkhs" }, body: { comment: mockArticle } };
      const mockRes = mockResponse();
      const { addComment } = require("../../../controllers/comment.controller");
      //Act
      await addComment(mockReq, mockRes, mockNext);
      //Assert
      expect(getArticleSpy).toHaveBeenCalledTimes(1);
      expect(getArticleSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(saveCommentSpy).toHaveBeenCalledTimes(1);
      expect(saveCommentSpy).toHaveBeenCalledWith(mockReq.user._id, mockReq.body.comment, mockReq.params.slug);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        comment: mockComment
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("getComments tests", () => {
    test("If user can get all comments", async () => {
      //Arrange
      const mockReq = { params: { slug: 'test-article-slug' } };
      const mockRes = mockResponse();
      const { getComments } = require("../../../controllers/comment.controller");
      //Act
      await getComments(mockReq, mockRes, mockNext);
      //Assert
      expect(getArticleSpy).toHaveBeenCalledTimes(1);
      expect(getArticleSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(getAllCommentsSpy).toHaveBeenCalledTimes(1);
      expect(getAllCommentsSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        comments: mockCommentsData
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("removeComment tests", () => {
    test("If user can remove comment for a specific article", async () => {
      //Arrange
      const mockReq = { params: { id: "5478ad4347dkhs", slug: 'test-article-slug' }, user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { removeComment } = require("../../../controllers/comment.controller");
      //Act
      await removeComment(mockReq, mockRes, mockNext);
      //Assert
      expect(getArticleSpy).toHaveBeenCalledTimes(1);
      expect(getArticleSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(getCommentSpy).toHaveBeenCalledTimes(1);
      expect(getCommentSpy).toHaveBeenCalledWith(mockReq.params.id);
      expect(removeCommentSpy).toHaveBeenCalledTimes(1);
      expect(removeCommentSpy).toHaveBeenCalledWith(mockReq.user._id, mockReq.params.slug, mockReq.params.id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Comment Deleted Successfully'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});