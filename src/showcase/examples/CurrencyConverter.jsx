import React, { useEffect, useId, useState } from "react";

// Sample rates against GBP, for demo purposes only. Each currency is shown
// in its home locale, so the separators and symbol placement change with it.
const CURRENCIES = {
  GBP: { name: "British pound", locale: "en-GB", rate: 1 },
  EUR: { name: "Euro", locale: "de-DE", rate: 1.1742 },
  USD: { name: "US dollar", locale: "en-US", rate: 1.3386 },
  JPY: { name: "Japanese yen", locale: "ja-JP", rate: 198.61 },
  INR: { name: "Indian rupee", locale: "en-IN", rate: 118.47 },
  CHF: { name: "Swiss franc", locale: "de-CH", rate: 1.0719 },
  AED: { name: "UAE dirham", locale: "ar-AE", rate: 4.9163 },
  BHD: { name: "Bahraini dinar", locale: "en-BH", rate: 0.5047 },
};

const RATES_DATE = "2026-09-28";

const format = (amount, code) =>
  new Intl.NumberFormat(CURRENCIES[code].locale, { style: "currency", currency: code }).format(amount);

const formatRate = (value) => new Intl.NumberFormat("en-GB", { maximumSignificantDigits: 5 }).format(value);

// Accepts "1,234.56", "1 234.56" and "£1234" - the common ways people paste amounts
const parseAmount = (text) => {
  const cleaned = text.replace(/[\s,£$€¥₹]/g, "");
  if (cleaned === "") return { value: null };
  if (!/^\d*\.?\d+$|^\d+\.$/.test(cleaned)) return { error: "Enter an amount using numbers, like 1250 or 1,250.50" };
  return { value: Number(cleaned) };
};

// Waits until typing pauses, so screen readers aren't sent every keystroke
const useDebounced = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

export default function CurrencyConverterDemo() {
  const id = useId();
  const [amount, setAmount] = useState("1,250");
  const [from, setFrom] = useState("GBP");
  const [to, setTo] = useState("EUR");

  const { value, error } = parseAmount(amount);
  const rate = CURRENCIES[to].rate / CURRENCIES[from].rate;
  const result = value == null || error ? "" : `${format(value, from)} = ${format(value * rate, to)}`;
  const announcement = useDebounced(result, 800);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const currencySelect = (label, selected, onChange, name) => (
    <div className="form-group">
      <label htmlFor={`${id}-${name}`}>{label}</label>
      <select id={`${id}-${name}`} value={selected} onChange={(e) => onChange(e.target.value)}>
        {Object.entries(CURRENCIES).map(([code, { name: currencyName }]) => (
          <option key={code} value={code}>
            {code} - {currencyName}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="sc-converter">
      <div className={`form-group${error ? " has-error" : ""}`}>
        <label htmlFor={`${id}-amount`}>Amount</label>
        {error && (
          <p id={`${id}-amount-error`} className="sc-field-error">
            <span className="visually-hidden">Error: </span>
            {error}
          </p>
        )}
        {/* Text with a decimal keypad, not type="number": that rejects commas and changes on scroll */}
        <input
          id={`${id}-amount`}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-amount-error` : undefined}
        />
      </div>

      <div className="sc-converter__currencies">
        {currencySelect("From", from, setFrom, "from")}
        <button type="button" className="btn btn-secondary sc-icon-btn sc-converter__swap" onClick={swap} aria-label="Swap currencies">
          <span className="material-icons" aria-hidden="true">swap_horiz</span>
        </button>
        {currencySelect("To", to, setTo, "to")}
      </div>

      <div className="sc-converter__result">
        {/* <output> is a live region by default; it's switched off here so it doesn't
            speak every keystroke. The debounced region below announces instead. */}
        <output htmlFor={`${id}-amount ${id}-from ${id}-to`} className="sc-converter__total" aria-live="off">
          {value != null && !error ? format(value * rate, to) : "—"}
        </output>
        <p className="sc-converter__rate">
          1 {from} = {formatRate(rate)} {to} &middot; 1 {to} = {formatRate(1 / rate)} {from}
        </p>
        <p className="sc-converter__source">
          Sample rates from <time dateTime={RATES_DATE}>28 Sep 2026</time>, for illustration only.
        </p>
      </div>

      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
