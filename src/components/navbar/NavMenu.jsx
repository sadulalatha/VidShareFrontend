

import Avatar from "../custom/Avatar";
import "./navmenu.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaGear,
  FaFlag,
  FaCircleQuestion,
  FaCircleHalfStroke,
} from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";
import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";

export default function NavMenu({ open, onClose }) {
  const { state, logout, toggleTheme } = useContext(AppContext);
  const authUser = state?.channel;
  const menuRef = useRef(null);
  const navigate=useNavigate()

  // Handle clicks outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && open) {
        onClose(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Stop click propagation to prevent closing
  const handleMenuItemClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={open ? "nav-menu active" : "nav-menu"} onClick={handleMenuItemClick}>
      <div ref={menuRef} className={`nav-menu-wrapper ${state?.theme}`}>
        {authUser && (
          <NavLink
            to={`channel/${authUser?._id}`}
            className="nav-menu-avatar"
            onClick={handleMenuItemClick} // Prevent propagation
          >
            <Avatar size={40} profile={authUser?.profile} />
            <div className="nav-menu-infos">
              <h4>{authUser?.name}</h4>
              <span>View Channel</span>
            </div>
          </NavLink>
        )}

        <div className="nav-menu-links">
          {authUser ? (
            <div
              className="nav-menu-item"
              onClick={(e) => {
                e.stopPropagation(); // Prevent propagation
                logout();
                onClose(false); // Close on logout
                navigate("/");
              }}
            >
              <FiLogOut className="nav-menu-icon" />
              <span>Logout</span>
            </div>
          ) : (
            <div className="auth">
              <p>Sign in to like videos, comment and subscribe.</p>
              <NavLink
                className="login-btn"
                to="/login"
                onClick={handleMenuItemClick} // Prevent propagation
              >
                Sign In
              </NavLink>
            </div>
          )}
          <div
            className="nav-menu-item"
            onClick={(e) => {
              e.stopPropagation(); // Prevent propagation
              toggleTheme();
            }}
          >
            <FaCircleHalfStroke className="nav-menu-icon" />
            <span>Dark Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
}