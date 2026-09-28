import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "../../contexts/ToastContext";
import TimeOff from "./TimeOff";

// Dates well in the future, so the "can't be in the past" rule never trips
const setDates = (start, end) => {
  fireEvent.change(screen.getByLabelText("First day"), { target: { value: start } });
  fireEvent.change(screen.getByLabelText("Last day"), { target: { value: end } });
};

const setup = () => {
  render(
    <ToastProvider>
      <TimeOff />
    </ToastProvider>
  );
  return userEvent.setup();
};

describe("Time off booking", () => {
  it("shows an error summary and focuses it when submitted empty", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Request time off" }));

    const summary = screen.getByRole("heading", { name: "There's a problem" }).parentElement;
    await waitFor(() => expect(summary).toHaveFocus());
    expect(within(summary).getByRole("link", { name: "Enter the first day of your time off" })).toBeInTheDocument();

    // Each error is also tied to its field
    expect(screen.getByLabelText("First day")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("First day")).toHaveAccessibleDescription(/Enter the first day of your time off/);
  });

  it("moves focus to the field when an error link is followed", async () => {
    const user = setup();
    await user.click(screen.getByRole("button", { name: "Request time off" }));
    await user.click(screen.getByRole("link", { name: "Enter the last day of your time off" }));
    expect(screen.getByLabelText("Last day")).toHaveFocus();
  });

  it("counts working days, skipping the weekend", () => {
    setup();
    // Monday 7 to Monday 14 January 2030
    setDates("2030-01-07", "2030-01-14");
    expect(screen.getByText(/That's/)).toHaveTextContent("That's 6 working days from your allowance.");
  });

  it("refuses a range that's only a weekend", async () => {
    const user = setup();
    setDates("2030-01-05", "2030-01-06");
    await user.click(screen.getByRole("button", { name: "Request time off" }));
    expect(screen.getAllByText(/all weekends or bank holidays/).length).toBeGreaterThan(0);
  });

  it("books time off, reduces the allowance and lists the booking", async () => {
    const user = setup();
    expect(screen.getByText(/of 25 days left/)).toHaveTextContent("14 of 25 days left");

    setDates("2030-01-07", "2030-01-11");
    await user.click(screen.getByRole("button", { name: "Request time off" }));

    expect(screen.getByText(/of 25 days left/)).toHaveTextContent("9 of 25 days left");
    expect(screen.getByRole("button", { name: /Cancel annual leave from .*7 Jan 2030/ })).toBeInTheDocument();
  });

  it("doesn't take medical appointments from the allowance", async () => {
    const user = setup();
    await user.click(screen.getByLabelText("Medical appointment"));
    setDates("2030-01-07", "2030-01-07");
    await user.click(screen.getByRole("button", { name: "Request time off" }));
    expect(screen.getByText(/of 25 days left/)).toHaveTextContent("14 of 25 days left");
  });
});
