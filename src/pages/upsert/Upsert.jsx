
import { useState, useEffect } from "react";
import DragDropFiles from "./DragDropFiles";
import "./upsert.css";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import * as services from "../../services/services";
import { useNavigate } from "react-router-dom";

export default function Upsert({ selectedVideo, setSelectedVideo, onClose }) {
  const [video, setVideo] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState(selectedVideo ? selectedVideo.title : "");
  const [desc, setDesc] = useState(selectedVideo ? selectedVideo.desc : "");
  const [loading, setLoading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (video) {
      const previewUrl = URL.createObjectURL(video);
      setVideoPreviewUrl(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else if (selectedVideo?.videoUrl) {
      setVideoPreviewUrl(selectedVideo.videoUrl);
    }
  }, [video, selectedVideo]);

  const clearInputs = () => {
    setVideo(null);
    setCover(null);
    setTitle("");
    setDesc("");
  };

  const handleCover = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) setCover(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desc", desc);
      if (video) formData.append("video", video);
      if (cover) formData.append("cover", cover);

      let res;
      if (selectedVideo) {
        res = await services.updateVideoAsync(selectedVideo._id, formData);
        if (res.status === 200) {
          console.log("Frontend Update Video URL:", res.data.videoUrl);
          clearInputs();
          setSelectedVideo(res.data);
          setVideoPreviewUrl(res.data.videoUrl); 
          setLoading(false);
          onClose(false);
        }
      } else {
        res = await services.createVideoAsync(formData);
        if (res.status === 200) {
          console.log("Frontend Create Video URL:", res.data.videoUrl);
          clearInputs();
          setVideoPreviewUrl(res.data.videoUrl);
          setLoading(false);
          navigate(`/videos/${res.data._id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting video:", error);
      setLoading(false);
    }
  };

  return (
    <div className="upsert">
      <div className="wrapper container">
        <h2 className="heading">
          {selectedVideo && (
            <FaArrowLeft
              onClick={() => onClose(false)}
              style={{ marginRight: "1rem", cursor: "pointer" }}
            />
          )}
          {selectedVideo ? "Update Video" : "Upload New Video"}
        </h2>
        <div className="inputs-wrapper">
          <div className="left">
            {videoPreviewUrl ? (
              <video
                key={videoPreviewUrl} 
                controls
                src={videoPreviewUrl}
                style={{ maxWidth: "100%", maxHeight: "300px" }}
                onError={(e) => console.error("Video playback error:", e.target.error)}
                onLoadedData={() => console.log("Video loaded successfully")}
                autoPlay 
              />
            ) : (
              <DragDropFiles
                file={video}
                setFile={setVideo}
                selectedVideo={selectedVideo}
              />
            )}
          </div>
          <div className="right">
            <form onSubmit={handleSubmit} className="upsert-form">
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Title"
              />
              <label htmlFor="upload-cover">
                <input
                  type="file"
                  id="upload-cover"
                  accept="image/png, image/jpg, image/jpeg"
                  style={{ display: "none" }}
                  onChange={handleCover}
                />
                <div className="upload-cover">
                  <FaImage className="camera-icon" />
                  <span>
                    {cover instanceof File
                      ? cover.name
                      : typeof selectedVideo?.cover === "string"
                      ? "Current Cover"
                      : "Select Cover"}
                  </span>
                </div>
              </label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Description"
              />
              <button type="submit" disabled={loading}>
                {loading
                  ? "Uploading.Please wait..."
                  : selectedVideo
                  ? "Save"
                  : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}