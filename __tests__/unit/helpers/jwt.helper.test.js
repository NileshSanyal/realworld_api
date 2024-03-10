const jwt = require('jsonwebtoken');
const { generateJwtToken, verifyJwtToken } = require("../../../helpers/jwt.helper");
// jest.mock('jsonwebtoken', () => ({
//   sign: jest.fn(),
//   verify: jest.fn(),
// }));

describe("Unit tests for jwt.helper.js file", () => {
  it('generates a JWT token correctly', () => {
    //Arrange
    const originJwtSecret = process.env.JWT_SECRET;
    const userObj = { _id: 1, name: 'testuser', email: 'test@test.com' };
    const jwtSecretKey = 'supersecret';
    const jwtOptions = { algorithm: 'HS512', expiresIn: '1d' };
    const token = "jsontoken";

    process.env.JWT_SECRET = jwtSecretKey;
    const signSpy = jest.spyOn(jwt, 'sign').mockReturnValue(token);

    //Act
    const result = generateJwtToken(userObj);

    //Assert
    expect(result).toBe(token);
    expect(signSpy).toHaveBeenCalledWith({ _id: userObj._id }, jwtSecretKey, jwtOptions);
    process.env.JWT_SECRET = originJwtSecret;
  });

  it('verifies a JWT token correctly', () => {
    const token = 'someToken';
    const originJwtSecret = process.env.JWT_SECRET;
    const jwtSecretKey = 'supersecret';
    const jwtOptions = { algorithms: 'HS512' };
    const decodedData = { _id: 123 };

    process.env.JWT_SECRET = jwtSecretKey;
    const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue({ _id: 123 });

    const result = verifyJwtToken(token);

    expect(result).toEqual(decodedData);
    expect(verifySpy).toHaveBeenCalledWith(token, jwtSecretKey, jwtOptions);
    process.env.JWT_SECRET = originJwtSecret;
  });
});