import { renderHook, waitFor } from "@testing-library/react";
import { useJobsMatches } from "../useJobsMatches";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("useJobsMatches", () => {
  const mockBaseUrl = "https://test-api.com";
  const mockUserId = "user123";
  const mockJobsData = [
    {
      jobId: "job1",
      jobTitle: "Software Engineer",
      company: "Tech Corp",
      wagePerHourInCents: 5000,
      milesToTravel: 10,
    },
    {
      jobId: "job2",
      jobTitle: "Frontend Developer",
      company: "Web Solutions",
      wagePerHourInCents: 4500,
      milesToTravel: 5,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks();
  });

  it("should fetch jobs matches successfully", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockJobsData });

    const { result } = renderHook(() =>
      useJobsMatches(mockBaseUrl, mockUserId)
    );

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.jobs).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for data to be loaded
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockUserId}/matches`
    );
    expect(result.current.jobs).toEqual(mockJobsData);
    expect(result.current.error).toBe(null);
  });

  it("should handle error when fetching jobs matches", async () => {
    const mockError = new Error("Network error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useJobsMatches(mockBaseUrl, mockUserId)
    );

    // Initial state
    expect(result.current.loading).toBe(true);
    expect(result.current.jobs).toBe(null);
    expect(result.current.error).toBe(null);

    // Wait for error to be set
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockBaseUrl}/${mockUserId}/matches`
    );
    expect(result.current.jobs).toBe(null);
    expect(result.current.error).toBe("Error loading user data");
  });

  it("should refetch data when userId changes", async () => {
    const newUserId = "user456";
    const newJobsData = [
      {
        jobId: "job3",
        jobTitle: "Backend Developer",
        company: "API Solutions",
        wagePerHourInCents: 5500,
        milesToTravel: 15,
      },
    ];

    mockedAxios.get
      .mockResolvedValueOnce({ data: mockJobsData })
      .mockResolvedValueOnce({ data: newJobsData });

    const { result, rerender } = renderHook(
      ({ userId }) => useJobsMatches(mockBaseUrl, userId),
      {
        initialProps: { userId: mockUserId },
      }
    );

    // Wait for first data load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.jobs).toEqual(mockJobsData);

    // Change userId
    rerender({ userId: newUserId });

    // Check loading state
    expect(result.current.loading).toBe(true);

    // Wait for new data load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(result.current.jobs).toEqual(newJobsData);
  });
});
