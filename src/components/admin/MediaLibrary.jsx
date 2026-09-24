import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./AdminLayout";

// Turn "./new-york.jpg" into "New York"
const formatName = (fileName) =>
  fileName
    .replace("./", "")
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const context = require.context("../../img/static", false, /\.(png|jpe?g|gif|webp|svg)$/i);
const images = context.keys().map((fileName, index) => ({
  id: `static-${index + 1}`,
  name: formatName(fileName),
  url: context(fileName),
}));

export default function MediaLibrary() {
  const [expandedImage, setExpandedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef(null);

  // Native <dialog> gives us focus trapping, Escape to close and focus
  // return to the triggering button without any extra code
  useEffect(() => {
    const dialog = dialogRef.current;
    if (expandedImage && !dialog.open) dialog.showModal();
  }, [expandedImage]);

  const closeDialog = () => dialogRef.current?.close();

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(new URL(expandedImage.url, window.location.origin).href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        <section className="widget">
          <h1 className="widget-heading">
            Media Library <span className="material-icons" aria-hidden="true">perm_media</span>
          </h1>
          <hr />
          <p>Browse and preview the image library.</p>

          {images.length === 0 ? (
            <div className="alert alert-warning" role="status">
              <span className="material-icons" aria-hidden="true">image_not_supported</span>
              No images found. Add images to src/img/static to display them here.
            </div>
          ) : (
            <ul className="img-grid">
              {images.map((image) => (
                <li key={image.id}>
                  <button
                    type="button"
                    className="media-item"
                    onClick={() => {
                      setCopied(false);
                      setExpandedImage(image);
                    }}
                  >
                    <img src={image.url} alt="" loading="lazy" decoding="async" />
                    <span className="media-item__name">{image.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <dialog
          ref={dialogRef}
          className="image-modal"
          aria-labelledby="image-modal-title"
          onClose={() => setExpandedImage(null)}
          onClick={(e) => {
            // Clicking the backdrop (the dialog element itself) closes it
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          {expandedImage && (
            <div className="modal-content">
              <button type="button" className="modal-close" onClick={closeDialog} aria-label="Close preview">
                <span className="material-icons" aria-hidden="true">close</span>
              </button>
              <img src={expandedImage.url} alt={expandedImage.name} />
              <div className="modal-info">
                <h2 id="image-modal-title">{expandedImage.name}</h2>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={copyUrl}>
                    <span className="material-icons" aria-hidden="true">{copied ? "check" : "link"}</span>
                    <span aria-live="polite">{copied ? "Copied" : "Copy URL"}</span>
                  </button>
                  <a className="btn btn-secondary" href={expandedImage.url} target="_blank" rel="noreferrer">
                    <span className="material-icons" aria-hidden="true">open_in_new</span>
                    Open in new tab
                  </a>
                </div>
              </div>
            </div>
          )}
        </dialog>
      </div>
    </AdminLayout>
  );
}
