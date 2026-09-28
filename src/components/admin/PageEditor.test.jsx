import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";
import { PagesProvider } from "../../contexts/PagesContext";
import { ToastProvider } from "../../contexts/ToastContext";
import defaultPages from "../../data/pages";
import PageEditor from "./PageEditor";
import PagesList from "./PagesList";

const setup = (path) => {
  render(
    <AuthProvider>
      <PagesProvider initialPages={defaultPages}>
        <ToastProvider>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/admin/pages" element={<PagesList />} />
              <Route path="/admin/pages/:pageId" element={<PageEditor />} />
            </Routes>
          </MemoryRouter>
        </ToastProvider>
      </PagesProvider>
    </AuthProvider>
  );
  return userEvent.setup();
};

describe("Page editor", () => {
  it("sets the tab title and breadcrumbs", () => {
    setup("/admin/pages/about");
    expect(document.title).toBe("About me · Grey Cat CMS");
    const breadcrumb = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(breadcrumb).toHaveTextContent("DashboardPagesAbout me");
    expect(screen.getByText("About me", { selector: "[aria-current='page']" })).toBeInTheDocument();
  });

  it("flags unsaved changes, and clears the flag on save", async () => {
    const user = setup("/admin/pages/about");
    expect(screen.queryByText("Unsaved changes")).not.toBeInTheDocument();

    await user.type(screen.getByLabelText("Title"), " and more");
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save changes" }));
    expect(screen.queryByText("Unsaved changes")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent('Edit "About me and more"');
  });

  it("puts back the saved version on discard", async () => {
    const user = setup("/admin/pages/about");
    const title = screen.getByLabelText("Title");
    await user.clear(title);
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(title).toHaveValue("About me");
    expect(title).toHaveFocus();
  });

  it("won't save a slug another page uses", async () => {
    const user = setup("/admin/pages/about");
    const slug = screen.getByLabelText("URL slug");
    await user.clear(slug);
    await user.type(slug, "accessibility");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(slug).toHaveAttribute("aria-invalid", "true");
    const summary = screen.getByRole("heading", { name: "There's a problem" }).parentElement;
    await waitFor(() => expect(summary).toHaveFocus());
    expect(summary).toHaveTextContent("Another page already uses /accessibility");
  });

  it("fills the slug from the title for new pages", async () => {
    const user = setup("/admin/pages/new");
    await user.type(screen.getByLabelText("Title"), "Café Opening Times");
    expect(screen.getByLabelText("URL slug")).toHaveValue("cafe-opening-times");
  });

  it("shows a not found state for an unknown page", () => {
    setup("/admin/pages/nope");
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});

describe("Pages list", () => {
  it("filters by status and offers to clear filters when nothing matches", async () => {
    const user = setup("/admin/pages");
    expect(screen.getByText("Showing 5 of 5 pages")).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("Status"), "Published");
    expect(screen.getByText("Showing 2 of 5 pages")).toBeInTheDocument();

    await user.type(screen.getByLabelText("Search pages"), "zzzz");
    await user.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Showing 5 of 5 pages")).toBeInTheDocument();
    expect(screen.getByLabelText("Search pages")).toHaveFocus();
  });
});
