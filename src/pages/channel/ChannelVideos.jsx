import React, { useEffect, useState } from 'react';
import VideoCard from '../../components/videos/VideoCard';
import { getVideosByChannelIdAsync } from "../../services/services";
import './channelvideos.css'; 

export default function ChannelVideos({ channelId }) {
    const [allVideos, setAllVideos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        loadVideoByChannelId();
    }, [channelId]);

    const loadVideoByChannelId = async () => {
        if (!channelId) return;
        try {
            const res = await getVideosByChannelIdAsync(channelId);
            console.log("API Response:", res);
            if (res.status === 200) {
                const videoData = Array.isArray(res.data) ? res.data : res.data?.videos || [];
                setAllVideos(videoData);
                console.log("All videos set to:", videoData);
            } else {
                setAllVideos([]);
                console.log("Non-200 status:", res.status);
            }
        } catch (error) {
            console.log("Error loading videos:", error);
            setAllVideos([]);
        }
    };

    const totalVideos = allVideos.length;
    const totalPages = Math.ceil(totalVideos / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentVideos = allVideos.slice(startIndex, endIndex);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="channel-videos">
            <div className="list-items">
                {currentVideos.length > 0 ? (
                    currentVideos.map((item, index) => (
                        <VideoCard key={index} video={item} />
                    ))
                ) : (
                    <p>No videos found.</p>
                )}
            </div>
            {totalVideos > 0 && (
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}