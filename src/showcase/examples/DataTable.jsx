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
  { id: 13, name: "Ciarán McAllister", jobTitle: "Front-end Developer", location: "Belfast, UK", status: "Active", joined: "2021-02-15" },
  { id: 14, name: "Aoife Donnelly", jobTitle: "Scrum Master", location: "Belfast, UK", status: "Away", joined: "2022-08-01" },
  { id: 15, name: "Declan O'Hare", jobTitle: "Solutions Architect", location: "Derry, UK", status: "Active", joined: "2018-05-21" },
  { id: 16, name: "Niamh Quinn", jobTitle: "Customer Success Manager", location: "Newry, UK", status: "Invited", joined: "2026-09-15" },
  { id: 17, name: "Fraser MacLeod", jobTitle: "DevOps Engineer", location: "Glasgow, UK", status: "Active", joined: "2019-10-07" },
  { id: 18, name: "Kirsty Campbell", jobTitle: "Head of Marketing", location: "Glasgow, UK", status: "Active", joined: "2017-01-09" },
  { id: 19, name: "Callum Fraser", jobTitle: "Back-end Developer", location: "Edinburgh, UK", status: "Away", joined: "2023-04-17" },
  { id: 20, name: "Eilidh Robertson", jobTitle: "Product Designer", location: "Edinburgh, UK", status: "Active", joined: "2020-06-29" },
  { id: 21, name: "Hamish Stewart", jobTitle: "IT Support Analyst", location: "Aberdeen, UK", status: "Active", joined: "2016-11-14" },
  { id: 22, name: "Isla Murray", jobTitle: "Junior Developer", location: "Dundee, UK", status: "Invited", joined: "2026-09-24" },
  { id: 23, name: "Rhys Llewellyn", jobTitle: "Technical Writer", location: "Cardiff, UK", status: "Active", joined: "2021-09-06" },
  { id: 24, name: "Cerys Pritchard", jobTitle: "Delivery Manager", location: "Cardiff, UK", status: "Active", joined: "2019-03-25" },
  { id: 25, name: "Gethin Morgan", jobTitle: "Security Engineer", location: "Swansea, UK", status: "Away", joined: "2022-01-10" },
  { id: 26, name: "Bethan Hughes", jobTitle: "HR Business Partner", location: "Bangor, UK", status: "Active", joined: "2018-07-16" },
  { id: 27, name: "Liam Gallagher", jobTitle: "Sales Director", location: "Manchester, UK", status: "Active", joined: "2015-09-01" },
  { id: 28, name: "Sophie Thompson", jobTitle: "Senior UX Designer", location: "Manchester, UK", status: "Active", joined: "2020-02-03" },
  { id: 29, name: "Ryan Walsh", jobTitle: "Mobile Developer", location: "Salford, UK", status: "Away", joined: "2023-06-12" },
  { id: 30, name: "Jessica Clarke", jobTitle: "Finance Manager", location: "Liverpool, UK", status: "Active", joined: "2017-04-24" },
  { id: 31, name: "Daniel Doyle", jobTitle: "Support Engineer", location: "Liverpool, UK", status: "Active", joined: "2024-01-08" },
  { id: 32, name: "Megan Armstrong", jobTitle: "Content Strategist", location: "Newcastle upon Tyne, UK", status: "Active", joined: "2021-11-22" },
  { id: 33, name: "Craig Robson", jobTitle: "Data Engineer", location: "Sunderland, UK", status: "Invited", joined: "2026-09-19" },
  { id: 34, name: "Hannah Whitaker", jobTitle: "Business Analyst", location: "Leeds, UK", status: "Active", joined: "2019-08-19" },
  { id: 35, name: "Thomas Barraclough", jobTitle: "Platform Engineer", location: "Sheffield, UK", status: "Away", joined: "2022-10-03" },
  { id: 36, name: "Emily Sutcliffe", jobTitle: "Office Manager", location: "Bradford, UK", status: "Active", joined: "2016-03-14" },
  { id: 37, name: "James Holloway", jobTitle: "Engineering Director", location: "London, UK", status: "Active", joined: "2014-06-02" },
  { id: 38, name: "Charlotte Pembroke-Hayes", jobTitle: "Legal Counsel", location: "London, UK", status: "Active", joined: "2020-09-14" },
  { id: 39, name: "Oliver Bennett", jobTitle: "Graduate Developer", location: "London, UK", status: "Invited", joined: "2026-09-27" },
  { id: 40, name: "Amelia Hartley", jobTitle: "Accessibility Specialist", location: "Brighton, UK", status: "Active", joined: "2021-05-10" },
  { id: 41, name: "George Fairweather", jobTitle: "Infrastructure Lead", location: "Bristol, UK", status: "Active", joined: "2018-02-26" },
  { id: 42, name: "Lucy Trelawney", jobTitle: "Community Manager", location: "Truro, UK", status: "Away", joined: "2023-08-21" },
  { id: 43, name: "Harry Penhaligon", jobTitle: "QA Engineer", location: "Plymouth, UK", status: "Active", joined: "2022-03-07" },
  { id: 44, name: "Grace Ashworth", jobTitle: "Recruitment Partner", location: "Birmingham, UK", status: "Active", joined: "2019-12-02" },
  { id: 45, name: "Matthew Kettle", jobTitle: "Full-stack Developer", location: "Birmingham, UK", status: "Active", joined: "2020-10-19" },
  { id: 46, name: "Chloe Fletcher", jobTitle: "Marketing Executive", location: "Nottingham, UK", status: "Away", joined: "2024-04-15" },
  { id: 47, name: "Samuel Lockwood", jobTitle: "Release Manager", location: "Leicester, UK", status: "Active", joined: "2017-08-07" },
  { id: 48, name: "Ella Winterbottom", jobTitle: "Service Designer", location: "Norwich, UK", status: "Active", joined: "2021-01-25" },
  { id: 49, name: "Jack Cartwright", jobTitle: "Site Reliability Engineer", location: "Cambridge, UK", status: "Active", joined: "2018-10-29" },
  { id: 50, name: "Freya Aldridge", jobTitle: "Research Operations Lead", location: "Oxford, UK", status: "Invited", joined: "2026-09-10" },
  { id: 51, name: "Patrick Kavanagh", jobTitle: "Account Manager", location: "Armagh, UK", status: "Active", joined: "2023-11-13" },
  { id: 52, name: "Moira Sinclair", jobTitle: "Operations Manager", location: "Inverness, UK", status: "Active", joined: "2016-07-04" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "jobTitle", label: "Job title" },
  { key: "location", label: "Location" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
];

