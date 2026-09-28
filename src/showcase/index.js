// Registry of showcase components shown on /admin/components.
// To add one: create a component in ./examples and add an entry here.
import Buttons from "./examples/Buttons";
import Alerts from "./examples/Alerts";
import ToggleSwitch from "./examples/ToggleSwitch";
import Accordion from "./examples/Accordion";
import Tabs from "./examples/Tabs";
import DataTable from "./examples/DataTable";
import Toasts from "./examples/Toasts";
import TimeOff from "./examples/TimeOff";
import CurrencyConverter from "./examples/CurrencyConverter";

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
    summary: "A sortable, filterable team directory, stress-tested with awkward real-world data.",
    notes: [
      "Test data covers long and accented names, Greek, Chinese and right-to-left Arabic, long titles and a missing value.",
      "Filtering ignores accents (\"zoe\" finds \"Zoë\") and sorting uses Intl.Collator, so Å sorts with A rather than after Z.",
      "Names are wrapped in <bdi> so right-to-left text can't reorder what's around it.",
      "Sortable headers are real buttons, and aria-sort tells screen readers the current order.",
      "The result count sits in a polite live region and describes the filter input.",
      'The scroll wrapper is a focusable, labelled region, so keyboard users can scroll it on small screens.',
      "Each person's name is a row header (th scope=\"row\"), so cells are announced with context.",
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
  {
    id: "time-off",
    title: "Time Off Booking",
    icon: "beach_access",
    summary: "An intranet leave widget: allowance, date range, validation and upcoming bookings.",
    notes: [
      "Native date inputs give everyone their platform's own accessible picker, rather than a custom calendar.",
      "Working days skip weekends and bank holidays, and the count updates in a polite live region.",
      "On submit, focus moves to an error summary whose links jump to each field (the GOV.UK pattern).",
      "Each error is tied to its field with aria-describedby and aria-invalid, and starts with a hidden \"Error:\".",
      "The allowance is a native <meter>, with aria-valuetext so it's read as days left, not a percentage.",
      "Cancelling moves focus to the list heading, because the button that had focus no longer exists.",
    ],
    source: "src/showcase/examples/TimeOff.jsx",
    Component: TimeOff,
  },
  {
    id: "currency-converter",
    title: "Currency Converter",
    icon: "currency_exchange",
    summary: "Converts as you type, formatting each currency the way it's written at home.",
    notes: [
      "Intl.NumberFormat handles symbols, separators and decimals: 1.234,56 € in German, ¥ with no decimals, 3 for the dinar.",
      "The amount is a text input with inputmode=\"decimal\": type=\"number\" rejects commas and changes on scroll.",
      "The result updates on every keystroke but is only announced once typing pauses, so it isn't noisy.",
      "The icon-only swap button has an aria-label, and focus stays on it after swapping.",
    ],
    source: "src/showcase/examples/CurrencyConverter.jsx",
    Component: CurrencyConverter,
  },
];

export default showcase;
