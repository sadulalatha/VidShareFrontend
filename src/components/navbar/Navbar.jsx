

import "./navbar.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiVideoAddFill } from "react-icons/ri";
import { HiDotsHorizontal } from "react-icons/hi";
import Avatar from "../custom/Avatar";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import NavMenu from "./NavMenu";
import Sidebar from "../sidebar/Sidebar";

export default function Navbar() {
    const { state, toggleMenu } = useContext(AppContext);
    const [onMenu, setOnMenu] = useState(false);
    const [toSearch, setToSearch] = useState("");
    const [onSearch, setOnSearch] = useState(false);
    const authUser = state?.channel;
    const navigate = useNavigate();

    // Debug logs to verify data
    console.log("Navbar authUser:", authUser);
    console.log("Navbar profile URL:", authUser?.profile);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!toSearch) return;
        navigate(`/search?search=${toSearch}`);
    };

    return (
        <>
            <div className={`navbar ${state?.theme}`}>
                <div className="nav-wrapper">
                    <div className={onSearch ? "nav-left mobile-search" : "nav-left"}>
                        <Link to="/" className="logo">
                            <span>Vid</span>
                            <span className="tube">Share</span>
                        </Link>
                    </div>

                    <div className={onSearch ? "nav-center active" : "nav-center"}>
                        <div className="nav-icon mobile" onClick={() => setOnSearch(false)}>
                            <FaArrowLeft />
                        </div>
                        <form onSubmit={handleSearch} className="nav-form">
                            <input
                                value={toSearch}
                                onChange={(e) => setToSearch(e.target.value)}
                                type="search"
                                placeholder="Search..."
                            />
                            <button type="submit">
                                <FiSearch />
                            </button>
                        </form>
                    </div>

                    <div className={onSearch ? "nav-right mobile-search" : "nav-right"}>
                        <div
                            className="nav-icon mobile"
                            onClick={() => setOnSearch((prev) => !prev)}
                        >
                            <FiSearch />
                        </div>

                        {authUser && (
                            <>
                                <NavLink to="/upload" className="nav-icon">
                                    <RiVideoAddFill />
                                </NavLink>
                            </>
                        )}

                        <div
                            className="nav-icon"
                            onClick={() => setOnMenu((prev) => !prev)}
                        >
                            <div className="nav-avatar">
                                {authUser ? (
                                    <Avatar size={34} profile={authUser.profile} />
                                ) : (
                                    <HiDotsHorizontal />
                                )}
                            </div>
                        </div>
                        <div className="nav-icon" onClick={toggleMenu}>
                            <GiHamburgerMenu />
                        </div>
                    </div>

                    <NavMenu open={onMenu} onClose={setOnMenu} />
                </div>
            </div>

            <Sidebar />
        </>
    );
}








