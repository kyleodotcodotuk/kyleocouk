import React, { useId, useState } from "react";

// Deliberately awkward data: long and accented names, non-Latin and
// right-to-left scripts, long titles, and a missing value
const rows = [
  { id: 1, name: "Maria del Carmen Fernández-Villaverde de la Cruz", jobTitle: "Principal Accessibility & Inclusive Design Systems Engineer", location: "Santiago de Compostela, Spain", status: "Active", joined: "2019-03-11" },
  { id: 2, name: "Bo Li", jobTitle: "CTO", location: "Shenzhen, China", status: "Active", joined: "2016-01-04" },
  { id: 3, name: "Nguyễn Thị Minh Khai", jobTitle: "Senior Front-end Developer", location: "Ho Chi Minh City, Vietnam", status: "Away", joined: "2021-07-19" },
  { id: 4, name: "Oluwaseun Adebayo-Okonkwo", jobTitle: "Head of Customer Experience, EMEA", location: "Lagos, Nigeria", status: "Active", joined: "2020-11-02" },
  { id: 5, name: "Sigríður Þórhallsdóttir", jobTitle: "UX Researcher", location: "Reykjavík, Iceland", status: "Invited", joined: "2026-09-22" },
  { id: 6, name: "محمد عبد الله الشمري", jobTitle: "Product Manager", location: "Riyadh, Saudi Arabia", status: "Active", joined: "2022-05-30" },
  { id: 7, name: "Zoë Ångström-Øberg", jobTitle: "Interim Associate Vice President of Internal Communications and Employee Engagement", location: "Malmö, Sweden", status: "Away", joined: "2018-09-14" },
  { id: 8, name: "Χριστίνα Παπαδοπούλου", jobTitle: "Content Designer", location: "Thessaloniki, Greece", status: "Active", joined: "2023-02-06" },
  { id: 9, name: "Jean-Baptiste Lefèvre-Dubois", jobTitle: "Développeur Full-stack", location: "", status: "Invited", joined: "2026-09-26" },
  { id: 10, name: "Siobhán Ní Mhaolagáin", jobTitle: "Engineering Manager", location: "Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch, Wales, UK", status: "Active", joined: "2017-06-26" },
  { id: 11, name: "王秀英", jobTitle: "Data Analyst", location: "Taipei, Taiwan", status: "Away", joined: "2024-10-01" },
  { id: 12, name: "Krzysztof Brzęczyszczykiewicz", jobTitle: "QA Automation Lead", location: "Kraków, Poland", status: "Active", joined: "2015-04-20" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "jobTitle", label: "Job title" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// Sorts accented letters next to their base letter (Å with A) and numbers naturally
const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

// Lower-cased with accents stripped, so "zoe" finds "Zoë"
const normalise = (value) =>
  value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export default function DataTableDemo() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "name", direction: "ascending" });
  const id = useId();

  const search = normalise(query.trim());
  const visibleRows = rows
    .filter((row) =>
      columns.some(({ key }) => normalise(row[key]).includes(search))
    )
    .sort((a, b) => {
      // Empty values always sit at the bottom, whichever way it's sorted
      if (!a[sort.key] || !b[sort.key]) return !a[sort.key] - !b[sort.key];
      // ISO dates sort correctly as strings, so one comparison covers every column
      const result = collator.compare(a[sort.key], b[sort.key]);
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
        <label htmlFor={`${id}-filter`}>Filter people</label>
        <input
          id={`${id}-filter`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby={`${id}-count`}
        />
      </div>

      <p id={`${id}-count`} className="sc-table__count" aria-live="polite">
        Showing {visibleRows.length} of {rows.length} people
      </p>

      {/* A focusable, labelled region lets keyboard users scroll the table sideways */}
      <div className="sc-table__scroll" role="region" aria-labelledby={`${id}-caption`} tabIndex={0}>
        <table>
          <caption id={`${id}-caption`}>Team directory</caption>
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
              <tr key={row.id}>
                {/* bdi keeps right-to-left names from reordering the text around them */}
                <th scope="row">
                  <bdi>{row.name}</bdi>
                </th>
                <td>{row.jobTitle}</td>
                <td>
                  {row.location || (
                    <>
                      <span aria-hidden="true">&mdash;</span>
                      <span className="visually-hidden">Not set</span>
                    </>
                  )}
                </td>
                <td>
                  <span className={`sc-status sc-status--${row.status.toLowerCase()}`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <time dateTime={row.joined}>{formatDate(row.joined)}</time>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleRows.length === 0 && <p>No people match "{query}".</p>}
    </div>
  );
}
