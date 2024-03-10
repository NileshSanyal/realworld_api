const userServiceHelper = require("../../../services/user.service");

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis()
  };
};

const mockNext = jest.fn();

const mockUser = {
  "email": "jake@jake.jake",
  "token": "Bearer test-token",
  "username": "jake",
  "bio": "I work at statefarm",
  "image": null
};

const saveUserSpy = jest.spyOn(userServiceHelper, "saveUser").mockResolvedValue(mockUser);
const loginUserSpy = jest.spyOn(userServiceHelper, "loginUser").mockResolvedValue(mockUser);
const currentUserSpy = jest.spyOn(userServiceHelper, "currentUser").mockResolvedValue(mockUser);
const updateUserSpy = jest.spyOn(userServiceHelper, "updateUser").mockResolvedValue(mockUser);
const profileUserSpy = jest.spyOn(userServiceHelper, "userProfile").mockResolvedValue(mockUser);
const followUserSpy = jest.spyOn(userServiceHelper, "followUser").mockResolvedValue(mockUser);
const unFollowUserSpy = jest.spyOn(userServiceHelper, "unFollowUser").mockResolvedValue(mockUser);

describe("Unit tests for user.controller.js file", () => {
  describe("registerUser tests", () => {
    test("If a new user can register him or herself", async () => {
      //Arrange
      const mockReq = { body: { user: mockUser } };
      const mockRes = mockResponse();
      const { registerUser } = require("../../../controllers/user.controller");
      //Act
      await registerUser(mockReq, mockRes, mockNext);
      //Assert
      expect(saveUserSpy).toHaveBeenCalledTimes(1);
      expect(saveUserSpy).toHaveBeenCalledWith(mockReq.body.user);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("loginUser tests", () => {
    test("If an existing user can log in", async () => {
      //Arrange
      const mockReq = { body: { user: mockUser } };
      const mockRes = mockResponse();
      const { loginUser } = require("../../../controllers/user.controller");
      //Act
      await loginUser(mockReq, mockRes, mockNext);
      //Assert
      expect(loginUserSpy).toHaveBeenCalledTimes(1);
      expect(loginUserSpy).toHaveBeenCalledWith(mockReq.body.user);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: mockUser
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("currentUser tests", () => {
    test("If currently logged in user details can be retrieved", async () => {
      //Arrange
      const mockReq = { user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { currentUser } = require("../../../controllers/user.controller");
      //Act
      await currentUser(mockReq, mockRes, mockNext);
      //Assert
      expect(currentUserSpy).toHaveBeenCalledTimes(1);
      expect(currentUserSpy).toHaveBeenCalledWith(mockReq.user._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: mockUser
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("updateUser tests", () => {
    test("If user can update his or her details", async () => {
      //Arrange
      const mockReq = { user: { _id: "6368ad4347dkhs" }, body: { user: mockUser } };
      const mockRes = mockResponse();
      const { updateUser } = require("../../../controllers/user.controller");
      //Act
      await updateUser(mockReq, mockRes, mockNext);
      //Assert
      expect(updateUserSpy).toHaveBeenCalledTimes(1);
      expect(updateUserSpy).toHaveBeenCalledWith(mockReq.user._id, mockReq.body.user);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        user: mockUser
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("userProfile tests", () => {
    test("If user can get his or her profile details", async () => {
      //Arrange
      const mockReq = { params: { username: "test-user" } };
      const mockRes = mockResponse();
      const { userProfile } = require("../../../controllers/user.controller");
      //Act
      await userProfile(mockReq, mockRes, mockNext);
      //Assert
      expect(profileUserSpy).toHaveBeenCalledTimes(1);
      expect(profileUserSpy).toHaveBeenCalledWith(mockReq.params.username);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        profile: mockUser
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("followUser tests", () => {
    test("If user can follow another user", async () => {
      //Arrange
      const mockReq = { params: { username: "test-user" }, user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { followUser } = require("../../../controllers/user.controller");
      //Act
      await followUser(mockReq, mockRes, mockNext);
      //Assert
      expect(followUserSpy).toHaveBeenCalledTimes(1);
      expect(followUserSpy).toHaveBeenCalledWith(mockReq.params.username, mockReq.user._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        profile: mockUser
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
  describe("unFollowUser tests", () => {
    test("If user can unfollow another user", async () => {
      //Arrange
      const mockReq = { params: { username: "test-user" }, user: { _id: "6368ad4347dkhs" } };
      const mockRes = mockResponse();
      const { unFollowUser } = require("../../../controllers/user.controller");
      //Act
      await unFollowUser(mockReq, mockRes, mockNext);
      //Assert
      expect(unFollowUserSpy).toHaveBeenCalledTimes(1);
      expect(unFollowUserSpy).toHaveBeenCalledWith(mockReq.params.username, mockReq.user._id);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        profile: mockUser
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});