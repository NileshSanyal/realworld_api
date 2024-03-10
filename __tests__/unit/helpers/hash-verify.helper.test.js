const bcrypt = require('bcrypt');
const { hashPassword, verifyPassword } = require("../../../helpers/hash-verify.helper");
const SALT_ROUNDS = 12;
describe("Unit tests for hash-verify.helper.js file", () => {
  it("Should return a hashed password", async() => {
    //Arrange
    const plainTextPassword = "secret";
    const salt = "saltvalue";
    const genSaltSpy = jest.spyOn(bcrypt, 'genSalt').mockResolvedValue("saltvalue");
    const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue("hashvalue");
    //Act
    const hashedPassword = await hashPassword(plainTextPassword);
    //Assert
    expect(genSaltSpy).toHaveBeenCalledWith(SALT_ROUNDS);
    expect(hashSpy).toHaveBeenCalledWith(plainTextPassword, salt);
    expect(hashedPassword).toEqual("hashvalue");
  });
  it("After hashing the plaintext password it should match with hashed password", async () => {
    //Arrange
    const plainTextPassword = "secret";
    const hashedPassword = "supersecret";
    const compareSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    //Act
    const verificationStatus = await verifyPassword(plainTextPassword, hashedPassword);
    //Assert
    expect(compareSpy).toHaveBeenCalledWith(plainTextPassword, hashedPassword);
    expect(verificationStatus).toBe(true);
  });
});
