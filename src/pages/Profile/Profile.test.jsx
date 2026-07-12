import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Profile from "./Profile";

const mockFetchProfile = vi.fn();
const mockUpdateHealth = vi.fn();

vi.mock("../../store", () => ({
  useProfileStore: (selector) =>
    selector({
      user: { createdAt: "2024-01-15T00:00:00.000Z" },
      fetchProfile: mockFetchProfile,
      updateHealth: mockUpdateHealth,
    }),
}));

describe("Profile", () => {
  it("renders the join date from the profile data", () => {
    render(<Profile />);

    expect(screen.getByText(/Join date/i)).toBeTruthy();
    expect(screen.getByText(/2024-01-15/i)).toBeTruthy();
  });
});
