

import "./comments.css";
import Avatar from "../custom/Avatar";
import Comment from "./Comment";
import { useContext, useEffect, useState, useCallback } from "react";
import { AppContext } from "../../context/AppContext";
import { getCommentsAsync, addCommentAsync } from "../../services/services";
import { useParams } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";

export default function Comments({ channelId, authUser }) {
  const { state } = useContext(AppContext);
  const { id: videoId } = useParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!videoId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getCommentsAsync(videoId);
      if (res?.data?.success) {
        setComments(res.data.comments);
      } else {
        setError(res?.data?.message || "Failed to load comments");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching comments");
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    if (!channelId || !authUser?._id) {
      setError("Please log in to comment");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await addCommentAsync(videoId, newComment, channelId);
      if (res?.data?.success) {
        const newCommentData = {
          ...res.data.comment,
          userId: authUser._id,
          userInfo: {
            name: authUser.name || "Current User",
            profile: authUser.profile || null, // S3 URL from authUser
          },
          likes: res.data.comment.likes || [],
        };
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
        setShowEmojiPicker(false);
      } else {
        setError(res?.data?.message || "Failed to post comment");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding comment");
      console.error("Error adding comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDelete = useCallback((commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  }, []);

  const handleEmojiClick = (emojiObject) => {
    setNewComment((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className={`comments ${state?.theme}`}>
      <div className="comments-wrapper">
        <h4>{comments.length} Comments</h4>

        <form onSubmit={handleSubmit} className="comment-form">
          <div className="inputs-wrapper">
            <Avatar 
              size={35} 
              src={authUser?.profile || "/assets/default.png"} 
              alt={authUser?.name || "User avatar"}
            />
            <textarea
              required
              placeholder={authUser ? "Enter your comment" : "Log in to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!authUser || submitting}
            />
          </div>
          <div className="inputs-actions">
            {authUser && (
              <button
                type="button"
                className="emoji-toggle"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={submitting}
              >
                😊
              </button>
            )}
            {newComment && (
              <button 
                type="button" 
                onClick={() => setNewComment("")}
                disabled={submitting}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              disabled={submitting || !authUser || !newComment.trim()}
            >
              {submitting ? "Posting..." : "Comment"}
            </button>
            {showEmojiPicker && authUser && (
              <div className="emoji-picker-container">
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>
        </form>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p className="loading">Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="comment-list">
            {comments.map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                authUser={authUser}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}