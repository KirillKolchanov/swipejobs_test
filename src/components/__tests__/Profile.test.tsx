// import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Profile } from "../Profile"; // путь измените под ваш
import * as useUserHook from "../../hooks/useUser";

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

describe("Profile", () => {
  it("renders loading state", () => {
    jest.spyOn(useUserHook, "useUser").mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    const { getByText } = render(<Profile />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders error state", () => {
    jest.spyOn(useUserHook, "useUser").mockReturnValue({
      user: null,
      loading: false,
      error: "Failed to fetch user",
    });

    const { getByText } = render(<Profile />);
    expect(getByText("Failed to fetch user")).toBeTruthy();
  });

  it("renders user data", async () => {
    jest.spyOn(useUserHook, "useUser").mockReturnValue({
      user: {
        workerId: "123",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "+123456789",
        address: {
          formattedAddress: "123 Main St, Anytown",
          zoneId: "America/New_York",
        },
        maxJobDistance: 25,
      },
      loading: false,
      error: null,
    });

    const { getByText } = render(<Profile />);

    await waitFor(() => {
      expect(getByText("Name: John")).toBeTruthy();
      expect(getByText("Surname: Doe")).toBeTruthy();
      expect(getByText("Email: john@example.com")).toBeTruthy();
      expect(getByText("Phone: +123456789")).toBeTruthy();
      expect(getByText("123 Main St, Anytown")).toBeTruthy();
      expect(getByText("Time zone: America/New_York")).toBeTruthy();
      expect(getByText("Maximum distance to work: 25 km")).toBeTruthy();
    });
  });
});
