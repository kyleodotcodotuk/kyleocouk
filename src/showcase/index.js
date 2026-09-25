// Registry of showcase components shown on /admin/components.
// To add one: create a component in ./examples and add an entry here.
import Buttons from "./examples/Buttons";
import Alerts from "./examples/Alerts";
import ToggleSwitch from "./examples/ToggleSwitch";
import Accordion from "./examples/Accordion";
import Tabs from "./examples/Tabs";
import DataTable from "./examples/DataTable";
import Toasts from "./examples/Toasts";

export const SOURCE_BASE_URL =
  "https://github.com/kyleodotcodotuk/kyleocouk/blob/main/";

const showcase = [
  {
    id: "buttons",
    title: "Buttons",
    icon: "smart_button",
    summary: "Primary, secondary and destructive actions, with loading and icon-only variants.",
    notes: [
      "Icon-only buttons get an aria-label, and their icons are aria-hidden.",
      "The loading label is announced through a polite live region.",
    ],
    source: "src/showcase/examples/Buttons.jsx",
    Component: Buttons,
  },
  {
    id: "alerts",
    title: "Alerts",
    icon: "notifications",
    summary: "Feedback messages for errors, warnings, success and information.",
    notes: [
      'Only the danger alert uses role="alert"; the others use role="status" so they don\'t interrupt.',
      "Colour is never the only signal - each alert has an icon and text.",
    ],
    source: "src/showcase/examples/Alerts.jsx",
    Component: Alerts,
  },
  {
    id: "toggle-switch",
    title: "Toggle Switch",
    icon: "toggle_on",
    summary: "An on/off control built on a native button.",
    notes: [
      'Uses role="switch" with aria-checked, so screen readers announce "on"/"off".',
      "Works with a keyboard out of the box because it's a real <button>.",
      "The visible label is linked with aria-labelledby.",
    ],
    source: "src/showcase/examples/ToggleSwitch.jsx",
    Component: ToggleSwitch,
  },
  {
    id: "accordion",
    title: "Accordion",
    icon: "unfold_more",
    summary: "Expandable sections following the WAI-ARIA accordion pattern.",
    notes: [
      "Each trigger is a button inside a heading, so the headings stay in the document outline.",
      "aria-expanded and aria-controls tie each trigger to its panel.",
      "Collapsed panels use the hidden attribute, so their content can't be tabbed to.",
    ],
    source: "src/showcase/examples/Accordion.jsx",
    Component: Accordion,
  },
  {
    id: "tabs",
    title: "Tabs",
    icon: "tab",
    summary: "A reusable tabs component with automatic activation.",
    notes: [
      "Follows the WAI-ARIA tabs pattern: arrow keys, Home and End move between tabs.",
      "Roving tabindex keeps only the selected tab in the tab order, so Tab goes straight to the panel.",
      "Hidden panels use the hidden attribute, so their content can't be tabbed to.",
    ],
    source: "src/showcase/examples/Tabs.jsx",
    Component: Tabs,
  },
  {
    id: "data-table",
    title: "Data Table",
    icon: "table_chart",
    summary: "A sortable, filterable table of CMS pages.",
    notes: [
      "Sortable headers are real buttons, and aria-sort tells screen readers the current order.",
      "The result count sits in a polite live region and describes the filter input.",
      'The scroll wrapper is a focusable, labelled region, so keyboard users can scroll it on small screens.',
      "Each row's title is a row header (th scope=\"row\"), so cells are announced with context.",
    ],
    source: "src/showcase/examples/DataTable.jsx",
    Component: DataTable,
  },
  {
    id: "toasts",
    title: "Toasts",
    icon: "campaign",
    summary: "App-wide notifications that stack and dismiss themselves.",
    notes: [
      "Toasts render into a live region that's always in the page, so each one is announced.",
      "The auto-dismiss timer pauses on hover and focus, giving people time to read or dismiss.",
      "Any component can raise one through the useToast() hook. Settings uses it when you save.",
    ],
    source: "src/showcase/examples/Toasts.jsx",
    Component: Toasts,
  },
];

export default showcase;
