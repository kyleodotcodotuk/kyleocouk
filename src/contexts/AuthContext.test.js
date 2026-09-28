import { act, renderHook } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

const setup = () => renderHook(() => useAuth(), { wrapper: AuthProvider });

describe("AuthContext", () => {
  it("signs in as a guest", () => {
    const { result } = setup();
    act(() => {
      expect(result.current.login("guest", "guest")).toBe(true);
    });
    expect(result.current.user).toMatchObject({ name: "Guest", isGuest: true });
  });

  it("signs in as the admin, ignoring case and spaces in the username", () => {
    const { result } = setup();
    act(() => {
      result.current.login("  Kyle ", "admin");
    });
    expect(result.current.user).toMatchObject({ name: "Kyle O'Connor", isGuest: false });
  });

  it("rejects a wrong password", () => {
    const { result } = setup();
    act(() => {
      expect(result.current.login("kyle", "guest")).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("keeps the session across a remount and clears it on logout", () => {
    const first = setup();
    act(() => {
      first.result.current.login("guest", "guest");
    });

    const second = setup();
    expect(second.result.current.user?.name).toBe("Guest");

    act(() => {
      second.result.current.logout();
    });
    expect(setup().result.current.isAuthenticated).toBe(false);
  });

  it("treats a session from before accounts existed as a guest", () => {
    sessionStorage.setItem("cms_demo_session", "true");
    expect(setup().result.current.user?.name).toBe("Guest");
  });
});
