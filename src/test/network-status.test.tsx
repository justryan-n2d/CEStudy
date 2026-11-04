import { act, cleanup, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import { ConnectionStatusNotice } from "../components/ConnectionStatusNotice";

function NetworkStatusProbe() {
  const isOnline = useNetworkStatus();
  return <output data-testid="network-status">{isOnline ? "online" : "offline"}</output>;
}

function setBrowserOnline(value: boolean) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    value,
  });
}

beforeEach(() => {
  setBrowserOnline(true);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  setBrowserOnline(true);
});

describe("browser-reported network status", () => {
  it("initializes from navigator.onLine", () => {
    setBrowserOnline(false);

    const { result } = renderHook(() => useNetworkStatus());

    expect(result.current).toBe(false);
  });

  it("updates to offline when the browser dispatches an offline event", () => {
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      setBrowserOnline(false);
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current).toBe(false);
  });

  it("updates to online when the browser dispatches an online event", () => {
    setBrowserOnline(false);
    const { result } = renderHook(() => useNetworkStatus());

    act(() => {
      setBrowserOnline(true);
      window.dispatchEvent(new Event("online"));
    });

    expect(result.current).toBe(true);
  });

  it("removes browser event listeners when the last subscriber unmounts", () => {
    const removeListener = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useNetworkStatus());

    unmount();

    expect(removeListener).toHaveBeenCalledWith("online", expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith("offline", expect.any(Function));
  });
});

describe("global offline notice", () => {
  it("does not render while the browser reports online", () => {
    setBrowserOnline(true);

    render(<ConnectionStatusNotice />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders one polite status message when the browser reports offline", () => {
    setBrowserOnline(false);

    render(<ConnectionStatusNotice />);

    const notice = screen.getByRole("status");
    expect(notice).toHaveTextContent(
      "You're offline. Some CEStudy content may be unavailable until your connection returns.",
    );
    expect(notice).toHaveAttribute("aria-live", "polite");
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("appears and disappears on browser events without reloading", () => {
    setBrowserOnline(true);
    render(<ConnectionStatusNotice />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    act(() => {
      setBrowserOnline(false);
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      setBrowserOnline(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
