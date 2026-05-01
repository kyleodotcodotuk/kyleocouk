import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";

export default function MediaLibrary() {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [view, setView] = useState("all"); // all, images, documents
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

  // Load all images from the static folder automatically
  const staticImages = importAll(
    require.context("../../img/static", false, /\.(png|jpe?g|gif|webp|svg)$/i),
  );

  useEffect(() => {
    // Load media files from localStorage
    const savedMedia = localStorage.getItem("mediaFiles");
    if (savedMedia) {
      try {
        setMediaFiles(JSON.parse(savedMedia));
      } catch {
        setMediaFiles([]);
      }
    }
  }, []);

  const saveMediaFiles = (updatedFiles) => {
    setMediaFiles(updatedFiles);
    localStorage.setItem("mediaFiles", JSON.stringify(updatedFiles));
  };

  const deleteMediaFile = (fileId) => {
    const updatedFiles = mediaFiles.filter((f) => f.id !== fileId);
    saveMediaFiles(updatedFiles);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setIsUploading(true);

    // Simulate file upload process
    files.forEach((file, index) => {
      setTimeout(
        () => {
          const fileType = file.type.startsWith("image/")
            ? "image"
            : file.type.startsWith("video/")
              ? "video"
              : "document";

          const newFile = {
            id: Date.now() + index,
            name: file.name,
            type: fileType,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            url: URL.createObjectURL(file), // In production, this would be your actual upload URL
            mimeType: file.type,
          };

          const currentFiles = JSON.parse(
            localStorage.getItem("mediaFiles") || "[]",
          );
          const updatedFiles = [...currentFiles, newFile];
          saveMediaFiles(updatedFiles);

          if (index === files.length - 1) {
            setIsUploading(false);
          }
        },
        500 * (index + 1),
      );
    });
  };

  const handleUrlUpload = (url, type) => {
    if (!url.trim()) return;

    const newFile = {
      id: Date.now(),
      name: url.split("/").pop() || "Untitled",
      type: type || "image",
      size: 0,
      uploadedAt: new Date().toISOString(),
      url: url.trim(),
      mimeType:
        type === "image"
          ? "image/jpeg"
          : type === "video"
            ? "video/mp4"
            : "application/pdf",
    };

    const updatedFiles = [...mediaFiles, newFile];
    saveMediaFiles(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredFiles = mediaFiles.filter((file) => {
    if (view === "images") return file.type === "image";

    if (view === "documents") return file.type === "document";
    return true;
  });

  const getFileIcon = (file) => {
    switch (file.type) {
      case "image":
        return "image";
      case "video":
        return "videocam";
      case "document":
        return "description";
      default:
        return "insert_drive_file";
    }
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        {/* Static FTP Images Gallery */}
        <section className="widget">
          <h2>
            <span className="material-icons">folder_special</span>
            Static FTP Images
          </h2>
          <p>
            Click any image to view full size. These images are manually managed
            via FTP.
          </p>

          <div className="static-images-grid">
            {staticImages.map((image) => (
              <div key={image.id} onClick={() => setExpandedImage(image)}>
                <div>
                  <img height="50px" src={image.thumb} alt={image.name} />

                  <span className="material-icons">zoom_in</span>
                </div>
                <div className="static-image-info">
                  <span className="image-name">{image.name}</span>
                  <button
                    className="btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(image.url);
                    }}
                    title="Copy URL"
                  >
                    <span className="material-icons">link</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
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

        {/* File Upload Section */}
        <div className="upload-controls">
          <h2>
            <span className="material-icons">cloud_upload</span>
            Upload New Files
          </h2>
          <div className="upload-section">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("file-upload").click()}
              disabled={isUploading}
            >
              <span className="material-icons">upload</span>
              {isUploading ? "Uploading..." : "Upload Files"}
            </button>
          </div>
        </div>

        <div className="media-tabs">
          <button
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            <span className="material-icons">folder</span>
            All Files ({mediaFiles.length})
          </button>
          <button
            className={view === "images" ? "active" : ""}
            onClick={() => setView("images")}
          >
            <span className="material-icons">image</span>
            Images ({mediaFiles.filter((f) => f.type === "image").length})
          </button>
          <button
            className={view === "documents" ? "active" : ""}
            onClick={() => setView("documents")}
          >
            <span className="material-icons">description</span>
            Documents ({mediaFiles.filter((f) => f.type === "document").length})
          </button>
        </div>

        <div className="upload-from-url">
          <details>
            <summary>Add from URL</summary>
            <div className="url-upload-form">
              <input
                type="url"
                placeholder="Enter image, video, or document URL"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    const url = e.target.value;
                    const type = url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                      ? "image"
                      : url.match(/\.(mp4|webm|ogg)$/i)
                        ? "video"
                        : "document";
                    handleUrlUpload(url, type);
                    e.target.value = "";
                  }
                }}
              />
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  const url = input.value;
                  const type = url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                    ? "image"
                    : url.match(/\.(mp4|webm|ogg)$/i)
                      ? "video"
                      : "document";
                  handleUrlUpload(url, type);
                  input.value = "";
                }}
              >
                Add
              </button>
            </div>
          </details>
        </div>

        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <span className="material-icons">perm_media</span>
            <h3>No media files yet</h3>
            <p>Upload your first image, video, or document to get started</p>
            <button
              className="btn btn-primary"
              onClick={() => document.getElementById("file-upload").click()}
            >
              Upload Files
            </button>
          </div>
        ) : (
          <div className="media-grid">
            {filteredFiles.map((file) => (
              <div key={file.id} className="media-item">
                <div className="media-preview">
                  {file.type === "image" ? (
                    <img src={file.url} alt={file.name} />
                  ) : (
                    <div className="file-icon">
                      <span className="material-icons">
                        {getFileIcon(file)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="media-info">
                  <h4 title={file.name}>{file.name}</h4>
                  <div className="media-meta">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>
                </div>

                <div className="media-actions">
                  <button
                    className="btn btn-icon"
                    onClick={() => navigator.clipboard.writeText(file.url)}
                    title="Copy URL"
                  >
                    <span className="material-icons">link</span>
                  </button>

                  <button
                    className="btn btn-icon"
                    onClick={() => window.open(file.url, "_blank")}
                    title="View full size"
                  >
                    <span className="material-icons">open_in_new</span>
                  </button>

                  <button
                    className="btn btn-icon danger"
                    onClick={() => deleteMediaFile(file.id)}
                    title="Delete file"
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
