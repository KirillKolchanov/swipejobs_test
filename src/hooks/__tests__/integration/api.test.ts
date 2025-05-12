import axios from "axios";
import { API_BASE_URL, USER_ID } from "../../../constants";
import { renderHook, waitFor } from "@testing-library/react";
import { useUser } from "../../../hooks/useUser";
import { useJobsMatches } from "../../../hooks/useJobsMatches";
import { useAcceptJob } from "../../../hooks/useAcceptJob";
import { useRejectJob } from "../../../hooks/useRejectJob";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("API Data Flow Tests", () => {
    it("should fetch user profile and job matches sequentially", async () => {
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
      ];

      mockedAxios.get
        .mockImplementationOnce(() => Promise.resolve({ data: mockUserData }))
        .mockImplementationOnce(() => Promise.resolve({ data: mockJobsData }));

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
    });
  });

  describe("User Actions Integration Tests", () => {
    it("should handle job acceptance flow", async () => {
      const mockAcceptResponse = {
        success: true,
        message: "Job accepted successfully",
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockAcceptResponse });

      const { result } = renderHook(() => useAcceptJob());

      const jobId = "job123";
      let response;

      await waitFor(async () => {
        response = await result.current.acceptJob(API_BASE_URL, USER_ID, jobId);
      });

      expect(response).toEqual(mockAcceptResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/${USER_ID}/job/${jobId}/accept`
      );
      expect(result.current.isAcceptLoading).toBe(false);
    });

    it("should handle job rejection flow", async () => {
      const mockRejectResponse = {
        success: true,
        message: "Job rejected successfully",
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockRejectResponse });

      const { result } = renderHook(() => useRejectJob());

      const jobId = "job123";
      let response;

      await waitFor(async () => {
        response = await result.current.rejectJob(API_BASE_URL, USER_ID, jobId);
      });

      expect(response).toEqual(mockRejectResponse);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${API_BASE_URL}/${USER_ID}/job/${jobId}/reject`
      );
      expect(result.current.isRejectLoading).toBe(false);
    });

    it("should handle failures in the API chain", async () => {
      const mockError = new Error("API Error");
      mockedAxios.get.mockRejectedValueOnce(mockError);

      const { result } = renderHook(() =>
        useJobsMatches(API_BASE_URL, USER_ID)
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe("Error loading user data");
      expect(result.current.jobs).toBeNull();
    });
  });
});
