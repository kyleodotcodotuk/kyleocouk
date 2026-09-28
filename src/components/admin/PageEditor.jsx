import React, { useEffect, useId, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminLink from "./AdminLink";
import { useAuth } from "../../contexts/AuthContext";
import { usePages } from "../../contexts/PagesContext";
import { useToast } from "../../contexts/ToastContext";
import { PAGE_STATUSES, formatPageDate, slugify, todayIso, validatePage } from "../../utils/pages";
import { setUnsavedChanges } from "../../utils/unsavedChanges";

const PARENTS = [{ label: "Pages", to: "/admin/pages" }];

const blankPage = { id: "", title: "", slug: "", status: "Draft", summary: "", body: "" };

export default function PageEditor() {
  const { pageId } = useParams();
  const isNew = pageId === "new";
  const { pages, savePage, deletePage } = usePages();
  const existing = pages.find((p) => p.id === pageId);

  if (!isNew && !existing) {
    return (
      <AdminLayout title="Page not found" parents={PARENTS}>
        <div className="dashboard">
          <section className="widget">
            <div className="empty-state">
              <span className="material-icons" aria-hidden="true">search_off</span>
              <h1>Page not found</h1>
              <p>It may have been deleted, or the link is wrong.</p>
              <AdminLink to="/admin/pages" className="btn btn-primary">
                Back to all pages
              </AdminLink>
            </div>
          </section>
        </div>
      </AdminLayout>
    );
  }

  // Keyed so switching between pages starts a fresh form
  return (
    <Editor
      key={pageId}
      initial={isNew ? blankPage : existing}
      isNew={isNew}
      pages={pages}
      savePage={savePage}
      deletePage={deletePage}
    />
  );
}

function Editor({ initial, isNew, pages, savePage, deletePage }) {
  const id = useId();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState({});
  // New pages take their slug from the title until the slug is edited by hand
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const summaryRef = useRef(null);

  const isHome = draft.id === "home";
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved);

  useEffect(() => {
    setUnsavedChanges(isDirty);
    if (!isDirty) return undefined;
    // Covers closing the tab, refreshing or leaving the site
    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // Leaving the editor by any route clears the flag
  useEffect(() => () => setUnsavedChanges(false), []);

  const fieldId = (name) => `${id}-${name}`;

  const update = (name, value) => {
    setDraft((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && !slugEdited) next.slug = slugify(value);
      return next;
    });
    if (name === "slug") setSlugEdited(true);
    // Clear a field's error as soon as it's edited (and the slug's, if the title is driving it)
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      if (name === "title" && !slugEdited) delete next.slug;
      return next;
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = { ...draft, title: draft.title.trim(), slug: draft.slug.trim() };
    const next = validatePage(trimmed, pages);
    setErrors(next);

    if (Object.keys(next).length) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const page = {
      ...trimmed,
      id: isNew ? `${slugify(trimmed.title) || "page"}-${Date.now().toString(36)}` : trimmed.id,
      author: isNew ? user?.name || "Unknown" : trimmed.author,
      updated: todayIso(),
    };
    savePage(page);
    setSaved(page);
    setDraft(page);
    setUnsavedChanges(false);
    showToast({ type: "success", message: `"${page.title}" saved.` });
    if (isNew) navigate(`/admin/pages/${page.id}`, { replace: true });
  };

  const handleDelete = () => {
    if (!window.confirm(`Delete "${saved.title}"? This can't be undone.`)) return;
    setUnsavedChanges(false);
    deletePage(saved.id);
    showToast({ type: "info", message: `"${saved.title}" deleted.` });
    navigate("/admin/pages");
  };

  const handleDiscard = () => {
    setDraft(saved);
    setErrors({});
    setSlugEdited(!isNew);
    // The discard button disappears once there's nothing to discard
    document.getElementById(fieldId("title"))?.focus();
  };

  const errorList = Object.entries(errors);
  const describedBy = (name, ...extra) =>
    [errors[name] && `${fieldId(name)}-error`, ...extra].filter(Boolean).join(" ") || undefined;

  const fieldError = (name) =>
    errors[name] && (
      <p id={`${fieldId(name)}-error`} className="sc-field-error">
        <span className="visually-hidden">Error: </span>
        {errors[name]}
      </p>
    );

  const title = isNew ? "New page" : `Edit "${saved.title}"`;

  return (
    <AdminLayout title={isNew ? "New page" : saved.title} parents={PARENTS}>
      <div className="dashboard">
        <section className="widget page-editor">
          <div className="page-header">
            <h1 className="widget-heading">{title}</h1>
            <p className="page-editor__state" aria-live="polite">
              {isDirty ? (
                <span className="page-editor__dirty">
                  <span className="material-icons" aria-hidden="true">edit_note</span>
                  Unsaved changes
                </span>
              ) : (
                !isNew && `Last saved ${formatPageDate(saved.updated)} by ${saved.author}`
              )}
            </p>
          </div>
          <hr />

          <form onSubmit={handleSave} noValidate>
            {errorList.length > 0 && (
              <div className="sc-error-summary" tabIndex={-1} ref={summaryRef} aria-labelledby={`${id}-summary`}>
                <h2 id={`${id}-summary`}>There's a problem</h2>
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

            <div className={`form-group${errors.title ? " has-error" : ""}`}>
              <label htmlFor={fieldId("title")}>Title</label>
              {fieldError("title")}
              <input
                id={fieldId("title")}
                type="text"
                value={draft.title}
                onChange={(e) => update("title", e.target.value)}
                aria-invalid={errors.title ? true : undefined}
                aria-describedby={describedBy("title", `${fieldId("title")}-hint`)}
              />
              <small id={`${fieldId("title")}-hint`}>{draft.title.length} of 120 characters</small>
            </div>

            <div className={`form-group${errors.slug ? " has-error" : ""}`}>
              <label htmlFor={fieldId("slug")}>URL slug</label>
              {fieldError("slug")}
              <div className="slug-input">
                <span className="slug-input__prefix" aria-hidden="true">
                  kyleo.co.uk/
                </span>
                <input
                  id={fieldId("slug")}
                  type="text"
                  value={draft.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  disabled={isHome}
                  spellCheck="false"
                  autoCapitalize="none"
                  aria-invalid={errors.slug ? true : undefined}
                  aria-describedby={describedBy("slug", `${fieldId("slug")}-hint`)}
                />
              </div>
              <small id={`${fieldId("slug")}-hint`}>
                {isHome
                  ? "The homepage always lives at the root of the site."
                  : isNew && !slugEdited
                  ? "Filled in from the title. Edit it to set your own."
                  : "Lower-case letters, numbers and hyphens. Use / for sections, like guides/getting-started."}
              </small>
            </div>

            <fieldset className="form-group page-editor__status">
              <legend>Status</legend>
              {PAGE_STATUSES.map((status) => (
                <label key={status} className="sc-radio">
                  <input
                    type="radio"
                    name={`${id}-status`}
                    value={status}
                    checked={draft.status === status}
                    onChange={() => update("status", status)}
                  />
                  {status}
                </label>
              ))}
            </fieldset>

            <div className={`form-group${errors.summary ? " has-error" : ""}`}>
              <label htmlFor={fieldId("summary")}>
                Summary <span className="sc-optional">(optional)</span>
              </label>
              {fieldError("summary")}
              <textarea
                id={fieldId("summary")}
                rows={2}
                value={draft.summary}
                onChange={(e) => update("summary", e.target.value)}
                aria-invalid={errors.summary ? true : undefined}
                aria-describedby={describedBy("summary", `${fieldId("summary")}-hint`)}
              />
              <small id={`${fieldId("summary")}-hint`}>
                Shown in search results. {draft.summary.length} of 160 characters.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor={fieldId("body")}>Content</label>
              <textarea
                id={fieldId("body")}
                rows={8}
                value={draft.body}
                onChange={(e) => update("body", e.target.value)}
              />
            </div>

            <div className="form-actions page-editor__actions">
              <button type="submit" className="btn btn-primary">
                <span className="material-icons" aria-hidden="true">save</span>
                {isNew ? "Create page" : "Save changes"}
              </button>
              {isDirty && !isNew && (
                <button type="button" className="btn btn-secondary" onClick={handleDiscard}>
                  <span className="material-icons" aria-hidden="true">undo</span>
                  Discard changes
                </button>
              )}
              {!isNew && !isHome && (
                <button type="button" className="btn btn-danger page-editor__delete" onClick={handleDelete}>
                  <span className="material-icons" aria-hidden="true">delete</span>
                  Delete page
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </AdminLayout>
  );
}
