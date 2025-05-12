import { renderHook, act, waitFor } from "@testing-library/react";
import { useAcceptJob } from "../useAcceptJob";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useAcceptJob", () => {
  const mockBaseUrl = "https://test-api.com";
  const mockWorkerId = "worker123";
  const mockJobId = "job456";
  const mockResponse = { success: true };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should accept job successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useAcceptJob());

    expect(result.current.isAcceptLoading).toBe(false);

    let response;
    await act(async () => {
      response = await result.current.acceptJob(
        mockBaseUrl,
        mockWorkerId,
        mockJobId
      );
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockWorkerId}/job/${mockJobId}/accept`
    );
    expect(response).toEqual(mockResponse);
    expect(result.current.isAcceptLoading).toBe(false);
  });

  it("should handle error when accepting job", async () => {
    const mockError = new Error("Network error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useAcceptJob());

    await expect(
      act(async () => {
        await result.current.acceptJob(mockBaseUrl, mockWorkerId, mockJobId);
      })
    ).rejects.toThrow("Network error");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockWorkerId}/job/${mockJobId}/accept`
    );
    expect(result.current.isAcceptLoading).toBe(false);
  });

  it("should set loading state correctly", async () => {
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.get.mockImplementation(() => promise);

    const { result } = renderHook(() => useAcceptJob());

    expect(result.current.isAcceptLoading).toBe(false);

    act(() => {
      result.current.acceptJob(mockBaseUrl, mockWorkerId, mockJobId);
    });

    // Wait for loading state to update
    await waitFor(() => {
      expect(result.current.isAcceptLoading).toBe(true);
    });

    // Resolve the promise
    resolvePromise!({ data: mockResponse });

    // Wait for loading state to reset
    await waitFor(() => {
      expect(result.current.isAcceptLoading).toBe(false);
    });
  });
});
