// Description: Test suite for forgot password and reset password functionality

//Setup the test environment
const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());

// Mock the User model and email service
jest.mock("../models/user.js");
jest.mock("../emailService");

const User = require("../models/user.js");
const emailService = require("../emailService");

// Load the app and attach routes
const api = require("../api.js");
api.setApp(app, {}); // mock db

//Forgot Password
describe("POST /api/forgot-password", () => {
  const testEmail = "ash@palettetown.com";
  const testToken = "reset-token-001";

  beforeEach(() => {
    emailService.generateToken.mockReturnValue(testToken);
    emailService.sendPasswordResetEmail.mockResolvedValue(true);
  });
  //Happy path
  it("should return 200 if user is found and email is sent", async () => {
    // Simulate user found in DB
    User.findOne.mockResolvedValue({ _id: "abc123", Email: testEmail });
    User.updateOne.mockResolvedValue({ acknowledged: true });

    const res = await request(app)
      .post("/api/forgot-password")
      .send({ email: testEmail });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Password reset email sent");

    expect(User.findOne).toHaveBeenCalledWith({ Email: testEmail });
    expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(testEmail, testToken);
  });
  //Sad paths
  it("should return 404 if no user is found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/forgot-password")
      .send({ email: "doesnotexist@example.com" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });
});

// Reset Password
describe("POST /api/reset-password", () => {
    const token = "valid-reset-token";
    const userId = 456;
  
    const requestBody = {
      userId,
      token,
      newPassword: "newSecurePassword123",
    };
  
    beforeEach(() => {
      User.updateOne.mockResolvedValue({ acknowledged: true });
    });
    //Happy path
    it("should reset the password successfully with a valid token", async () => {
      User.findOne.mockResolvedValue({
        _id: "mockUserId",
        ResetPasswordToken: token,
        ResetPasswordExpires: new Date(Date.now() + 3600000), // not expired
      });
  
      const res = await request(app).post("/api/reset-password").send(requestBody);
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Password reset successfully");
  
      expect(User.findOne).toHaveBeenCalledWith({
        ResetPasswordToken: token,
        ResetPasswordExpires: { $gt: expect.any(Date) },
      });
  
      expect(User.updateOne).toHaveBeenCalledWith(
        { userId },
        expect.objectContaining({
          $set: expect.objectContaining({
            Password: requestBody.newPassword,
          }),
        })
      );
    });
    //Sad paths
    it("should return 400 for invalid or expired token", async () => {
      User.findOne.mockResolvedValue(null); // simulating token not found or expired
  
      const res = await request(app).post("/api/reset-password").send(requestBody);
  
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Invalid or expired reset token");
    });
  });