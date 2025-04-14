//This is a test file for the Itinerary API routes.

//Dummy environment variables
process.env.SENDGRID_API_KEY = "SG.fake";
process.env.SENDGRID_FROM_EMAIL = "test@fake.com";
process.env.FRONTEND_URL = "http://localhost";
process.env.API_KEY = "fake-google-ai-key";
process.env.UNSPLASH_ACCESS_KEY = "unsplash-fake";

// Setup the test environment
const request = require("supertest");
const express = require("express");
const app = express();
app.use(express.json());

// Mock the User model and email service and Google Generative AI
jest.mock("../models/Itinerary.js");
const Itinerary = require("../models/Itinerary.js");
jest.mock("@google/generative-ai", () => {
    return {
      GoogleGenerativeAI: jest.fn(() => ({
        getGenerativeModel: () => ({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: () =>
                JSON.stringify({
                  title: "AI Trip",
                  destination: "Tokyo",
                  duration: 3,
                  groupSize: 2,
                  description: "A fun trip",
                  image: "http://image.com",
                  price: 1000,
                  tags: ["ai", "fun"],
                  dailyBreakdown: [
                    {
                      day: 1,
                      activities: [
                        {
                          time: "9:00 AM",
                          activity: "Sushi",
                          location: "Tsukiji",
                          cost: "$30",
                        },
                      ],
                    },
                  ],
                }),
            },
          }),
        }),
      })),
    };
  });

  // Mock Unsplash image fetch
  jest.mock("node-fetch", () =>
  jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          results: [{ urls: { regular: "http://image.com" } }],
        }),
    })
  )
);
  
// Load the app and attach routes
const api = require("../api.js");
api.setApp(app, {}); // no real db needed

// Test suite for Itinerary API routes
describe("Itinerary Routes", () => {
  const userId = 123;
  const fakeToken = "valid.token";
  const itinerary = { title: "My Test Trip" };
  const itineraryId = 456;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //  Add Itinerary
  it("should add a new itinerary", async () => {
    Itinerary.prototype.save = jest.fn().mockResolvedValue({ ItineraryId: itineraryId });

    const res = await request(app)
      .post("/api/addItinerary")
      .send({ userId, itinerary });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("ItineraryId", itineraryId);
  });

  //  Edit Itinerary
  it("should edit an itinerary", async () => {
    Itinerary.updateOne.mockResolvedValue({ modifiedCount: 1 });

    const res = await request(app)
      .post("/api/editItinerary")
      .send({
        userId,
        itineraryId,
        newItinerary: { title: "Updated Trip" },
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Itinerary updated successfully");
  });

  //  Delete Itinerary
  it("should delete an itinerary", async () => {
    Itinerary.deleteOne.mockResolvedValue({ deletedCount: 1 });

    const res = await request(app)
      .post("/api/deleteItinerary")
      .send({
        userId,
        itineraryId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Event successfully deleted");
  });

  //  Search Itinerary
  it("should return matching itineraries", async () => {
    const results = [
      {
        ItineraryId: 789,
        UserId: userId,
        Itinerary: { title: "My Test Trip" },
      },
    ];
    Itinerary.find.mockResolvedValue(results);

    const res = await request(app)
      .post("/api/searchItinerary")
      .send({ userId, itineraryName: "Test"});

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("Itineraries");
    expect(Array.isArray(res.body.Itineraries)).toBe(true);
  });

  //  Generate Itinerary
  it("should generate an itinerary using AI", async () => {
    

    const res = await request(app)
      .post("/api/generate-itinerary")
      .send({
        destination: "Tokyo",
        duration: 3,
        groupSize: 2,
        preferences: "food, tech",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "AI Trip");
    expect(res.body.dailyBreakdown.length).toBeGreaterThan(0);
  });
});
