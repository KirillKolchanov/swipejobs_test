import { renderHook, waitFor } from "@testing-library/react";
import { useUser } from "../useUser";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useUser", () => {
  const mockBaseUrl = "https://test-api.com";
  const mockUserId = "user123";
  const mockUserData = {
    id: mockUserId,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks();
  });

  it("should fetch user data successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockUserData });

    const { result } = renderHook(() => useUser(mockBaseUrl, mockUserId));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for data to be loaded
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockUserId}/profile`
    );
    expect(result.current.user).toEqual(mockUserData);
    expect(result.current.error).toBe(null);
  });

  it("should handle error when fetching user data", async () => {
    const mockError = new Error("Network error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUser(mockBaseUrl, mockUserId));

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockUserId}/profile`
    );
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe("Error loading user data");
  });

  it("should refetch data when userId changes", async () => {
    const newUserId = "user456";
    const newUserData = {
      id: newUserId,
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
    };

    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: newUserData });

    const { result, rerender } = renderHook(
      ({ userId }) => useUser(mockBaseUrl, userId),
      {
        initialProps: { userId: mockUserId },
      }
    );

    // Wait for first data load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUserData);

    // Change userId
    rerender({ userId: newUserId });

    // Check loading state
    expect(result.current.loading).toBe(true);

    // Wait for new data load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(result.current.user).toEqual(newUserData);
  });
});
