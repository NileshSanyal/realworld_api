// Import the necessary modules
const { connect } = require('../../config/database');
const mongoose = require("mongoose");

// jest.mock('mongoose',  () => ({
//   connect: () => jest.fn().mockImplementationOnce("Connected to database successfully!")
// }));

jest.mock("mongoose", () => {
  return {
    connect: () => jest.fn().mockImplementation(() => Promise.resolve("Connected to database successfully!"))
  }
})

// afterEach(() => {
//   jest.restoreAllMocks()
// });

// Test the connect function
describe('connect', () => {
  it('should call mongoose.connect() with the correct parameters', () => {
    // Arrange
    const mongooseConnectSpy = jest.spyOn(mongoose, "connect");

    // Act
    connect();

    // Assert
    expect(mongooseConnectSpy).toHaveBeenCalledWith(
      `mongodb://localhost:27017/realworld_db`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    mongooseConnectSpy.mockRestore();
  });

  it('should log a success message when the connection is successful', () => {
    // Arrange
    const consoleSpy = jest.spyOn(console, "log");

    // Act
    connect();

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith('Connected to database successfully!');
    consoleSpy.mockRestore();
  });

  it('should log an error message when the connection fails', () => {
    // Arrange
    const mongooseSpy = jest.spyOn(mongoose, "connect").mockRejectedValue("Error connecting to mongodb");

    try {
      // Act
      connect();
    } catch(error) {
      // Assert
      expect(mongooseSpy).toHaveBeenCalledWith('Error connecting to mongodb');
    }
  });
});