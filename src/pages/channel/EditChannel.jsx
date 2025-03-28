
import "./editchannel.css";
import { AppContext } from "../../context/AppContext";
import DefaultBanner from "../../assets/banner.png";
import DefaultProfile from "../../assets/default.png";
import { useContext, useState, useEffect } from "react";
import { FaCamera } from "react-icons/fa6";
import * as services from "../../services/services";

export default function EditChannel({ user, setUser, open, onClose }) {
  const [banner, setBanner] = useState(null);
  const [profile, setProfile] = useState(null);
  const [channel, setChannel] = useState(user?.name || "");
  const [desc, setDesc] = useState(user?.desc ?? "");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { state, setState } = useContext(AppContext);

  // Close modal when "open" becomes false
  useEffect(() => {
    if (!open) {
      clearInputs();
    }
  }, [open]);

  const handleCancel = (e) => {
    e.preventDefault();
    clearInputs();
    onClose(false); // Close modal
  };

  const handleBanner = (e) => setBanner(e.target.files[0]);
  const handleProfile = (e) => setProfile(e.target.files[0]);

  const clearInputs = () => {
    setBanner(null);
    setProfile(null);
    setChannel(user?.name || "");
    setDesc(user?.desc ?? "");
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("User data is missing");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      if (banner) formData.append("banner", banner);
      if (profile) formData.append("profile", profile);
      formData.append("name", channel);
      formData.append("desc", desc.trim() || "");

      console.log("FormData being sent:", Object.fromEntries(formData.entries()));

      const res = await services.updateChannelAsync(user._id, formData);
      console.log("Response from server:", res.data);

      if (res?.data?.success) {
        const updatedUser = res.data.channel;
        console.log("Updated User Data:", updatedUser);

        setUser(updatedUser);
        setState((prev) => ({
          ...prev,
          user: updatedUser,
        }));

        clearInputs();
        setLoading(false);

        // ✅ Ensure modal closes after update
        setTimeout(() => {
          onClose(false);
        }, 300);
      } else {
        setError(res?.data?.message );
        setLoading(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Error updating channel");
      console.error("Error updating channel:", error);
      setLoading(false);
    }
  };

  const getImageSource = (file, userImage, defaultImage) => {
    return file ? URL.createObjectURL(file) : userImage || defaultImage;
  };

  return (
    <div className={open ? "edit-channel active" : "edit-channel"}>
      <div className={`wrapper ${state?.theme}`}>
        <div className="banner">
          <img
            src={getImageSource(banner, user?.banner, DefaultBanner)}
            alt="Channel Banner"
            onError={(e) => (e.target.src = DefaultBanner)}
          />
          <label htmlFor="upload-banner">
            <input
              type="file"
              id="upload-banner"
              accept="image/png, image/jpg, image/jpeg"
              style={{ display: "none" }}
              onChange={handleBanner}
            />
            <div className="upload-banner">
              <FaCamera className="camera-icon" />
            </div>
          </label>
        </div>

        <div className="infos">
          <div className="profile-wrapper">
            <img
              src={getImageSource(profile, user?.profile, DefaultProfile)}
              alt="Profile Picture"
              className="avatar"
              onError={(e) => (e.target.src = DefaultProfile)}
            />
            <label htmlFor="upload-profile">
              <input
                type="file"
                id="upload-profile"
                accept="image/png, image/jpg, image/jpeg"
                style={{ display: "none" }}
                onChange={handleProfile}
              />
              <div className="upload-profile">
                <FaCamera className="camera-icon" />
              </div>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="details">
            <input
              required
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              type="text"
              placeholder="Channel Name"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Channel Description"
            />
            {error && <p className="error-message">{error}</p>}
            <div className="actions">
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
