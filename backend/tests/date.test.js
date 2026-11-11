import test from "node:test";
import assert from "node:assert/strict";
import { parseDateOnly, getReportRange } from "../src/utils/date.js";

test("parseDateOnly accepts a real YYYY-MM-DD date", () => {
  assert.equal(parseDateOnly("2026-11-10").toISOString(), "2026-11-10T00:00:00.000Z");
  assert.equal(parseDateOnly("2026-02-30"), null);
  assert.equal(parseDateOnly("10-11-2026"), null);
});

test("daily report range covers exactly one day", () => {
  const range = getReportRange("daily", "2026-11-10");
  assert.equal(range.start.toISOString(), "2026-11-10T00:00:00.000Z");
  assert.equal(range.end.toISOString(), "2026-11-11T00:00:00.000Z");
});

test("monthly report covers the previous full month", () => {
  const range = getReportRange("monthly", "2026-11-10");
  assert.equal(range.start.toISOString(), "2026-10-01T00:00:00.000Z");
  assert.equal(range.end.toISOString(), "2026-11-01T00:00:00.000Z");
});
