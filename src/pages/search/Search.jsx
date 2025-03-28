

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVideosAsync } from "../../services/services";
import VideoCard from "../../components/videos/VideoCard";
import "./search.css";

export default function Search() {
  const [videos, setVideos] = useState([]);
  const toSearch = useLocation().search;

  useEffect(() => {
    if (toSearch) {
      searchVideos();
    } else {
      setVideos([]); // Clear videos if no search query
    }
  }, [toSearch]);

  const searchVideos = async () => {
    try {
      const res = await getVideosAsync(toSearch);
      if (res.status === 200) {
        setVideos(res.data);
      } else {
        setVideos([]); // Clear videos on failed request
      }
    } catch (error) {
      console.log("Search error:", error);
      setVideos([]); // Clear videos on error
    }
  };

  return (
    <div className="home">
      <div className="video-list">
        {videos.length > 0 ? (
          videos.map((item, index) => <VideoCard key={index} video={item} />)
        ) : (
          toSearch && (
            <div className="no-results">
              <p>No videos found for your search.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
