const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const server = require("../app");

require("dotenv").config();

describe("API Tests for Videos", () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.DATABASE_DEV, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // This can involve inserting some test data into the database
    await mongoose.connection.dropDatabase(); // Clear the entire database
  });

  it("should return all videos", async () => {
    const res = await request(app).get("/v1/api/videos/");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it("should create a video", async () => {
    const res = await request(app).post("/v1/api/videos/").send({
      title: "Video 1",
      video: "Testing.file",
      description: "Description 1",
    });
    console.log(res.statusCode)
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Video 1");
  });
});

afterAll((done) => {
  server.close(done);
});
