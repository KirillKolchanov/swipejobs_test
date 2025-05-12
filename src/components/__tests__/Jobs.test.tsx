import React from "react";
import { render } from "@testing-library/react-native";
import Jobs from "../Jobs";
import * as useJobsMatchesHook from "../../hooks/useJobsMatches";
import * as useAcceptJobHook from "../../hooks/useAcceptJob";
import * as useRejectJobHook from "../../hooks/useRejectJob";
import * as JobsContext from "../../context/JobsContext";
import { Job } from "../../types/user";

jest.mock("../../constants", () => ({
  API_BASE_URL: "https://test-api.com",
  USER_ID: "test-user-123",
}));

jest.mock("../JobCard", () => "JobCard");

describe("Jobs", () => {
  const mockJob: Job = {
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
      {
        startDate: "2023-07-02T09:00:00Z",
        endDate: "2023-07-02T17:00:00Z",
      },
    ],
    requirements: ["Requirement 1", "Requirement 2"],
    branchPhoneNumber: "+1234567890",
    branch: "Main Branch",
  };

  const mockJobs = [mockJob];

  const mockJobsContext = {
    currentIndex: 0,
    setCurrentIndex: jest.fn(),
    isJobAccepted: false,
    setIsJobAccepted: jest.fn(),
  };

  const mockAcceptJob = {
    acceptJob: jest.fn(),
    isAcceptLoading: false,
  };

  const mockRejectJob = {
    rejectJob: jest.fn(),
    isRejectLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(JobsContext, "useJobs").mockReturnValue(mockJobsContext);
    jest.spyOn(useAcceptJobHook, "useAcceptJob").mockReturnValue(mockAcceptJob);
    jest.spyOn(useRejectJobHook, "useRejectJob").mockReturnValue(mockRejectJob);
  });

  it("renders loading state", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: null,
      loading: true,
      error: null,
    });

    const { getByText } = render(<Jobs />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders error state", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: null,
      loading: false,
      error: "Failed to fetch jobs",
    });

    const { getByText } = render(<Jobs />);
    expect(getByText("Error: Failed to fetch jobs")).toBeTruthy();
  });

  it("renders no jobs found state", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: [],
      loading: false,
      error: null,
    });

    const { getByText } = render(<Jobs />);
    expect(getByText("No jobs found")).toBeTruthy();
  });

  it("renders no more jobs state when currentIndex exceeds jobs length", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: mockJobs,
      loading: false,
      error: null,
    });

    jest.spyOn(JobsContext, "useJobs").mockReturnValue({
      ...mockJobsContext,
      currentIndex: 1,
    });

    const { getByText } = render(<Jobs />);
    expect(
      getByText("No more jobs at the moment (reload the app)")
    ).toBeTruthy();
  });
});
