const slugifyHelper = require('../../../helpers/slugify.helper');
const currentUserService = require('../../../services/user.service');
const { Article } = require('../../../models/article.model');
const mockinGoose = require('mockingoose');

const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  email: "test@gmail.com"
};

const mockArticle = {
  title: "Sample article title",
  description: "Sample article description",
  body: "Sample article body",
  tagList: ['tag1', 'tag2'],
  author: "507f1f77bcf86cd799439011"
};

// Mock the Article model
// jest.mock('../../../models/article.model');

// jest.mock('../../../models/article.model', () => ({
//   save: jest.fn().mockResolvedValue(mockArticle)
// }));

const slugifySpy = jest.spyOn(slugifyHelper, "slugify").mockReturnValue('mocked-slug');
const currentUserSpy = jest.spyOn(currentUserService, "currentUser").mockResolvedValue(mockUser);

describe("Unit tests for article.service.js file", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("saveArticle tests", () => {
    test("If user can save an article", async () => {
      //Arrange
      mockinGoose(Article).toReturn(mockArticle, 'save');
      const { saveArticle } = require("../../../services/article.service");

      //Act
      const result = await saveArticle(mockUser._id, mockArticle);

      //Assert
      expect(result).toBe(mockArticle);
      expect(slugifySpy).toHaveBeenCalledTimes(1);
      expect(slugifySpy).toHaveBeenCalledWith(mockArticle.title);
      expect(currentUserSpy).toHaveBeenCalledTimes(1);
      expect(currentUserSpy).toHaveBeenCalledWith(mockUser._id);
    });
  });
});
