import React from "react";
import { useToast } from "../../contexts/ToastContext";

const examples = [
  { type: "success", label: "Success", message: "Page published." },
  { type: "info", label: "Info", message: "A new version of this page is available." },
  { type: "warning", label: "Warning", message: "You have unsaved changes." },
  { type: "danger", label: "Error", message: "Couldn't save - check your connection." },
];

export default function ToastsDemo() {
  const { showToast } = useToast();

  return (
    <div className="sc-row">
      {examples.map(({ type, label, message }) => (
        <button
          key={type}
          type="button"
          className="btn btn-secondary"
          onClick={() => showToast({ type, message })}
        >
          Show {label.toLowerCase()} toast
        </button>
      ))}
    </div>
  );
}
