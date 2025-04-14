// Description: Test suite for email sending functionality

//Dummy environment variables
process.env.SENDGRID_API_KEY = "SG.fake";
process.env.SENDGRID_FROM_EMAIL = "test@fake.com";
process.env.FRONTEND_URL = "http://localhost";

// Setup the test environment
const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());

// Mock the User model and email service
jest.mock("../emailService", () => ({
  generateToken: jest.fn(() => "test-token-abc"),
  sendVerificationEmail: jest.fn(() => Promise.resolve(true)),
}));
const emailService = require("../emailService");

const api = require("../api.js");
api.setApp(app, {}); // mock db

describe("POST /api/test-email", () => {
  const email = "test@example.com";
    //Happy path
  it("should send a test email and return 200", async () => {
    const res = await request(app)
      .post("/api/test-email")
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Test email sent successfully");
    expect(res.body).toHaveProperty("token", "test-token-abc");

    expect(emailService.generateToken).toHaveBeenCalled();
    expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(email, "test-token-abc");
  });
  //Sad paths
  it("should return 400 if email is missing", async () => {
    const res = await request(app)
      .post("/api/test-email")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email is required");
  });
});
