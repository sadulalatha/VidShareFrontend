


import { useEffect, useState } from "react";

export default function DragDropFiles({ file, setFile, selectedVideo }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (selectedVideo?.videoUrl) {
      setPreviewUrl(selectedVideo.videoUrl); // Use S3 URL for existing video
    } else {
      setPreviewUrl(null);
    }
  }, [file, selectedVideo]);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      style={{
        border: "2px dashed #ccc",
        padding: "20px",
        textAlign: "center",
      }}
    >
      {previewUrl ? (
        <video
          controls
          src={previewUrl}
          style={{ maxWidth: "100%", maxHeight: "200px" }}
        />
      ) : (
        <>
          <p>Drag and drop a video here, or click to select</p>
          <input
            type="file"
            accept="video/*"
            onChange={handleChange}
            style={{ display: "block", margin: "10px auto" }}
          />
        </>
      )}
    </div>
  );
}



