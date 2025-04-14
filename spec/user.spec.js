// This test suite is for testing the user-related routes

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

// Load the app and attach routes
const api = require("../api.js");
api.setApp(app, {}); // no db needed

//Test suite for user-related routes
describe("User Routes", () => {
  const userId = 101;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /*Edit User*/

  //Happy path
  it("should update a user’s information", async () => {
    const updateData = {
      userId,
      firstName: "Misty",
      lastName: "Waterflower",
      email: "misty@cerulean.com",
      password: "staryusupreme",
    };

    User.findOne.mockResolvedValue(null); // email not taken
    User.findOneAndUpdate.mockResolvedValue({
      UserId: userId,
      ...updateData,
    });

    const res = await request(app).post("/api/editUser").send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "User updated successfully");
  });
  //Sad paths
  it("should return 400 if email is already taken by another user", async () => {
    User.findOne.mockResolvedValue({ UserId: 999 }); // someone else has the email

    const res = await request(app)
      .post("/api/editUser")
      .send({ userId, email: "taken@email.com" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Email is already taken");
  });
  /*Get User*/

  //Happy path
  it("should return user info if user exists", async () => {
    const userData = {
      UserId: userId,
      FirstName: "Brock",
      LastName: "Stone",
      Email: "brock@pewter.com",
    };

    User.findOne.mockResolvedValue(userData);

    const res = await request(app).post("/api/get-user").send({ userId });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      userId,
      firstName: "Brock",
      lastName: "Stone",
      email: "brock@pewter.com",
    });
  });
  //Sad paths
  it("should return 404 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app).post("/api/get-user").send({ userId });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });
});
