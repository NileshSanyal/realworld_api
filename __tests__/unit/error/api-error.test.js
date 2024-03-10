const ApiError = require("../../../error/api-error");
let error;
describe("Unit tests for api-error.js file", () => {
  beforeEach(() => {
    // Arrange
    error = new ApiError(null, null);
  });

  it("Should check if ApiError returns proper http code and message during invalid form submission request", () => {
    // Act
    error = ApiError.badRequest('Validation Error');
    // Assert
    expect(error.httpCode).toEqual(422);
    expect(error.message).toEqual({ errors: { body: 'Validation Error' } });
  })
});
