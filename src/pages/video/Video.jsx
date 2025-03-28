

import { useContext, useEffect, useState } from "react";
import Comments from "../../components/comments/Comments";
import Avatar from "../../components/custom/Avatar";
import VideoPlayer from "../../components/custom/VideoPlayer";
import "./video.css";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { FaHeart, FaRegHeart, FaShare } from "react-icons/fa6";
// import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "timeago.js";
import { AppContext } from "../../context/AppContext";
import * as services from "../../services/services";
import OtherVideos from "./OtherVideos";
import Upsert from "../upsert/Upsert";
import { toast } from "react-toastify";
import { addToWatchHistoryAsync } from "../../services/services";

export default function Video() {
    const { state } = useContext(AppContext);
    const [more, setMore] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const [subStatus, setSubStatus] = useState(false);
    const [videoDetails, setVideoDetails] = useState(null);
    const authUser = state?.channel;
    console.log("auth", authUser);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadCurrentVideo();
    }, [id, authUser]);

    const loadCurrentVideo = async () => {
        if (!id) return;
        try {
            const res = await services.getVideoAsync(id);
            console.log(res);
            if (res.status == 200) {
                setVideoDetails(res.data);
                setSubStatus(authUser && res.data.subscribers.includes(authUser._id));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleVideoWatched = async (videoId) => {
        if (!authUser || !videoId ) {
            console.log("Cannot add to history: No authUser or videoId", { authUser, videoId });
            return;
        }
        try {
            console.log("Adding video to watch history:", videoId);
            const response = await addToWatchHistoryAsync(videoId);
            console.log("Watch history response:", response);
        } catch (error) {
            console.error("Failed to add to watch history:", error);
            toast.error("Failed to update watch history");
        }
    };

    const handleLikes = async () => {
        if (!videoDetails || !authUser) return;
        try {
            const res = videoDetails.likes.includes(authUser._id)
                ? await services.dislikeVideoAsync(videoDetails._id)
                : await services.likeVideoAsync(videoDetails._id);
            if (res?.status == 200) loadCurrentVideo();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async () => {
        if (!videoDetails) return;
        try {
            if (window.confirm("Are you sure you want to delete this?")) {
                const res = await services.deleteVideoAsync(videoDetails._id);
                if (res.status == 200) navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubscribe = async () => {
        if (!videoDetails || !authUser) return;
        try {
            const res = authUser.subscriptions.includes(videoDetails.channelId)
                ? await services.unsubscribeChannelAsync(videoDetails.channelId)
                : await services.subscribeChannelAsync(videoDetails.channelId);
            if (res.status == 200) setSubStatus(!subStatus);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShare = async () => {
        if (!videoDetails) return;
        const videoUrl = `${window.location.origin}/videos/${videoDetails._id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: videoDetails.title,
                    text: "Check out this video!",
                    url: videoUrl,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(videoUrl);
                toast.success("Video link copied to clipboard!");
            } catch (error) {
                console.error("Failed to copy:", error);
                toast.error("Failed to copy link");
            }
        }
    };



    if (onEdit && videoDetails)
        return <Upsert selectedVideo={videoDetails} setSelectedVideo={setVideoDetails} onClose={setOnEdit} />;

    return (
        <div className="video-preview">
            <div className="video-preview-wrapper container">
                <div className="video-preview-left">
                    {videoDetails && (
                        <VideoPlayer
                            video={videoDetails}
                            onVideoWatched={() => handleVideoWatched(videoDetails._id)}
                        />
                    )}
                    <h2 className="video-title">{videoDetails?.title}</h2>
                    <div className="video-preview-infos">
                        <div className="channel-infos">
                            <div className="left">
                                <a href={`/channels/${videoDetails?.channelId}`} className="avatar-wrapper">
                                    <Avatar size={35} profile={videoDetails?.profile} />
                                    <div className="avatar-infos">
                                        <h4 className="name">{videoDetails?.name}</h4>
                                        <span className="subscribers">
                                            {videoDetails?.subscribers?.length || 0} subscribers
                                        </span>
                                    </div>
                                </a>
                                {videoDetails?.channelId == authUser?._id ? (
                                    <button>
                                        <a href={`/channels/${videoDetails?.channelId}`}>View Channel</a>
                                    </button>
                                ) : (
                                    <button onClick={handleSubscribe}>
                                        {subStatus ? "unsubscribe" : "subscribe"}
                                    </button>
                                )}
                            </div>
                            <div className="right">
                                {videoDetails?.channelId == authUser?._id && (
                                    <>
                                        <div className="action-item" onClick={() => setOnEdit(true)}>
                                            <FaEdit />
                                        </div>
                                        <div className="action-item" onClick={handleDelete}>
                                            <FaTrashAlt />
                                        </div>
                                    </>
                                )}
                                <div className="like-wrapper">
                                    <div className="action-item" onClick={handleLikes}>
                                        {videoDetails?.likes.includes(authUser?._id) ? (
                                            <FaHeart />
                                        ) : (
                                            <FaRegHeart />
                                        )}
                                    </div>
                                    <span>{videoDetails?.likes.length}</span>
                                </div>
                                <div className="action-item" onClick={handleShare}>
                                    <FaShare />
                                </div>
                                {/* <div className="action-item">
                                    <HiDotsHorizontal />
                                </div> */}
                            </div>
                        </div>
                        <div className={more ? "video-preview-desc active" : "video-preview-desc"}>
                            <div className="views">{`${videoDetails?.views} views · ${format(
                                videoDetails?.createdAt
                            )}`}</div>
                            <div className="video-desc">
                                <p>{videoDetails?.desc}</p>
                            </div>
                            <span onClick={() => setMore((prev) => !prev)} className="read-more">
                                {more ? "show less" : "show more"}
                            </span>
                        </div>
                        <div className="video-comments">
                            <Comments channelId={videoDetails?.channelId} authUser={authUser} />
                        </div>
                    </div>
                </div>
                <OtherVideos />
            </div>
        </div>
    );
}






