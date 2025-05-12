import { formatShift } from "../formatShift";

describe("formatShift", () => {
  it("formats a shift to the correct string", () => {
    const shift = {
      startDate: "2024-07-01T08:00:00.000Z",
      endDate: "2024-07-01T17:00:00.000Z",
    };
    const result = formatShift(shift);
    expect(result).toMatch(/Mon, Jul 1.* - .* PDT/);
  });

  it("works with different dates", () => {
    const shift = {
      startDate: "2024-12-25T10:30:00.000Z",
      endDate: "2024-12-25T18:00:00.000Z",
    };
    const result = formatShift(shift);
    expect(result).toMatch(/Wed, Dec 25.* - .* PDT/);
  });
});
