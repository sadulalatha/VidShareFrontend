
import { useEffect, useRef, useState } from "react";
import "./videoplayer.css";

export default function VideoPlayer({ video, onVideoWatched }) {
  const videoRef = useRef(null);
  const videoUrl = video.videoUrl;
  const cover = video.cover ;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    // Ensure poster is set and video doesn’t preload fully
    videoElement.cover= cover;
    videoElement.preload = "metadata";

    const handleVideoStart = () => {
      console.log("Video started playing, storing in history...");
      setIsPlaying(true);
      onVideoWatched();
      videoElement.removeEventListener("play", handleVideoStart);
    };

    const handleVideoPause = () => {
      console.log("Video paused");
      setIsPlaying(false); // Show play button when paused
    };

    const handleVideoEnded = () => {
      console.log("Video ended");
      setIsPlaying(false); // Show play button when video ends
    };

    const handleVideoError = (e) => {
      const error = e.target.error;
      console.error("Video playback error:", { code: error.code, message: error.message });
    };

    const handleVideoLoaded = () => {
      console.log("Video metadata loaded, poster should be visible:", videoElement.poster);
    };

    videoElement.addEventListener("play", handleVideoStart);
    videoElement.addEventListener("pause", handleVideoPause);
    videoElement.addEventListener("ended", handleVideoEnded);
    videoElement.addEventListener("error", handleVideoError);
    videoElement.addEventListener("loadedmetadata", handleVideoLoaded);

    return () => {
      videoElement.removeEventListener("play", handleVideoStart);
      videoElement.removeEventListener("pause", handleVideoPause);
      videoElement.removeEventListener("ended", handleVideoEnded);
      videoElement.removeEventListener("error", handleVideoError);
      videoElement.removeEventListener("loadedmetadata", handleVideoLoaded);
    };
  }, [videoUrl, cover, onVideoWatched]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      console.log("Play button clicked, attempting to play video...");
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  };

  console.log("Video URL:", videoUrl);
  // console.log("Poster URL:", posterUrl);

  return (
    <div className="video-player" style={{ position: "relative", width: "100%" }}>
      <video
        ref={videoRef}
        key={videoUrl}
        src={videoUrl}
        cover={cover}
        controls 
        style={{ maxWidth: "100%", display: "block" }}
      />
      {!isPlaying && (
        <div
          className="play-button-overlay"
          onClick={handlePlayClick}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
        </div>
      )}
    </div>
  );
}