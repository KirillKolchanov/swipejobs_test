import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import { JobsProvider } from "../../../context/JobsContext";
import Jobs from "../../../components/Jobs";
import { API_BASE_URL, USER_ID } from "../../../constants";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

jest.mock("../../../components/JobCard", () => {
  return {
    __esModule: true,
    default: (props: any) => null,
  };
});

describe("UI-API Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should render jobs from API and handle user interactions", async () => {
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

    mockedAxios.get.mockResolvedValueOnce({ data: mockJobsData });

    const { getByText, queryByText } = render(
      <JobsProvider>
        <Jobs />
      </JobsProvider>
    );

    expect(getByText("Loading...")).toBeTruthy();

    await waitFor(() => {
      expect(queryByText("Loading...")).toBeNull();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${API_BASE_URL}/${USER_ID}/matches`
    );
  });

  it("should show error message when API request fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    const { getByText, queryByText } = render(
      <JobsProvider>
        <Jobs />
      </JobsProvider>
    );

    expect(getByText("Loading...")).toBeTruthy();

    await waitFor(() => {
      expect(queryByText("Loading...")).toBeNull();
    });

    expect(getByText("Error: Error loading user data")).toBeTruthy();
  });
});
