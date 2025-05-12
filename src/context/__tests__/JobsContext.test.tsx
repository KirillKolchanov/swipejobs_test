import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { JobsProvider, useJobs } from "../JobsContext";

describe("JobsContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <JobsProvider>{children}</JobsProvider>
  );

  it("initializes with default values", () => {
    const { result } = renderHook(() => useJobs(), { wrapper });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isJobAccepted).toBe(false);
    expect(typeof result.current.setCurrentIndex).toBe("function");
    expect(typeof result.current.setIsJobAccepted).toBe("function");
  });

  it("updates currentIndex when setCurrentIndex is called", () => {
    const { result } = renderHook(() => useJobs(), { wrapper });

    act(() => {
      result.current.setCurrentIndex(2);
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it("updates isJobAccepted when setIsJobAccepted is called", () => {
    const { result } = renderHook(() => useJobs(), { wrapper });

    act(() => {
      result.current.setIsJobAccepted(true);
    });

    expect(result.current.isJobAccepted).toBe(true);
  });

  it("allows functional updates to currentIndex", () => {
    const { result } = renderHook(() => useJobs(), { wrapper });

    act(() => {
      result.current.setCurrentIndex(1);
    });

    act(() => {
      result.current.setCurrentIndex((prev) => prev + 1);
    });

    expect(result.current.currentIndex).toBe(2);
  });

  it("maintains separate state for currentIndex and isJobAccepted", () => {
    const { result } = renderHook(() => useJobs(), { wrapper });

    act(() => {
      result.current.setCurrentIndex(3);
    });

    expect(result.current.currentIndex).toBe(3);
    expect(result.current.isJobAccepted).toBe(false);

    act(() => {
      result.current.setIsJobAccepted(true);
    });

    expect(result.current.currentIndex).toBe(3);
    expect(result.current.isJobAccepted).toBe(true);
  });
});
