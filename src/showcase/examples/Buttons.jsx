import React, { useState } from "react";

export default function ButtonsDemo() {
  const [saving, setSaving] = useState(false);

  const fakeSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="sc-row">
      <button type="button" className="btn btn-primary">
        <span className="material-icons" aria-hidden="true">add</span>
        Primary
      </button>
      <button type="button" className="btn btn-secondary">
        Secondary
      </button>
      <button type="button" className="btn btn-danger">
        <span className="material-icons" aria-hidden="true">delete</span>
        Delete
      </button>
      <button type="button" className="btn btn-primary" disabled>
        Disabled
      </button>
      <button
        type="button"
        className="btn btn-login"
        onClick={fakeSave}
        aria-disabled={saving}
      >
        <span className="material-icons" aria-hidden="true">
          {saving ? "hourglass_top" : "save"}
        </span>
        <span aria-live="polite">{saving ? "Saving..." : "Click to save"}</span>
      </button>
      <button type="button" className="btn btn-secondary sc-icon-btn" aria-label="Settings">
        <span className="material-icons" aria-hidden="true">settings</span>
      </button>
    </div>
  );
}
