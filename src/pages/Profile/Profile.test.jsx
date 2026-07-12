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

import { MemoryRouter } from "react-router";

describe("Profile", () => {
  it("renders the join date from the profile data", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/Join date/i)).toBeTruthy();
    expect(screen.getByText(/15 Jan 2024/i)).toBeTruthy();
  });
});
