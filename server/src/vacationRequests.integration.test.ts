import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "./createApp.js";
import appDataSource from "./db/dataSource.js";
import { resetDatabase } from "./test/resetDatabase.js";

const app = createApp();

const createVacationRequest = (overrides: Record<string, unknown> = {}) =>
  request(app)
    .post("/api/vacation-requests")
    .send({
      user_id: 1,
      start_date: "2026-06-01",
      end_date: "2026-06-05",
      reason: "Family trip",
      ...overrides,
    });

beforeAll(async () => {
  await appDataSource.initialize();
});

beforeEach(async () => {
  await resetDatabase(appDataSource);
});

afterAll(async () => {
  await appDataSource.destroy();
});

describe("POST /api/vacation-requests", () => {
  it("creates a request", async () => {
    const res = await createVacationRequest();

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: 1,
      startDate: "2026-06-01",
      endDate: "2026-06-05",
      reason: "Family trip",
      status: "Pending",
    });
    expect(res.body.id).toBeTypeOf("number");
    expect(res.body.createdAt).toBeDefined();
  });

  it("requires dates when creating a request", async () => {
    const res = await request(app).post("/api/vacation-requests").send({
      user_id: 1,
      start_date: "2026-06-01",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "user_id, start_date and end_date are required",
    });
  });
});

describe("POST /api/vacation-requests/:id/approve", () => {
  it("approves a request", async () => {
    const created = await createVacationRequest();
    const id = created.body.id as number;

    const res = await request(app)
      .post(`/api/vacation-requests/${id}/approve`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id,
      status: "Approved",
      comments: null,
    });
  });

  it("clears comments when approving a request", async () => {
    const created = await createVacationRequest();
    const id = created.body.id as number;

    await request(app)
      .post(`/api/vacation-requests/${id}/reject`)
      .send({ comments: "Not enough coverage" });

    const res = await request(app)
      .post(`/api/vacation-requests/${id}/approve`)
      .send({});

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id,
      status: "Approved",
      comments: null,
    });
  });
});

describe("POST /api/vacation-requests/:id/reject", () => {
  it("rejects a request with comments", async () => {
    const created = await createVacationRequest({
      start_date: "2026-08-01",
      end_date: "2026-08-04",
      reason: "Break",
    });
    const id = created.body.id as number;

    const res = await request(app)
      .post(`/api/vacation-requests/${id}/reject`)
      .send({ comments: "Dates conflict with blackout period" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id,
      status: "Rejected",
      comments: "Dates conflict with blackout period",
    });
  });

  it("requires comments when rejecting", async () => {
    const created = await createVacationRequest();
    const id = created.body.id as number;

    const res = await request(app)
      .post(`/api/vacation-requests/${id}/reject`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "comments are required",
    });
  });
});

describe("GET /api/vacation-requests", () => {
  it("filters by status", async () => {
    await createVacationRequest({ reason: "Pending request" });

    const second = await createVacationRequest({
      start_date: "2026-11-01",
      end_date: "2026-11-03",
      reason: "Approved request",
    });

    await request(app)
      .post(`/api/vacation-requests/${second.body.id}/approve`)
      .send({});

    const pending = await request(app)
      .get("/api/vacation-requests")
      .query({ status: "Pending" });

    expect(pending.status).toBe(200);
    expect(pending.body).toHaveLength(1);
    expect(pending.body[0].status).toBe("Pending");

    const approved = await request(app)
      .get("/api/vacation-requests")
      .query({ status: "Approved" });

    expect(approved.status).toBe(200);
    expect(approved.body).toHaveLength(1);
    expect(approved.body[0].status).toBe("Approved");
  });
});

describe("GET /api/vacation-requests/:id", () => {
  it("returns 404 for a missing request", async () => {
    const res = await request(app).get("/api/vacation-requests/99999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "vacation request not found",
    });
  });
});
