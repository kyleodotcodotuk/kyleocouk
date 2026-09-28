import React, { useId, useState } from "react";
import AdminLayout from "./AdminLayout";
import AdminLink from "./AdminLink";
import { usePages } from "../../contexts/PagesContext";
import { useToast } from "../../contexts/ToastContext";
import { PAGE_STATUSES, formatPageDate } from "../../utils/pages";

const columns = [
  { key: "title", label: "Title" },
  { key: "slug", label: "URL" },
  { key: "status", label: "Status" },
  { key: "author", label: "Author" },
  { key: "updated", label: "Last updated" },
];

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

export default function PagesList() {
  const { pages, resetPages } = usePages();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState({ key: "updated", direction: "descending" });
  const id = useId();

  const search = query.trim().toLowerCase();
  const visiblePages = pages
    .filter((page) => !status || page.status === status)
    .filter((page) => `${page.title} /${page.slug} ${page.author}`.toLowerCase().includes(search))
    .sort((a, b) => {
      const result = collator.compare(a[sort.key], b[sort.key]);
      return sort.direction === "ascending" ? result : -result;
    });

  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const handleReset = () => {
    if (!window.confirm("Reset all pages to the demo content? Your edits will be lost.")) return;
    resetPages();
    showToast({ type: "info", message: "Pages reset to the demo content." });
  };

  const isFiltered = Boolean(search || status);

  return (
    <AdminLayout title="Pages">
      <div className="dashboard">
        <section className="widget">
          <div className="page-header">
            <h1 className="widget-heading">
              Pages <span className="material-icons" aria-hidden="true">article</span>
            </h1>
            <div className="page-header__actions">
              <AdminLink to="/admin/pages/new" className="btn btn-primary">
                <span className="material-icons" aria-hidden="true">add</span>
                New page
              </AdminLink>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                <span className="material-icons" aria-hidden="true">restart_alt</span>
                Reset demo pages
              </button>
            </div>
          </div>
          <hr />

          {pages.length === 0 ? (
            <div className="empty-state">
              <span className="material-icons" aria-hidden="true">note_add</span>
              <h2>No pages yet</h2>
              <p>Pages you create will appear here.</p>
              <AdminLink to="/admin/pages/new" className="btn btn-primary">
                Create your first page
              </AdminLink>
            </div>
          ) : (
            <div className="sc-table">
              <div className="pages-filters">
                <div className="form-group">
                  <label htmlFor={`${id}-search`}>Search pages</label>
                  <input
                    id={`${id}-search`}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-describedby={`${id}-count`}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor={`${id}-status`}>Status</label>
                  <select id={`${id}-status`} value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">All statuses</option>
                    {PAGE_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p id={`${id}-count`} className="sc-table__count" aria-live="polite">
                Showing {visiblePages.length} of {pages.length} pages
              </p>

              <div className="sc-table__scroll" role="region" aria-labelledby={`${id}-caption`} tabIndex={0}>
                <table>
                  <caption id={`${id}-caption`} className="visually-hidden">
                    Pages
                  </caption>
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
                    {visiblePages.map((page) => (
                      <tr key={page.id}>
                        <th scope="row">
                          <AdminLink to={`/admin/pages/${page.id}`}>
                            {page.title}
                            <span className="visually-hidden"> (edit)</span>
                          </AdminLink>
                        </th>
                        <td>
                          <code>/{page.slug}</code>
                        </td>
                        <td>
                          <span className={`sc-status sc-status--${page.status.toLowerCase().replace(" ", "-")}`}>
                            {page.status}
                          </span>
                        </td>
                        <td>{page.author}</td>
                        <td>
                          <time dateTime={page.updated}>{formatPageDate(page.updated)}</time>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {visiblePages.length === 0 && isFiltered && (
                <div className="empty-state empty-state--compact">
                  <p>No pages match your filters.</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setQuery("");
                      setStatus("");
                      // This button disappears once the filters clear, so move focus back to search
                      document.getElementById(`${id}-search`)?.focus();
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}
