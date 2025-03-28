import React, { useState, useEffect } from "react";
import Avatar from "../custom/Avatar";
import { FaHeart, FaRegHeart, FaTrashAlt } from "react-icons/fa";
import {
  likeCommentAsync,
  dislikeCommentAsync,
  deleteCommentAsync,
} from "../../services/services";

export default function Comment({ comment, authUser, onDelete }) {
  // Initialize likes, filtering out any null values (safety net)
  const initialLikes = Array.isArray(comment?.likes)
    ? comment.likes.filter((id) => id !== null)
    : [];
  const [liked, setLiked] = useState(
    authUser?._id &&
      initialLikes.some((id) => id.toString() === authUser._id.toString())
  );
  const [likes, setLikes] = useState(initialLikes.length);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const isOwnComment = authUser?._id === comment?.userId;

  // Debug initial state
  useEffect(() => {
    console.log("Initial Comment State:", {
      commentId: comment?._id,
      initialLikes,
      liked,
      authUserId: authUser?._id,
    });
  }, [comment, authUser]);

  const handleLike = async () => {
    if (!comment?._id || !authUser?._id) {
      console.log("Missing required data:", {
        commentId: comment?._id,
        userId: authUser?._id,
      });
      setError("Authentication required");
      return;
    }

    setError(null);
    try {
      const res = liked
        ? await dislikeCommentAsync(comment._id)
        : await likeCommentAsync(comment._id);

      console.log("API Response:", res.data);

      if (res && res.status >= 200 && res.status < 300) {
        const updatedComment = res.data?.comment;
        if (updatedComment && Array.isArray(updatedComment.likes)) {
          const validLikes = updatedComment.likes.filter((id) => id !== null);
          console.log("Processed Likes:", {
            rawLikes: updatedComment.likes,
            validLikes,
            userId: authUser._id,
          });

          setLikes(validLikes.length);
          setLiked(
            validLikes.some((id) => id.toString() === authUser._id.toString())
          );
        } else {
          throw new Error("Invalid response format from server");
        }
      } else {
        throw new Error(`API failed with status: ${res?.status}`);
      }
    } catch (error) {
      console.error("Like/Dislike Error:", {
        message: error.message,
        response: error.response?.data,
        commentId: comment._id,
      });
      setError(error.response?.data?.message || "Failed to update like status");
    }
  };

  const handleDelete = async () => {
    if (
      !isOwnComment ||
      !window.confirm("Are you sure you want to delete this comment?")
    )
      return;

    setDeleting(true);
    setError(null);
    try {
      const res = await deleteCommentAsync(comment._id);
      if (res?.data?.success) {
        onDelete(comment._id);
      } else {
        throw new Error(res?.data?.message || "Delete response invalid");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Failed to delete comment: ${error.message}`
      );
      console.error("Delete error:", error.response?.data || error.message);
    } finally {
      setDeleting(false);
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const diff = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="comment-item">
      <div className="user-infos">
        <a href={`/channel/${comment?.channelId}`} className="channel-avatar">
          <Avatar
            size={26}
            src={comment?.userInfo?.profile || "/assets/default.png"}
          />
        </a>

        <div className="info-wrapper">
          <a href={`/channel/${comment?.channelId}`} className="channel-name">
            {comment?.userInfo?.name || "Unknown User"}
          </a>
          <span className="timeline">{getTimeAgo(comment?.createdAt)}</span>
        </div>
      </div>

      <div className="comment-body">
        <p>{comment?.desc || "No comment content"}</p>
      </div>

      <div className="comments-actions">
        <button
          className="action-item like"
          onClick={handleLike}
          disabled={!authUser || !comment?._id}
          aria-label={liked ? "Unlike Comment" : "Like Comment"}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
          <span>{likes}</span>
        </button>

        {isOwnComment && (
          <button
            className="action-item delete"
            onClick={handleDelete}
            disabled={deleting || !comment?._id}
            aria-label="Delete Comment"
          >
            {deleting ? "Deleting..." : <FaTrashAlt />}
          </button>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
