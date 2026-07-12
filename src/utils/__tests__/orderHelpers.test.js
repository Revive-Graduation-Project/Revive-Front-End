import { describe, expect, it } from "vitest";
import { isOrderCancellable } from "../orderHelpers";

describe("isOrderCancellable", () => {
  it("returns true only when status is PENDING or CONFIRMED (case-insensitive)", () => {
    expect(isOrderCancellable({ status: "PENDING" })).toBe(true);
    expect(isOrderCancellable({ status: "pending" })).toBe(true);
    expect(isOrderCancellable({ status: "CONFIRMED" })).toBe(true);
    expect(isOrderCancellable({ status: "confirmed" })).toBe(true);
  });

  it("returns false for PREPARING, READY, DONE, COMPLETED, CANCELED, or other statuses", () => {
    expect(isOrderCancellable({ status: "PREPARING" })).toBe(false);
    expect(isOrderCancellable({ status: "READY" })).toBe(false);
    expect(isOrderCancellable({ status: "DONE" })).toBe(false);
    expect(isOrderCancellable({ status: "COMPLETED" })).toBe(false);
    expect(isOrderCancellable({ status: "CANCELED" })).toBe(false);
    expect(isOrderCancellable({ status: "FAILED" })).toBe(false);
    expect(isOrderCancellable(null)).toBe(false);
    expect(isOrderCancellable({})).toBe(false);
  });
});
