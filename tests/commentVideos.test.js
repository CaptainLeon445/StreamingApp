const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const jwtToken = require("../utils/generateJWToken");

const server = app.listen(3002, () => {
  console.log(`Server running on port ${3002}...🏃`);
});
require("dotenv").config();

describe("API Tests for Comments on Videos", () => {
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

  it("user's comment on a video", async () => {
    token = jwtToken("64fc6c82f274104a1abfbb39");
    const res = await request(app)
      .get("/v1/api/videos/user/comments")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });

  it("user comment on a video", async () => {
    token = jwtToken("64fc6c82f274104a1abfbb39");
    const res = await request(app)
      .post("/v1/api/videos/64fc7534867c4e93a88ef58d/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is the best video.",
      });
    expect(res.statusCode).toBe(201);
  });

  it("user edit his comment on a video", async () => {
    token = jwtToken("64fc6c82f274104a1abfbb39");
    const res = await request(app)
      .patch("/v1/api/videos/64fc7534867c4e93a88ef58d/comment")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is the best video, I must confess.",
      });
    expect(res.statusCode).toBe(200);
  });

  it("user delete his comment on a video", async () => {
    token = jwtToken("64fc6c82f274104a1abfbb39");
    const res = await request(app)
      .delete("/v1/api/videos/64fda011c4e48767dd2d6c8e/comment")
      .set("Authorization", `Bearer ${token}`)
    expect(res.statusCode).toBe(204);
  });

  afterAll((done) => {
    server.close(done);
  });
});
