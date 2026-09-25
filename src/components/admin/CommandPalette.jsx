import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { adminRoutes } from "../../config/adminRoutes";
import showcase from "../../showcase";
import useViewTransitionNavigate from "../../hooks/useViewTransitionNavigate";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
const shortcutLabel = isMac ? "⌘K" : "Ctrl K";

// A command palette following the WAI-ARIA combobox pattern: focus stays in
// the input, and arrow keys move a highlighted option via aria-activedescendant.
export default function CommandPalette({ onLogout }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef(null);
  const navigate = useViewTransitionNavigate();
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (index) => `${id}-option-${index}`;

  const commands = useMemo(
    () => [
      ...adminRoutes.map((route) => ({
        label: route.label,
        group: "Page",
        icon: route.icon,
        run: () => navigate(route.path),
      })),
      ...showcase.map((item) => ({
        label: item.title,
        group: "Component",
        icon: item.icon,
        run: () => navigate(`/admin/components#${item.id}`),
      })),
      {
        label: "View site",
        group: "Action",
        icon: "open_in_new",
        run: () => window.open("/", "_blank", "noopener"),
      },
      {
        label: "Log out",
        group: "Action",
        icon: "exit_to_app",
        run: onLogout,
      },
    ],
    [navigate, onLogout]
  );

  const search = query.trim().toLowerCase();
  const results = commands.filter((command) =>
    `${command.label} ${command.group}`.toLowerCase().includes(search)
  );

  const openPalette = () => {
    setQuery("");
    setActiveIndex(0);
    dialogRef.current?.showModal();
  };

  const closePalette = () => dialogRef.current?.close();

  const runCommand = (command) => {
    closePalette();
    command.run();
  };

  // Global shortcut
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialogRef.current?.open) closePalette();
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // openPalette/closePalette only touch refs and state setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the highlighted option visible when arrowing through a long list
  useEffect(() => {
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleInputKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(results[activeIndex]);
    }
  };

  return (
    <>
      <button type="button" className="btn btn-secondary command-trigger" onClick={openPalette}>
        <span className="material-icons" aria-hidden="true">search</span>
        Search
        <kbd aria-hidden="true">{shortcutLabel}</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="command-palette"
        aria-label="Command palette"
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it
          if (e.target === e.currentTarget) closePalette();
        }}
      >
        <div className="command-palette__search">
          <span className="material-icons" aria-hidden="true">search</span>
          <input
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results.length ? optionId(activeIndex) : undefined}
            aria-label="Search pages, components and actions"
            placeholder="Search pages, components and actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <ul className="command-palette__list" id={listId} role="listbox" aria-label="Results">
          {results.map((command, index) => (
            <li
              key={`${command.group}-${command.label}`}
              id={optionId(index)}
              role="option"
              aria-selected={index === activeIndex}
              className="command-palette__option"
              onClick={() => runCommand(command)}
              onMouseMove={() => setActiveIndex(index)}
            >
              <span className="material-icons" aria-hidden="true">{command.icon}</span>
              <span className="command-palette__label">{command.label}</span>
              <span className="command-palette__group">{command.group}</span>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <p className="command-palette__empty">No results for "{query}"</p>
        )}

        <p className="visually-hidden" aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>

        <p className="command-palette__hint" aria-hidden="true">
          <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close
        </p>
      </dialog>
    </>
  );
}
