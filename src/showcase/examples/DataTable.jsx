import React, { useId, useState } from "react";

const rows = [
  { title: "Homepage", author: "Kyle O'Connor", status: "Published", updated: "2026-09-24" },
  { title: "About me", author: "Kyle O'Connor", status: "Draft", updated: "2026-09-18" },
  { title: "Accessibility statement", author: "Sam Taylor", status: "Published", updated: "2026-08-30" },
  { title: "Component guidelines", author: "Alex Morgan", status: "In review", updated: "2026-09-21" },
  { title: "Contact", author: "Sam Taylor", status: "Published", updated: "2026-07-12" },
  { title: "Release notes", author: "Alex Morgan", status: "Draft", updated: "2026-09-25" },
];

const columns = [
  { key: "title", label: "Title" },
  { key: "author", label: "Author" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Last updated" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function DataTableDemo() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "updated", direction: "descending" });
  const id = useId();

  const search = query.trim().toLowerCase();
  const visibleRows = rows
    .filter((row) => Object.values(row).some((value) => value.toLowerCase().includes(search)))
    .sort((a, b) => {
      // ISO dates sort correctly as strings, so one comparison covers every column
      const result = a[sort.key].localeCompare(b[sort.key]);
      return sort.direction === "ascending" ? result : -result;
    });

  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  return (
    <div className="sc-table">
      <div className="form-group sc-table__filter">
        <label htmlFor={`${id}-filter`}>Filter pages</label>
        <input
          id={`${id}-filter`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby={`${id}-count`}
        />
      </div>

      <p id={`${id}-count`} className="sc-table__count" aria-live="polite">
        Showing {visibleRows.length} of {rows.length} pages
      </p>

      {/* A focusable, labelled region lets keyboard users scroll the table sideways */}
      <div className="sc-table__scroll" role="region" aria-labelledby={`${id}-caption`} tabIndex={0}>
        <table>
          <caption id={`${id}-caption`}>CMS pages</caption>
          <thead>
            <tr>
              {columns.map((column) => {
                const isSorted = sort.key === column.key;
                return (
                  <th key={column.key} scope="col" aria-sort={isSorted ? sort.direction : undefined}>
                    <button type="button" onClick={() => toggleSort(column.key)}>
                      {column.label}
                      <span className="material-icons" aria-hidden="true">
                        {!isSorted ? "unfold_more" : sort.direction === "ascending" ? "expand_less" : "expand_more"}
                      </span>
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.title}>
                <th scope="row">{row.title}</th>
                <td>{row.author}</td>
                <td>
                  <span className={`sc-status sc-status--${row.status.toLowerCase().replace(" ", "-")}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <time dateTime={row.updated}>{formatDate(row.updated)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleRows.length === 0 && <p>No pages match "{query}".</p>}
    </div>
  );
}
