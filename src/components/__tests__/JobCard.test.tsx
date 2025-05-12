import React from "react";
import { render } from "@testing-library/react-native";
import JobCard from "../JobCard";
import { Job } from "../../types/user";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

jest.mock("expo-image", () => ({
  Image: "Image",
}));

describe("JobCard", () => {
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
      {
        startDate: "2023-07-03T09:00:00Z",
        endDate: "2023-07-03T17:00:00Z",
      },
    ],
    requirements: ["Requirement 1", "Requirement 2"],
    branchPhoneNumber: "+1234567890",
    branch: "Main Branch",
  };

  const mockProps = {
    job: mockJob,
    isJobAccepted: false,
    onAcceptJob: jest.fn(),
    onRejectJob: jest.fn(),
    isRejectLoading: false,
    isAcceptLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders job title and company name correctly", () => {
    const { getByText } = render(<JobCard {...mockProps} />);

    expect(getByText("Test Job Title")).toBeTruthy();
    expect(getByText("Test Company")).toBeTruthy();
  });

  it("renders distance and hourly rate", () => {
    const { getByText } = render(<JobCard {...mockProps} />);

    expect(getByText("5.2 miles")).toBeTruthy();
    expect(getByText("$15.00")).toBeTruthy();
  });

  it("shows button for showing more shifts when there are more than 2 shifts", () => {
    const { getByText } = render(<JobCard {...mockProps} />);

    // Проверяем, что кнопка "Show more shifts" присутствует
    expect(getByText("Show more shifts")).toBeTruthy();
  });

  it("displays job requirements correctly", () => {
    const { getByText } = render(<JobCard {...mockProps} />);

    expect(getByText("- Requirement 1")).toBeTruthy();
    expect(getByText("- Requirement 2")).toBeTruthy();
  });

  it("displays report to information correctly", () => {
    const { getByText } = render(<JobCard {...mockProps} />);

    expect(getByText("Test Manager (+1234567890)")).toBeTruthy();
  });

  it("displays location information correctly", () => {
    const { getByText } = render(<JobCard {...mockProps} />);

    expect(getByText("123 Test Street, Test City")).toBeTruthy();
    expect(getByText("5.20 miles from your job search location")).toBeTruthy();
  });

  it("displays 'It is your current job' when job is accepted", () => {
    const props = {
      ...mockProps,
      isJobAccepted: true,
    };

    const { getByText, queryByText } = render(<JobCard {...props} />);

    expect(getByText("It is your current job")).toBeTruthy();
    expect(queryByText("I will Take it")).toBeNull();
    expect(queryByText("No Thanks")).toBeNull();
  });

  it("shows loading state when accept is loading", () => {
    const props = {
      ...mockProps,
      isAcceptLoading: true,
    };

    const { getByText } = render(<JobCard {...props} />);

    expect(getByText("Loading...")).toBeTruthy();
  });

  it("shows loading state when reject is loading", () => {
    const props = {
      ...mockProps,
      isRejectLoading: true,
    };

    const { getByText } = render(<JobCard {...props} />);

    expect(getByText("Loading...")).toBeTruthy();
  });
});
