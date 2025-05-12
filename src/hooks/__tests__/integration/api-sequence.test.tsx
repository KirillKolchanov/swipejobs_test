import axios from "axios";
import { API_BASE_URL, USER_ID } from "../../../constants";
import { renderHook, waitFor, act } from "@testing-library/react";
import { JobsProvider, useJobs } from "../../../context/JobsContext";
import { useUser } from "../../../hooks/useUser";
import { useJobsMatches } from "../../../hooks/useJobsMatches";
import { useAcceptJob } from "../../../hooks/useAcceptJob";
import { useRejectJob } from "../../../hooks/useRejectJob";
import React from "react";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Sequence Integration Tests", () => {
  const mockUserData = {
    workerId: USER_ID,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    address: {
      formattedAddress: "123 Street, City",
      zoneId: "America/New_York",
    },
    maxJobDistance: 25,
  };

  const mockJobsData = [
    {
      jobId: "job123",
      jobTitle: {
        name: "Test Job Title",
        imageUrl: "https://example.com/image.jpg",
      },
      company: {
        name: "Test Company",
        address: {
          formattedAddress: "123 Test Street, Test City",
          zoneId: "America/New_York",
        },
        reportTo: {
          name: "Test Manager",
        },
      },
      wagePerHourInCents: 1500,
      milesToTravel: 5.2,
      shifts: [
        {
          startDate: "2023-07-01T09:00:00Z",
          endDate: "2023-07-01T17:00:00Z",
        },
      ],
      branch: "Main Branch",
      branchPhoneNumber: "+1234567890",
    },
    {
      jobId: "job456",
      jobTitle: {
        name: "Second Job",
        imageUrl: "https://example.com/image2.jpg",
      },
      company: {
        name: "Another Company",
        address: {
          formattedAddress: "456 Another Street, Another City",
          zoneId: "America/New_York",
        },
        reportTo: {
          name: "Another Manager",
        },
      },
      wagePerHourInCents: 2000,
      milesToTravel: 10.5,
      shifts: [
        {
          startDate: "2023-07-02T09:00:00Z",
          endDate: "2023-07-02T17:00:00Z",
        },
      ],
      branch: "Another Branch",
      branchPhoneNumber: "+0987654321",
    },
  ];

  const mockAcceptResponse = {
    success: true,
    message: "Job accepted successfully",
  };

  const mockRejectResponse = {
    success: true,
    message: "Job rejected successfully",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should simulate a complete user flow: load profile, get jobs, reject one, accept another", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockResolvedValueOnce({ data: mockJobsData })
      .mockResolvedValueOnce({ data: mockRejectResponse })
      .mockResolvedValueOnce({ data: mockAcceptResponse });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <JobsProvider>{children}</JobsProvider>
    );

    const { result: userResult } = renderHook(() =>
      useUser(API_BASE_URL, USER_ID)
    );

    await waitFor(() => {
      expect(userResult.current.loading).toBe(false);
    });

    expect(userResult.current.user).toEqual(mockUserData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/${USER_ID}/profile`
    );

    const { result: jobsResult } = renderHook(() =>
      useJobsMatches(API_BASE_URL, USER_ID)
    );

    await waitFor(() => {
      expect(jobsResult.current.loading).toBe(false);
    });

    expect(jobsResult.current.jobs).toEqual(mockJobsData);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/${USER_ID}/matches`
    );

    const { result: jobsContextResult } = renderHook(() => useJobs(), {
      wrapper,
    });

    expect(jobsContextResult.current.currentIndex).toBe(0);

    const { result: rejectResult } = renderHook(() => useRejectJob());

    let rejectResponse;
    await act(async () => {
      rejectResponse = await rejectResult.current.rejectJob(
        API_BASE_URL,
        USER_ID,
        mockJobsData[0].jobId
      );
    });

    expect(rejectResponse).toEqual(mockRejectResponse);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/${USER_ID}/job/${mockJobsData[0].jobId}/reject`
    );

    act(() => {
      jobsContextResult.current.setCurrentIndex(1);
    });

    expect(jobsContextResult.current.currentIndex).toBe(1);

    const { result: acceptResult } = renderHook(() => useAcceptJob());

    let acceptResponse;
    await act(async () => {
      acceptResponse = await acceptResult.current.acceptJob(
        API_BASE_URL,
        USER_ID,
        mockJobsData[1].jobId
      );
    });

    expect(acceptResponse).toEqual(mockAcceptResponse);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/${USER_ID}/job/${mockJobsData[1].jobId}/accept`
    );

    act(() => {
      jobsContextResult.current.setIsJobAccepted(true);
    });

    expect(jobsContextResult.current.isJobAccepted).toBe(true);

    expect(mockedAxios.get).toHaveBeenCalledTimes(4);
  });

  it("should handle errors during the sequence of API calls", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockUserData })
      .mockRejectedValueOnce(new Error("Network error"));

    const { result: userResult } = renderHook(() =>
      useUser(API_BASE_URL, USER_ID)
    );

    await waitFor(() => {
      expect(userResult.current.loading).toBe(false);
    });

    expect(userResult.current.user).toEqual(mockUserData);

    const { result: jobsResult } = renderHook(() =>
      useJobsMatches(API_BASE_URL, USER_ID)
    );

    await waitFor(() => {
      expect(jobsResult.current.loading).toBe(false);
    });

    expect(jobsResult.current.error).toBe("Error loading user data");
    expect(jobsResult.current.jobs).toBeNull();
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
  });
});
