import request from "supertest";
import app from "../index.js";

describe("Base API Tests", () => {
  it("should return the welcome message on /", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("Backend de la Pastelería Online");
  });

  it("should return 401 if accessing protected routes without token", async () => {
    const res = await request(app).get("/api/productos");
    expect(res.statusCode).toEqual(401);
  });
});
