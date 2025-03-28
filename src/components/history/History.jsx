
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { getWatchHistoryAsync, clearWatchHistoryAsync, deleteEntryAsync } from "../../services/services";
import "./history.css";
import { FaTrashAlt } from "react-icons/fa";




export default function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWatchHistory = async () => {
        try {
            setLoading(true);
            const response = await getWatchHistoryAsync();
            console.log("Fetched watch history:", response.data);
            setHistory(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch watch history:", err);
            setError("Failed to fetch watch history");
        } finally {
            setLoading(false);
        }
    };

    const handleClearHistory = async () => {
        if (window.confirm("Are you sure you want to clear your watch history?")) {
            try {
                setLoading(true);
                await clearWatchHistoryAsync();
                setHistory([]);
                setError(null);
            } catch (err) {
                setError("Failed to clear watch history");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteEntry = async (historyId) => {
        if (window.confirm("Are you sure you want to delete this watch history entry?")) {
            try {
                setLoading(true);
                await deleteEntryAsync(historyId);
                setHistory(history.filter((item) => item._id !== historyId));
            } catch (err) {
                console.error("Failed to delete watch history entry:", err);
                setError("Failed to delete watch history entry");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchWatchHistory();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="watch-history-container">
            <h2>Your Watch History</h2>
            <div className="history-actions">
                {history.length > 0 && (
                    <button className="clear-button" onClick={handleClearHistory}>
                        Clear History
                    </button>
                )}
            </div>
            {history.length === 0 ? (
                <p className="no-history">No videos in your watch history yet.</p>
            ) : (
                <div className="history-list">
                    {history.map((item) => (
                        <div key={item._id} className="history-item">
                            <Link to={`/videos/${item.videoId._id}`}>
                                <img
                                    src={item.videoId.cover}
                    
                                    alt={item.videoId.title}
                                    className="thumbnail"
                        
                                />
                            </Link>
                            <div className="video-info">
                                <h3>{item.videoId.title}</h3>
                                <p>Watched at: {new Date(item.watchedAt).toLocaleString()}</p>
                            </div>
                            <button
                                className="delete-button"
                                onClick={() => handleDeleteEntry(item._id)}
                                title="Delete from history"
                            >
                                <FaTrashAlt />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}