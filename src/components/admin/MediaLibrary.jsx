import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function MediaLibrary() {
  const [expandedImage, setExpandedImage] = useState(null);

  // Dynamically import all images from the static folder
  const importAll = (r) => {
    return r.keys().map((fileName, index) => {
      const imageUrl = r(fileName);
      // Extract filename without extension
      const nameWithoutExt = fileName
        .replace("./", "")
        .replace(/\.[^/.]+$/, "");

      // Format the name: replace hyphens/underscores with spaces and capitalize words
      const formattedName = nameWithoutExt
        .replace(/[-_]/g, " ")
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");

      return {
        id: `static-${index + 1}`,
        name: formattedName,
        url: imageUrl,
        thumb: imageUrl,
      };
    });
  };

  // Load all images from the static folder
  const images = importAll(
    require.context("../../img/static", false, /\.(png|jpe?g|gif|webp|svg)$/i),
  );

  return (
    <AdminLayout>
      <div className="dashboard">
        {/* Images Grid */}
        <section className="widget">
          <h2 className="widget-heading">
            Media Library <span className="material-icons">perm_media</span>
          </h2>
          <hr />
          <p>Browse and view your image library.</p>

          {images.length === 0 ? (
            <div className="alert alert-warning">
              <span className="material-icons">image_not_supported</span>
              <h3>No images found</h3>
              <p>Add images to the static folder to display them here.</p>
            </div>
          ) : (
            <div className="img-grid">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="media-item"
                  onClick={() => setExpandedImage(image)}
                >
                  <img height="150px" src={image.thumb} alt={image.name} />
                  <h4 title={image.name}>{image.name}</h4>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Image Expansion Modal */}
        {expandedImage && (
          <div className="image-modal" onClick={() => setExpandedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={() => setExpandedImage(null)}
              >
                <span className="material-icons">close</span>
              </button>
              <img src={expandedImage.url} alt={expandedImage.name} />
              <div className="modal-info">
                <h3>{expandedImage.name}</h3>
                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() =>
                      navigator.clipboard.writeText(expandedImage.url)
                    }
                  >
                    <span className="material-icons">link</span>
                    Copy URL
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => window.open(expandedImage.url, "_blank")}
                  >
                    <span className="material-icons">open_in_new</span>
                    Open in New Tab
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
