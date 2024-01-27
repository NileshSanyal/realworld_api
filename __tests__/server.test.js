/* eslint-disable no-undef */
// Import the necessary libraries
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
// Import the code to be tested
const { connect } = require('../config/database');

jest.mock("../config/database");
// Mock the mongoose.connect() function
jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

// Mock the console.log() function
jest.mock('console', () => ({
  log: jest.fn(),
}));

// Test the connectDatabase function
describe('connectDatabase', () => {
  it("should call connect function", () => {
    expect(connect).toHaveBeenCalledTimes(1);
  });
  // it('should call mongoose.connect() with the correct parameters', () => {
  //   expect(mongoose.connect).toHaveBeenCalledWith(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  // });
});

describe('Error handling middleware', () => {
  it('should respond with error message and status', async () => {
    const err = {
      status: 404,
      message: 'Not Found',
    };

    const response = await request(app).get('/api/users'); // Assuming '/test' is the route that triggers the middleware

    expect(response.status).toBe(err.status);
    expect(response.body.errors.message).toBe(err.message);
  });

  it('should respond with empty error object if error is not provided', async () => {
    const err = {
      status: 404,
      message: 'Not Found',
    };

    const response = await request(app).get('/api/users'); // Assuming '/test' is the route that triggers the middleware

    expect(response.status).toBe(err.status);
    expect(response.body.errors.error).toEqual({});
  });
});

// Test the app.listen() function
describe('app.listen', () => {
  it('should call console.log() with the correct message', () => {
    // Call the app.listen() function
    app.listen(4000);

    // Check if console.log() was called with the correct message
    expect(console.log).toHaveBeenCalledWith('Listening on port 4000');
  });
});