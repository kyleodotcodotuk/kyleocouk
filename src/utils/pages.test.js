import { slugify, validatePage } from "./pages";

const page = (overrides) => ({ id: "x", title: "About", slug: "about", status: "Draft", summary: "", body: "", ...overrides });

describe("slugify", () => {
  it.each([
    ["Café & Bar: Opening Times!", "cafe-and-bar-opening-times"],
    ["  Zoë Ångström  ", "zoe-angstrom"],
    ["Release notes -- 2026", "release-notes-2026"],
    ["!!!", ""],
  ])("turns %p into %p", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("validatePage", () => {
  it("accepts a valid page", () => {
    expect(validatePage(page(), [])).toEqual({});
  });

  it("allows / for sections", () => {
    expect(validatePage(page({ slug: "guides/getting-started" }), [])).toEqual({});
  });

  it("requires a title and slug", () => {
    const errors = validatePage(page({ title: "  ", slug: "" }), []);
    expect(errors.title).toBe("Enter a title");
    expect(errors.slug).toBe("Enter a URL slug");
  });

  it.each(["About Us", "about_us", "-about", "about--us", "about/"])("rejects the badly formatted slug %p", (slug) => {
    expect(validatePage(page({ slug }), []).slug).toMatch(/lower-case letters/);
  });

  it("rejects a slug another page already uses", () => {
    const errors = validatePage(page({ id: "new" }), [page({ id: "existing" })]);
    expect(errors.slug).toBe("Another page already uses /about");
  });

  it("doesn't count the page's own slug as a clash", () => {
    expect(validatePage(page(), [page()])).toEqual({});
  });

  it("lets the homepage have an empty slug", () => {
    expect(validatePage(page({ id: "home", slug: "" }), [])).toEqual({});
  });

  it("limits the summary to 160 characters", () => {
    expect(validatePage(page({ summary: "a".repeat(161) }), []).summary).toMatch(/160 characters or fewer/);
  });
});
