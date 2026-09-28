import React, { useId, useRef, useState } from "react";
import { useToast } from "../../contexts/ToastContext";

const ALLOWANCE = 25;
const DAYS_TAKEN = 6; // Already used earlier in the leave year

// England & Wales bank holidays; these don't count against the allowance
const BANK_HOLIDAYS = {
  "2026-12-25": "Christmas Day",
  "2026-12-28": "Boxing Day (substitute day)",
  "2027-01-01": "New Year's Day",
  "2027-03-26": "Good Friday",
  "2027-03-29": "Easter Monday",
};

const LEAVE_TYPES = ["Annual leave", "Medical appointment", "Unpaid leave"];

// Only annual leave comes out of the allowance
const usesAllowance = (type) => type === "Annual leave";

// Dates are handled as UTC midnight so clock changes can't shift a day
const toDate = (iso) => new Date(`${iso}T00:00:00Z`);
const toIso = (date) => date.toISOString().slice(0, 10);

const todayIso = () => {
  const now = new Date();
  return toIso(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
};

const workingDaysBetween = (startIso, endIso) => {
  const days = [];
  for (let d = toDate(startIso); d <= toDate(endIso); d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = toIso(d);
    const weekday = d.getUTCDay();
    if (weekday !== 0 && weekday !== 6 && !BANK_HOLIDAYS[iso]) days.push(iso);
  }
  return days;
};

const holidaysBetween = (startIso, endIso) =>
  Object.entries(BANK_HOLIDAYS).filter(([iso]) => iso >= startIso && iso <= endIso);

const formatDate = (iso) =>
  toDate(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;

const initialBookings = [
  { id: 1, type: "Annual leave", start: "2026-10-19", end: "2026-10-23", days: 5 },
];

const emptyForm = { type: LEAVE_TYPES[0], start: "", end: "", note: "" };

export default function TimeOffDemo() {
  const id = useId();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState(initialBookings);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const summaryRef = useRef(null);
  const listHeadingRef = useRef(null);

  const booked = bookings.filter((b) => usesAllowance(b.type)).reduce((sum, b) => sum + b.days, 0);
  const remaining = ALLOWANCE - DAYS_TAKEN - booked;

  const hasRange = form.start && form.end && form.end >= form.start;
  const requestedDays = hasRange ? workingDaysBetween(form.start, form.end).length : 0;
  const skippedHolidays = hasRange ? holidaysBetween(form.start, form.end) : [];

  const fieldId = (name) => `${id}-${name}`;

  const update = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as it's edited, so stale messages don't linger
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  const validate = () => {
    const next = {};
    if (!form.start) next.start = "Enter the first day of your time off";
    else if (form.start < todayIso()) next.start = "The first day can't be in the past";

    if (!form.end) next.end = "Enter the last day of your time off";
    else if (form.start && form.end < form.start) next.end = "The last day must be the same as or after the first day";

    if (!next.start && !next.end) {
      const overlap = bookings.find((b) => form.start <= b.end && form.end >= b.start);
      if (requestedDays === 0) {
        next.end = "Those dates are all weekends or bank holidays, so there's nothing to book";
      } else if (overlap) {
        next.start = `You already have time off from ${formatDate(overlap.start)} to ${formatDate(overlap.end)}`;
      } else if (usesAllowance(form.type) && requestedDays > remaining) {
        next.end = `That's ${plural(requestedDays, "working day")}, but you only have ${plural(remaining, "day")} left`;
      }
    }
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);

    if (Object.keys(next).length) {
      // Move focus to the summary so screen reader users hear what went wrong
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setBookings((prev) =>
      [...prev, { id: Date.now(), type: form.type, start: form.start, end: form.end, days: requestedDays }].sort((a, b) =>
        a.start.localeCompare(b.start)
      )
    );
    setForm(emptyForm);
    showToast({ type: "success", message: `${form.type} booked: ${plural(requestedDays, "working day")}.` });
  };

  const cancelBooking = (booking) => {
    setBookings((prev) => prev.filter((b) => b.id !== booking.id));
    showToast({ type: "info", message: `Cancelled ${booking.type.toLowerCase()} from ${formatDate(booking.start)}.` });
    // The button that had focus has gone, so put focus somewhere sensible
    listHeadingRef.current?.focus();
  };

  const errorList = Object.entries(errors);
  const describedBy = (name, ...extra) =>
    [errors[name] && `${fieldId(name)}-error`, ...extra].filter(Boolean).join(" ") || undefined;

  return (
    <div className="sc-timeoff">
      <section className="sc-timeoff__allowance" aria-labelledby={`${id}-allowance`}>
        <h3 id={`${id}-allowance`}>Your allowance</h3>
        <p className="sc-timeoff__remaining">
          <strong>{remaining}</strong> of {ALLOWANCE} days left
        </p>
        <meter
          min={0}
          max={ALLOWANCE}
          low={5}
          optimum={ALLOWANCE}
          value={remaining}
          aria-labelledby={`${id}-allowance`}
          aria-valuetext={`${remaining} of ${ALLOWANCE} days left`}
        />
        <p className="sc-timeoff__breakdown">
          {plural(DAYS_TAKEN, "day")} taken &middot; {plural(booked, "day")} booked
        </p>
      </section>

      <form className="sc-timeoff__form" onSubmit={handleSubmit} noValidate>
        {errorList.length > 0 && (
          <div className="sc-error-summary" tabIndex={-1} ref={summaryRef} aria-labelledby={`${id}-summary`}>
            <h3 id={`${id}-summary`}>There's a problem</h3>
            <ul>
              {errorList.map(([name, message]) => (
                <li key={name}>
                  <a
                    href={`#${fieldId(name)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(fieldId(name))?.focus();
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="sc-timeoff__types">
          <legend>Type of leave</legend>
          {LEAVE_TYPES.map((type) => (
            <label key={type} className="sc-radio">
              <input
                type="radio"
                name={`${id}-type`}
                value={type}
                checked={form.type === type}
                onChange={() => update("type", type)}
              />
              {type}
            </label>
          ))}
        </fieldset>

        <div className="sc-timeoff__dates">
          {[
            ["start", "First day"],
            ["end", "Last day"],
          ].map(([name, label]) => (
            <div key={name} className={`form-group${errors[name] ? " has-error" : ""}`}>
              <label htmlFor={fieldId(name)}>{label}</label>
              {errors[name] && (
                <p id={`${fieldId(name)}-error`} className="sc-field-error">
                  <span className="visually-hidden">Error: </span>
                  {errors[name]}
                </p>
              )}
              {/* Native date inputs give every user their platform's own accessible picker */}
              <input
                id={fieldId(name)}
                type="date"
                min={name === "end" && form.start ? form.start : todayIso()}
                value={form[name]}
                onChange={(e) => update(name, e.target.value)}
                aria-invalid={errors[name] ? true : undefined}
                aria-describedby={describedBy(name, name === "end" && `${id}-days`)}
              />
            </div>
          ))}
        </div>

        <p id={`${id}-days`} className="sc-timeoff__days" aria-live="polite">
          {hasRange && (
            <>
              That's <strong>{plural(requestedDays, "working day")}</strong>
              {usesAllowance(form.type) ? " from your allowance" : ", not taken from your allowance"}.
              {skippedHolidays.length > 0 &&
                ` Bank holidays aren't counted: ${skippedHolidays.map(([, name]) => name).join(", ")}.`}
            </>
          )}
        </p>

        <div className="form-group">
          <label htmlFor={fieldId("note")}>
            Note for your manager <span className="sc-optional">(optional)</span>
          </label>
          <textarea
            id={fieldId("note")}
            rows={2}
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Request time off
        </button>
      </form>

      <section aria-labelledby={`${id}-upcoming`}>
        <h3 id={`${id}-upcoming`} tabIndex={-1} ref={listHeadingRef}>
          Upcoming time off
        </h3>
        {bookings.length === 0 ? (
          <p>You haven't booked any time off yet.</p>
        ) : (
          <ul className="sc-timeoff__list">
            {bookings.map((booking) => (
              <li key={booking.id}>
                <div>
                  <strong>{booking.type}</strong>
                  <br />
                  <time dateTime={booking.start}>{formatDate(booking.start)}</time>
                  {booking.end !== booking.start && (
                    <>
                      {" "}to <time dateTime={booking.end}>{formatDate(booking.end)}</time>
                    </>
                  )}
                  <span className="sc-timeoff__length"> &middot; {plural(booking.days, "day")}</span>
                </div>
                <button type="button" className="btn btn-secondary" onClick={() => cancelBooking(booking)}>
                  Cancel<span className="visually-hidden"> {booking.type.toLowerCase()} from {formatDate(booking.start)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
