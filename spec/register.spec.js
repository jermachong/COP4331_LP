/* This is a Jest test file for the user registration API endpoint.*/

// Import necessary modules
const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());

// Mock before loading your app setup
jest.mock("../models/user.js");
jest.mock("../emailService", () => ({
  generateToken: jest.fn(() => "mock-token-123"),
  sendVerificationEmail: jest.fn(() => Promise.resolve(true)),
}));

// Mock the User model and email service
const User = require("../models/user.js");
const emailService = require("../emailService");

// Load the app and attach routes
const api = require("../api.js");
const dbMock = {}; // dummy dbInstance
api.setApp(app, dbMock);

describe("POST /api/register (happy path)", () => {
  const testData = {
    firstName: "Ash",
    lastName: "Ketchum",
    email: "ash@palettetown.com",
    login: "ash123",
    password: "pikachuOP",
  };

  beforeEach(() => {
    // Mock User.findOne → no user exists
    User.findOne.mockResolvedValue(null);

    // Mock emailService functions
    emailService.generateToken.mockReturnValue("mock-token-123");
    emailService.sendVerificationEmail.mockResolvedValue(true);

    // Mock User constructor + save method
    User.mockImplementation((userData) => ({
      ...userData,
      save: jest.fn().mockResolvedValue(userData),
    }));
  });

  it("should register a new user successfully", async () => {
    const res = await request(app).post("/api/register").send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("userId");

    // Ensure mocks were called
    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(emailService.generateToken).toHaveBeenCalled();
    expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
      testData.email,
      "mock-token-123"
    );
  });
});