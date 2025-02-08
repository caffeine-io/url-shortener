import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../../src/app.js";
import { URL } from "../../src/models/url.model.js";
import { apiLimiter } from "../../src/middleware/rateLimit.js";

describe("URL Shortener API E2E Tests", () => {
  let mongoServer;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    await URL.createIndexes();
    await URL.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    apiLimiter.resetKey("::ffff:127.0.0.1"); // SuperTest's default IP
    await URL.deleteMany({});
  });

  describe("POST /api/urls", () => {
    it("should create a shortened URL", async () => {
      const response = await request(app)
        .post("/api/urls")
        .send({
          originalUrl: "https://www.example.com/verylongurl",
        })
        .expect(201);
      expect(response.body).toHaveProperty("shortUrl");
      expect(response.body.shortUrl).toMatch(/^[a-zA-Z0-9]{7}$/);

      // Verify URL was saved in database
      const savedUrl = await URL.findOne({
        shortUrl: response.body.shortId,
      });
      expect(savedUrl).toBeTruthy();
    });
  });

  describe("GET /api/urls/:shortId", () => {
    it("should return the orignal URL", async () => {
      const createResponse = await request(app)
        .post("/api/urls")
        .send({ originalUrl: "https://www.example.com" });
      const { shortUrl } = createResponse.body;

      // fetch the original URL
      const response = await request(app)
        .get(`/api/urls/${shortUrl}`)
        .expect(200);
      expect(response.body).toHaveProperty(
        "originalUrl",
        "https://www.example.com"
      );
    });
    it("should return 404 for non-existent short URL", async () => {
      await request(app).get("/api/url/nonexistent").expect(404);
    });
  });
  describe("Rate Limiter", () => {
    it("should block requests after rate limit is exceeded", async () => {
      const requests = Array(101)
        .fill()
        .map(() =>
          request(app)
            .post("/api/urls")
            .set("X-Forwarded-For", `192.168.1.33`)
            .send({
              originalUrl: "https://www.example.com/ratelimitest",
            })
        );
      const responses = await Promise.all(requests);
      // Only ONE request should get 201 (the actual creation)
      const createdResponses = responses.filter((res) => res.status === 201);
      expect(createdResponses.length).toBe(1);

      const okResponses = responses.filter((res) => res.status === 200);
      expect(okResponses.length).toBe(99);

      const rateLimitedResponses = responses.filter(
        (res) => res.status === 429
      );
      expect(rateLimitedResponses.length).toBe(1);
    });
  });
});
