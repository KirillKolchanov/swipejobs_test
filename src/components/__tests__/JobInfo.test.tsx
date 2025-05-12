import React from "react";
import { render } from "@testing-library/react-native";
import JobInfo from "../JobInfo";
import * as useJobsMatchesHook from "../../hooks/useJobsMatches";
import * as useAcceptJobHook from "../../hooks/useAcceptJob";
import * as useRejectJobHook from "../../hooks/useRejectJob";
import * as JobsContext from "../../context/JobsContext";
import { Job } from "../../types/user";

// Мокаем константы
jest.mock("../../constants", () => ({
  API_BASE_URL: "https://test-api.com",
  USER_ID: "test-user-123",
}));

// Мокаем expo-router
jest.mock("expo-router", () => ({
  router: {
    back: jest.fn(),
    replace: jest.fn(),
  },
}));

// Мокаем expo-router/build/hooks
jest.mock("expo-router/build/hooks", () => ({
  useSearchParams: () => ({ get: () => "job123" }),
}));

// Мокаем expo-image
jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("JobInfo", () => {
  // Тестовые данные
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

    // Мокируем useJobs
    jest.spyOn(JobsContext, "useJobs").mockReturnValue(mockJobsContext);

    // Мокируем useAcceptJob
    jest.spyOn(useAcceptJobHook, "useAcceptJob").mockReturnValue(mockAcceptJob);

    // Мокируем useRejectJob
    jest.spyOn(useRejectJobHook, "useRejectJob").mockReturnValue(mockRejectJob);
  });

  it("renders loading state", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: null,
      loading: true,
      error: null,
    });

    const { getByText } = render(<JobInfo />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders error state", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: null,
      loading: false,
      error: "Failed to fetch jobs",
    });

    const { getByText } = render(<JobInfo />);
    expect(getByText("Error: Failed to fetch jobs")).toBeTruthy();
  });

  it("renders job not found state", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: [],
      loading: false,
      error: null,
    });

    const { getByText } = render(<JobInfo />);
    expect(getByText("Job not found")).toBeTruthy();
  });

  it("renders job information correctly", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: mockJobs,
      loading: false,
      error: null,
    });

    const { getByText } = render(<JobInfo />);

    expect(getByText("Test Job Title")).toBeTruthy();
    expect(getByText("Test Company")).toBeTruthy();
    expect(getByText("123 Test Street, Test City")).toBeTruthy();
    expect(getByText("America/New_York")).toBeTruthy();
    expect(getByText("5.20 miles from your job search location")).toBeTruthy();
    expect(getByText("$15.00")).toBeTruthy();
    expect(getByText("- Requirement 1")).toBeTruthy();
    expect(getByText("- Requirement 2")).toBeTruthy();
    expect(getByText("Test Manager")).toBeTruthy();
    expect(getByText("Main Branch")).toBeTruthy();
    expect(getByText("+1234567890")).toBeTruthy();
  });

  it("renders accept and reject buttons when job is not accepted", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: mockJobs,
      loading: false,
      error: null,
    });

    const { getByText } = render(<JobInfo />);

    expect(getByText("Accept Job")).toBeTruthy();
    expect(getByText("Reject Job")).toBeTruthy();
  });

  it("renders 'It is your current job' when job is accepted", () => {
    jest.spyOn(JobsContext, "useJobs").mockReturnValue({
      ...mockJobsContext,
      isJobAccepted: true,
    });

    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: mockJobs,
      loading: false,
      error: null,
    });

    const { getByText, queryByText } = render(<JobInfo />);

    expect(getByText("It is your current job")).toBeTruthy();
    expect(queryByText("Accept Job")).toBeNull();
    expect(queryByText("Reject Job")).toBeNull();
  });

  it("renders loading state in accept button when accepting", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: mockJobs,
      loading: false,
      error: null,
    });

    jest.spyOn(useAcceptJobHook, "useAcceptJob").mockReturnValue({
      acceptJob: mockAcceptJob.acceptJob,
      isAcceptLoading: true,
    });

    const { getByText } = render(<JobInfo />);

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders loading state in reject button when rejecting", () => {
    jest.spyOn(useJobsMatchesHook, "useJobsMatches").mockReturnValue({
      jobs: mockJobs,
      loading: false,
      error: null,
    });

    jest.spyOn(useRejectJobHook, "useRejectJob").mockReturnValue({
      rejectJob: mockRejectJob.rejectJob,
      isRejectLoading: true,
    });

    const { getByText } = render(<JobInfo />);

    expect(getByText("Loading...")).toBeTruthy();
  });
});
