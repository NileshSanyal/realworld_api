const slugifyHelper = require('../../../helpers/slugify.helper');
const { Article } = require('../../../models/article.model');
const currentUserService = require('../../../services/user.service');

const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "test@gmail.com"
};

const mockSlug = "sample-slug";

const mockArticle = {
  title: "Sample article title",
  description: "Sample article description",
  body: "Sample article body",
  tagList: ['tag1', 'tag2'],
  author: "507f1f77bcf86cd799439011"
};

const mockUpdatedArticle = {
  title: "Updated article title",
  description: "Updated article description",
  body: "Updated article body",
  tagList: ['tag3', 'tag4'],
  author: "507f1f77bcf86cd799439011"
};

// Mock the Article model
jest.mock('../../../models/article.model', () => ({
  Article: jest.fn().mockImplementation(() => ({
    save: jest.fn().mockResolvedValue(mockArticle),
    findOne: jest.fn().mockImplementation((slug) => {
      slug == mockSlug ? Promise.resolve(mockArticle) : null
    })
  }))
}));

const slugifySpy = jest.spyOn(slugifyHelper, "slugify").mockReturnValue('mocked-slug');
const currentUserSpy = jest.spyOn(currentUserService, "currentUser").mockResolvedValue(mockUser);

describe("Unit tests for article.service.js file", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("saveArticle tests", () => {
    test("If user can save an article", async () => {
      //Arrange
      const { saveArticle } = require("../../../services/article.service");

      //Act
      const result = await saveArticle(mockUser._id, mockArticle);

      //Assert
      expect(result).toEqual(mockArticle);
      expect(slugifySpy).toHaveBeenCalledTimes(1);
      expect(slugifySpy).toHaveBeenCalledWith(mockArticle.title);
      expect(currentUserSpy).toHaveBeenCalledTimes(1);
      expect(currentUserSpy).toHaveBeenCalledWith(mockUser._id);
    });
  });
  xdescribe("updateArticle tests", () => {
    test("If user can update an existing article and user provides all data related to updated article", async () => {
      //Arrange
      const { updateArticle } = require("../../../services/article.service");
      //Act
      const result = await updateArticle(mockSlug, mockUser._id, mockUpdatedArticle);

      //Assert
      expect(result).toEqual(mockUpdatedArticle);
      expect(slugifySpy).toHaveBeenCalledTimes(1);
      expect(slugifySpy).toHaveBeenCalledWith(mockUpdatedArticle.title);
      expect(currentUserSpy).toHaveBeenCalledTimes(1);
      expect(currentUserSpy).toHaveBeenCalledWith(mockUser._id);
    });
  });
});
