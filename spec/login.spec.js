// Test for the login API endpoint

//Dummy environment variables
process.env.SENDGRID_API_KEY = "SG.fake";

//Setup the test environment
const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());

// Mock the User model
jest.mock("../models/user.js");
const User = require("../models/user.js");

// Load routes into our test app
const api = require("../api.js");
api.setApp(app, {}); // dummy db

//Start of the test suite for login functionality
describe("POST /api/login", () => {
  const mockUser = {
    UserId: 123,
    FirstName: "Ash",
    LastName: "Ketchum",
    Login: "ash123",
    Password: "pikachuOP",
    IsVerified: true,
  };

  beforeEach(() => {
    // Simulate a verified user match on login
    User.find.mockResolvedValue([mockUser]);
  });
  //Happy path
  it("should return 200 and user info on correct login", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ login: "ash123", password: "pikachuOP" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("userId", 123);
    expect(res.body).toHaveProperty("firstName", "Ash");
    expect(res.body).toHaveProperty("lastName", "Ketchum");
    expect(res.body).toHaveProperty("error", "");
  });
  //Sad paths
  it("should return 400 if login/password are invalid", async () => {
    User.find.mockResolvedValue([]); // Simulate no matching user

    const res = await request(app)
      .post("/api/login")
      .send({ login: "wrongUser", password: "wrongPass" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid user name/password");
  });

  it("should return 403 if email is not verified", async () => {
    const unverifiedUser = {
      UserId: 456,
      FirstName: "Gary",
      LastName: "Oak",
      Login: "gary123",
      Password: "bulbasaurSux",
      IsVerified: false,
    };

    User.find.mockResolvedValue([unverifiedUser]);

    const res = await request(app)
      .post("/api/login")
      .send({ login: "gary123", password: "bulbasaurSux" });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty("error", "Please verify your email before logging in");
    expect(res.body).toHaveProperty("needsVerification", true);
  });
});