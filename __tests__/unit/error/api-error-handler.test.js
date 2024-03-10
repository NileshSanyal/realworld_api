const ApiError = require('../../../error/api-error');
const apiErrorHandler = require("../../../error/api-error-handler")
let err;
let req = {};
let res = {};
let mockResponse;
let next;
describe("Unit tests for api-error-handler.js file", () => {
  beforeEach(() => {
    // Arrange
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    err = new ApiError(null, null);
    res = mockResponse;
    next = jest.fn();
  });

  test("If ApiError is instance of error object then it will return http code and message that exists within error object", () => {
    // Arrange
    err = new ApiError(400, 'Bad request');
    // Act
    apiErrorHandler(err, req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bad request' });
    expect(next).not.toHaveBeenCalled();
  });
  test("If ApiError is not instance of error object then it will return 500 http code and custom error message", () => {
    //Arrange
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementationOnce(() => {
        return {
          message: 'Something went wrong, please try again later'
        };
      })
    }
    res = mockResponse;
    err = new Error(500, 'Something went wrong, please try again later');
    // Act
    apiErrorHandler(err, req, res, next);
    // Assert
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Something went wrong, please try again later'
    });
    expect(next).not.toHaveBeenCalled();
  });
});