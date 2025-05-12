import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { Header } from "../Header";
import * as useUserHook from "../../hooks/useUser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => "/some-path",
  Link: ({ children }: any) => children,
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ top: 20 });
  });

  it("renders loading state", () => {
    jest.spyOn(useUserHook, "useUser").mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    const { getByText } = render(<Header />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders error state", () => {
    jest.spyOn(useUserHook, "useUser").mockReturnValue({
      user: null,
      loading: false,
      error: "Failed to fetch user",
    });

    const { getByText } = render(<Header />);
    expect(getByText("User not found")).toBeTruthy();
  });

  it("renders user data", async () => {
    jest.spyOn(useUserHook, "useUser").mockReturnValue({
      user: {
        workerId: "123",
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phoneNumber: "+1234567890",
        address: {
          formattedAddress: "123 Street, City",
          zoneId: "America/New_York",
        },
        maxJobDistance: 25,
      },
      loading: false,
      error: null,
    });

    const { getByText } = render(<Header />);

    await waitFor(() => {
      expect(getByText("Jane Doe")).toBeTruthy();
    });
  });
});
