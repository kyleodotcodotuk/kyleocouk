import React, { useId, useRef, useState } from "react";

// Reusable tabs following the WAI-ARIA tabs pattern with automatic
// activation: arrow keys move focus and select the tab in one step.
export function Tabs({ label, tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const id = useId();

  const selectTab = (index) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (e) => {
    const last = tabs.length - 1;
    const keys = {
      ArrowRight: activeIndex === last ? 0 : activeIndex + 1,
      ArrowLeft: activeIndex === 0 ? last : activeIndex - 1,
      Home: 0,
      End: last,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    selectTab(keys[e.key]);
  };

  return (
    <div className="sc-tabs">
      <div className="sc-tabs__list" role="tablist" aria-label={label} onKeyDown={handleKeyDown}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            type="button"
            role="tab"
            id={`${id}-tab-${tab.id}`}
            aria-selected={index === activeIndex}
            aria-controls={`${id}-panel-${tab.id}`}
            // Roving tabindex: only the selected tab is in the tab order
            tabIndex={index === activeIndex ? 0 : -1}
            className="sc-tabs__tab"
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-panel-${tab.id}`}
          aria-labelledby={`${id}-tab-${tab.id}`}
          hidden={index !== activeIndex}
          tabIndex={0}
          className="sc-tabs__panel"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

export default function TabsDemo() {
  return (
    <Tabs
      label="Project details"
      tabs={[
        {
          id: "overview",
          label: "Overview",
          content: <p>A small, dependency-free tabs component you can drop into any page.</p>,
        },
        {
          id: "keyboard",
          label: "Keyboard",
          content: (
            <p>
              Tab into the list, then use the arrow keys, Home and End. Press Tab again to
              reach the panel.
            </p>
          ),
        },
        {
          id: "reuse",
          label: "Reuse",
          content: <p>Pass a label and an array of tabs. Each tab has an id, a label and content.</p>,
        },
      ]}
    />
  );
}
