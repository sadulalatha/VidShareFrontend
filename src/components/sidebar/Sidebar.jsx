
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import "./sidebar.css";
import { NavLink } from "react-router-dom";
import { FaLayerGroup } from "react-icons/fa";
import {
  FaHouse,
  FaGear,
  FaFlag,
  FaCirclePlay,
  FaCircleQuestion,
  FaCircleHalfStroke,
  FaClockRotateLeft,
} from "react-icons/fa6";

export default function Sidebar({ channelId }) {
  const { state, toggleTheme, toggleMenu } = useContext(AppContext);
  const authUser = state?.auth;

  return (
    <div className={state?.onMenu ? "sidebar active" : "sidebar"}>
      <div className={`sidebar-wrapper ${state?.theme}`}>
        <NavLink to="/" onClick={toggleMenu}>
          <FaHouse className="sidebar-icon" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/videos/history" onClick={toggleMenu}>
          <FaClockRotateLeft className="sidebar-icon" />
          <span>History</span>
        </NavLink>

        {authUser && (
          <NavLink to={`/channel/${channelId}`} onClick={toggleMenu}>
            <FaCirclePlay className="sidebar-icon" />
            <span>My Videos</span>
          </NavLink>
        )}

        <div className="toggle-theme" onClick={toggleTheme}>
          <FaCircleHalfStroke className="sidebar-icon" />
          <span>Dark Mode</span>
        </div>

        {!authUser && (
          <>
            <hr className="separator" />
            <div className="auth">
              <p>Sign in to like videos, comment and subscribe.</p>
              <NavLink className="login-btn" to="/login" onClick={toggleMenu}>
                Sign In
              </NavLink>
            </div>
          </>
        )}

        <hr className="separator" />

        <div className="terms">
          <div className="terms-wrapper">
            <span>Terms of Services</span>
            <span>Pricacy Policy and Safety</span>
          </div>
          <span className="terms-rights">
            VidShare © 2025 copyright all rights reserved.
          </span>
        </div>
      </div>
      <div className="close-sidebar" onClick={toggleMenu}></div>
    </div>
  );
}
