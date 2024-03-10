const articleServiceHelper = require("../../../services/article.service");
const mockArticlesData = require("../fixtures/articles.json");
const mockTagsData = require("../fixtures/tags.json");

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
}

const mockUpdatedArticle = {
  title: "Updated article title",
  description: "Updated description",
  body: "Updated body"
}
const updateArticleSpy = jest.spyOn(articleServiceHelper, "updateArticle").mockResolvedValue(mockUpdatedArticle);
const removeArticleSpy = jest.spyOn(articleServiceHelper, "deleteArticle").mockResolvedValue(mockUpdatedArticle);
const getArticleSpy = jest.spyOn(articleServiceHelper, "getArticleData").mockResolvedValue(mockArticle);
const getAllArticlesSpy = jest.spyOn(articleServiceHelper, "getAllArticlesData").mockResolvedValue(mockArticlesData.articles);
const getAllTagsSpy = jest.spyOn(articleServiceHelper, "getAllTags").mockResolvedValue(mockTagsData.tags);
const feedArticlesSpy = jest.spyOn(articleServiceHelper, "feedArticles").mockResolvedValue(mockArticlesData.articles);
const getArticleDataSpy = jest.spyOn(articleServiceHelper, "getArticleData").mockResolvedValue(mockArticle);
const markArticleAsFavoriteSpy = jest.spyOn(articleServiceHelper, "markArticleAsFavorite").mockResolvedValue(mockArticle);
const markArticleAsUnfavouriteSpy = jest.spyOn(articleServiceHelper, "markArticleAsUnfavorite").mockResolvedValue(mockArticle);

describe("Unit tests for article.controller.js file", () => {
  describe("createArticle tests", () => {
    test("If user can create an article", async () => {
      //Arrange
      const mockReq = { user: { _id: "6368ad4347dkhs" }, body: { article: mockArticle } };
      const mockRes = mockResponse();
      const saveArticleSpy = jest.spyOn(articleServiceHelper, "saveArticle").mockResolvedValue(mockArticle);
      const { createArticle } = require("../../../controllers/article.controller");
      //Act
      await createArticle(mockReq, mockRes, mockNext);
      //Assert
      expect(saveArticleSpy).toHaveBeenCalledTimes(1);
      expect(saveArticleSpy).toHaveBeenCalledWith(mockUser._id, mockArticle);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        article: mockArticle
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("editArticle tests", () => {
    test("If user can edit an article", async () => {
      //Arrange
      const mockReq = { params: { slug: 'test-article-slug' }, user: { _id: "6368ad4347dkhs" }, body: { article: mockUpdatedArticle } };
      const mockRes = mockResponse();
      const { editArticle } = require("../../../controllers/article.controller");
      //Act
      await editArticle(mockReq, mockRes, mockNext);
      //Assert
      expect(updateArticleSpy).toHaveBeenCalledTimes(1);
      expect(updateArticleSpy).toHaveBeenCalledWith(mockReq.params.slug, mockUser._id, mockReq.body.article);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        article: mockUpdatedArticle
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("removeArticle tests", () => {
    test("If user can remove existing article", async () => {
      //Arrange
      const mockReq = { params: { slug: 'test-article-slug' }, user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { removeArticle } = require("../../../controllers/article.controller");
      //Act
      await removeArticle(mockReq, mockRes, mockNext);
      //Assert
      expect(removeArticleSpy).toHaveBeenCalledTimes(1);
      expect(removeArticleSpy).toHaveBeenCalledWith(mockReq.params.slug, mockUser._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Article deleted successfully'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("getArticle tests", () => {
    test("If user can get details of an article", async () => {
      //Arrange
      const mockReq = { params: { slug: 'test-article-slug' } };
      const mockRes = mockResponse();
      const { getArticle } = require("../../../controllers/article.controller");
      //Act
      await getArticle(mockReq, mockRes, mockNext);
      //Assert
      expect(getArticleSpy).toHaveBeenCalledTimes(1);
      expect(getArticleSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        article: mockArticle
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("getAllArticles tests", () => {
    test("If user can get all articles", async () => {
      //Arrange
      const mockReq = { query: { limit: 5, offset: 5, tag: "js" } };
      const mockRes = mockResponse();
      const { getAllArticles } = require("../../../controllers/article.controller");
      //Act
      await getAllArticles(mockReq, mockRes, mockNext);
      //Assert
      expect(getAllArticlesSpy).toHaveBeenCalledTimes(1);
      expect(getAllArticlesSpy).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        articles: mockArticlesData.articles, articlesCount: mockArticlesData.articles.length
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("getAllTags tests", () => {
    test("If user is able to get all tags", async () => {
      //Arrange
      const mockReq = {};
      const mockRes = mockResponse();
      const { getAllTags } = require("../../../controllers/article.controller");
      //Act
      await getAllTags(mockReq, mockRes, mockNext);
      //Assert
      expect(getAllTagsSpy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        tags: mockTagsData.tags
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("articlesFeed tests", () => {
    test("If users can access his or her articles feed", async () => {
      //Arrange
      const mockReq = { query: { limit: 5, offset: 5, tag: "js" }, user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { articlesFeed } = require("../../../controllers/article.controller");
      //Act
      await articlesFeed(mockReq, mockRes, mockNext);
      //Assert
      expect(feedArticlesSpy).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        articles: mockArticlesData.articles,
        articlesCount: mockArticlesData.articles.length
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("favoriteArticle tests", () => {
    test("If a user is able to mark an article as favourite", async () => {
      //Arrange
      const mockReq = { params: { slug: 'test-article-slug' }, user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { favoriteArticle } = require("../../../controllers/article.controller");
      //Act
      await favoriteArticle(mockReq, mockRes, mockNext);
      //Assert
      expect(getArticleDataSpy).toHaveBeenCalledTimes(1);
      expect(getArticleDataSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(markArticleAsFavoriteSpy).toHaveBeenCalledTimes(1);
      expect(markArticleAsFavoriteSpy).toHaveBeenCalledWith(mockReq.user._id,mockReq.params.slug);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        article: mockArticle
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("unFavoriteArticle tests", () => {
    test("If a user is able to mark an article as unfavourite", async () => {
       //Arrange
       const mockReq = { params: { slug: 'test-article-slug' }, user: { _id: "6368ad4347dkhs" } };
       const mockRes = mockResponse();
       const { unFavoriteArticle } = require("../../../controllers/article.controller");
       //Act
      await unFavoriteArticle(mockReq, mockRes, mockNext);
      //Assert
      expect(getArticleDataSpy).toHaveBeenCalledTimes(1);
      expect(getArticleDataSpy).toHaveBeenCalledWith(mockReq.params.slug);
      expect(markArticleAsUnfavouriteSpy).toHaveBeenCalledTimes(1);
      expect(markArticleAsUnfavouriteSpy).toHaveBeenCalledWith(mockReq.user._id,mockReq.params.slug);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        article: mockArticle
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});