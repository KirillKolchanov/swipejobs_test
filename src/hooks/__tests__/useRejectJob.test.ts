import { renderHook, act, waitFor } from "@testing-library/react";
import { useRejectJob } from "../useRejectJob";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useRejectJob", () => {
  const mockBaseUrl = "https://test-api.com";
  const mockWorkerId = "worker123";
  const mockJobId = "job456";
  const mockResponse = { success: true };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should reject job successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useRejectJob());

    expect(result.current.isRejectLoading).toBe(false);

    let response;
    await act(async () => {
      response = await result.current.rejectJob(
        mockBaseUrl,
        mockWorkerId,
        mockJobId
      );
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockWorkerId}/job/${mockJobId}/reject`
    );
    expect(response).toEqual(mockResponse);
    expect(result.current.isRejectLoading).toBe(false);
  });

  it("should handle error when rejecting job", async () => {
    const mockError = new Error("Network error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRejectJob());

    await expect(
      act(async () => {
        await result.current.rejectJob(mockBaseUrl, mockWorkerId, mockJobId);
      })
    ).rejects.toThrow("Network error");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockWorkerId}/job/${mockJobId}/reject`
    );
    expect(result.current.isRejectLoading).toBe(false);
  });

  it("should set loading state correctly", async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.get.mockImplementation(() => promise);

    const { result } = renderHook(() => useRejectJob());

    expect(result.current.isRejectLoading).toBe(false);

    act(() => {
      result.current.rejectJob(mockBaseUrl, mockWorkerId, mockJobId);
    });

    // Wait for loading state to update
    await waitFor(() => {
      expect(result.current.isRejectLoading).toBe(true);
    });

    // Resolve the promise
    resolvePromise!({ data: mockResponse });

    // Wait for loading state to reset
    await waitFor(() => {
      expect(result.current.isRejectLoading).toBe(false);
    });
  });
});
