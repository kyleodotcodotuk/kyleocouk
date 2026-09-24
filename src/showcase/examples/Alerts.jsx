import React from "react";

const alerts = [
  { type: "danger", icon: "warning", text: "Denial or hard problem - the action could not be completed." },
  { type: "warning", icon: "assignment_late", text: "Soft warning - something needs your attention." },
  { type: "success", icon: "check", text: "Success - the action completed." },
  { type: "info", icon: "info", text: "Information that might be useful." },
];

export default function AlertsDemo() {
  return (
    <div>
      {alerts.map((alert) => (
        <div
          key={alert.type}
          // Only urgent messages interrupt screen readers; the rest are polite
          role={alert.type === "danger" ? "alert" : "status"}
          className={`alert alert-${alert.type}`}
        >
          <span className="material-icons" aria-hidden="true">{alert.icon}</span>
          {alert.text}
        </div>
      ))}
    </div>
  );
}
