import { beforeEach, describe, expect, it, vi } from "vitest";
import useProfileStore from "../profileStore";
import useAuthStore from "../authStore";

vi.mock("../../services/user.service", () => ({
  getProfileById: vi.fn(),
  updateProfile: vi.fn(),
}));

const { getProfileById } = await import("../../services/user.service");

describe("useProfileStore", () => {
  beforeEach(() => {
    useProfileStore.setState({ user: null, loading: false, error: null });
    useAuthStore.setState({
      user: { id: 1 },
      token: null,
      expiresAt: null,
      isAuthenticated: true,
    });
    vi.clearAllMocks();
  });

  it("does not reuse a cached profile from a different auth user", async () => {
    useProfileStore.setState({ user: { id: 99, firstName: "Old" } });

    getProfileById.mockResolvedValue({ data: { id: 1, firstName: "New" } });

    const result = await useProfileStore.getState().fetchProfile();

    expect(result).toEqual({ id: 1, firstName: "New" });
    expect(getProfileById).toHaveBeenCalledWith(1);
  });
});
