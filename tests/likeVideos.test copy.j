const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const server = require("../app");
const jwtToken = require("../utils/generateJWToken");

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

  // beforeEach(async () => {
  //   // This can involve inserting some test data into the database
  //   await mongoose.connection.dropDatabase(); // Clear the entire database
  // });
  let token;
  
  it("user like a video", async () => {
    token = jwtToken('64fc6c82f274104a1abfbb39')
    const res = await request(app)
      .post("/v1/api/videos/64fc7534867c4e93a88ef58d/likes")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
  });



afterAll((done) => {
  server.close(done);
})
})
