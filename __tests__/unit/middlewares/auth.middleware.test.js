const { isAuthenticatedUser } = require("../../../middlewares/auth.middleware");
const mockRequest = () => {
  return {
    headers: {
      authorization: "Bearer"
    }
  }
};

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  }
};

const mockNext = jest.fn();

describe("Unit tests for auth.middleware.js file", () => {

  it("Should check for missing authentication token error", () => {
    //Arrange
    const mockReq = mockRequest().headers = { headers: {} };
    const mockRes = mockResponse();
    //Act
    isAuthenticatedUser(mockReq, mockRes, mockNext);
    //Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication Failed"
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
  it("Should return a 401 error response when an error occurs when token is not valid", () => {
    //Arrange
    const mockReq = mockRequest().headers = { headers: { authorization: "Bearer validtoken" } };
    const mockRes = mockResponse();
    //Act
    isAuthenticatedUser(mockReq, mockRes, mockNext);
    //Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Authentication Failed'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
  it("Should return a 401 error when no authentication token is passed", async () => {
    //Arrange
    const mockReq = mockRequest();
    const mockRes = mockResponse();
    //Act
    isAuthenticatedUser(mockReq, mockRes, mockNext);
    //Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Authentication Failed"
    });
    expect(mockNext).not.toHaveBeenCalled();
  });
});