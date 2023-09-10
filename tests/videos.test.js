const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const jwtToken = require("../utils/generateJWToken");
const server=app.listen(3000, () => {
  console.log(`Server running on port ${3000}...🏃`);
});
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
  let param = "";

  it("should return all videos", async () => {
    token = jwtToken('64fc6c82f274104a1abfbb39')
    const res = await request(app)
      .get("/v1/api/videos/")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(0);
  });

  it("should create a video", async () => {
    token = jwtToken('64fc6c82f274104a1abfbb39')
    const res = await request(app)
      .post("/v1/api/videos/")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Video 1",
        video: "Testing.file",
        description: "Description 1",
      });
    param = res.body.data._id;
    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Video 1");
  });

  it("should return a video", async () => {
    token = jwtToken('64fc6c82f274104a1abfbb39')
    const res = await request(app)
      .get("/v1/api/videos/64fc66ff47d577ea92deb658")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Success");
  });

  it("should update a video", async () => {
    token = jwtToken('64fc6c82f274104a1abfbb39')
    const res = await request(app)
      .patch("/v1/api/videos/64fc66ff47d577ea92deb658")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Video 6",
        video: "Testing.file",
        description: "Description 6",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Video 6");
  });

  it("should delete a video", async () => {
    token = jwtToken('64fc6c82f274104a1abfbb39')
    const res = await request(app)
      .delete(`/v1/api/videos/${param}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});

afterAll((done) => {
  server.close(done);
});