const PAGE_SIZE = 10;

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
  const [page, setPage] = useState(1);
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

  const pageCount = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pageRows = visibleRows.slice(firstIndex, firstIndex + PAGE_SIZE);

  // Filtering or sorting changes what page 1 holds, so start from the top again
  const toggleSort = (key) => {
    setPage(1);
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
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          aria-describedby={`${id}-count`}
        />
      </div>

      <p id={`${id}-count`} className="sc-table__count" aria-live="polite">
        {visibleRows.length > PAGE_SIZE
          ? `Showing ${firstIndex + 1}–${firstIndex + pageRows.length} of ${visibleRows.length} people`
          : `Showing ${visibleRows.length} of ${rows.length} people`}
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
            {pageRows.map((row) => (
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

      {pageCount > 1 && (
        <nav className="sc-pagination" aria-label="Team directory pages">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="material-icons" aria-hidden="true">chevron_left</span>
            Previous
          </button>
          <ul>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <li key={number}>
                <button
                  type="button"
                  onClick={() => setPage(number)}
                  aria-current={number === currentPage ? "page" : undefined}
                >
                  <span className="visually-hidden">Page </span>
                  {number}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            Next
            <span className="material-icons" aria-hidden="true">chevron_right</span>
          </button>
        </nav>
      )}
    </div>
  );
}
