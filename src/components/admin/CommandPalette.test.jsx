import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import CommandPalette from "./CommandPalette";

const CurrentPath = () => <p data-testid="path">{useLocation().pathname}</p>;

const setup = () => {
  const onLogout = jest.fn();
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <CommandPalette onLogout={onLogout} />
      <Routes>
        <Route path="*" element={<CurrentPath />} />
      </Routes>
    </MemoryRouter>
  );
  return { user: userEvent.setup(), onLogout };
};

const combobox = () => screen.getByRole("combobox", { name: "Search pages, components and actions", hidden: true });
const activeOption = () => document.getElementById(combobox().getAttribute("aria-activedescendant"));

describe("Command palette", () => {
  it("opens with Ctrl+K", async () => {
    const { user } = setup();
    // jsdom 16 can't compute a <dialog>'s accessible name, so find it directly
    const dialog = document.querySelector("dialog.command-palette");
    expect(dialog).toHaveAttribute("aria-label", "Command palette");
    expect(dialog.open).toBeFalsy();
    await user.keyboard("{Control>}k{/Control}");
    expect(dialog.open).toBe(true);
  });

  it("filters results and announces the count", async () => {
    const { user } = setup();
    await user.type(combobox(), "settings");
    expect(screen.getAllByRole("option", { hidden: true })).toHaveLength(1);
    expect(screen.getByText("1 result")).toBeInTheDocument();
  });

  it("moves the highlight with the arrow keys, keeping focus in the input", async () => {
    const { user } = setup();
    await user.click(combobox());
    expect(activeOption()).toHaveTextContent("Dashboard");

    await user.keyboard("{ArrowDown}");
    expect(activeOption()).toHaveAttribute("aria-selected", "true");
    expect(activeOption()).not.toHaveTextContent("Dashboard");
    expect(combobox()).toHaveFocus();

    // Wraps from the first option to the last
    await user.keyboard("{ArrowUp}{ArrowUp}");
    expect(activeOption()).toHaveTextContent("Log out");
  });

  it("runs the highlighted command on Enter", async () => {
    const { user } = setup();
    await user.type(combobox(), "media{Enter}");
    expect(screen.getByTestId("path")).toHaveTextContent("/admin/media");
  });

  it("shows an empty state when nothing matches", async () => {
    const { user } = setup();
    await user.type(combobox(), "zzzz");
    expect(screen.getByText('No results for "zzzz"')).toBeInTheDocument();
  });
});
