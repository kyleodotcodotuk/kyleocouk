import React, { useId, useState } from "react";

// A switch is a button with role="switch" - it announces "on/off" rather
// than "checked", and needs no hidden checkbox to be accessible.
export function Switch({ label, checked, onChange, disabled = false }) {
  const id = useId();
  return (
    <div className="sc-switch">
      <span className="sc-switch__label" id={id}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        disabled={disabled}
        className="sc-switch__control"
        onClick={() => onChange(!checked)}
      >
        <span className="sc-switch__thumb" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ToggleSwitchDemo() {
  const [notifications, setNotifications] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <div className="sc-stack">
      <Switch
        label="Email notifications"
        checked={notifications}
        onChange={setNotifications}
      />
      <Switch
        label="Reduce motion"
        checked={reducedMotion}
        onChange={setReducedMotion}
      />
      <Switch label="Beta features (unavailable)" checked={false} onChange={() => {}} disabled />
    </div>
  );
}
