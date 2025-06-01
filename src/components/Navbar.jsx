// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Navbar.css";

export default function Navbar() {
    const { t } = useTranslation("shared");
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen((prev) => !prev);
    const handleLinkClick = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* 왼쪽: 로고 */}
                <div className="nav-left">
                    <Link to="/" className="logo">👁️ {t("site.title")}</Link>
                </div>

                {/* 오른쪽: 햄버거 */}
                <button className="hamburger" onClick={toggleMenu} aria-label="메뉴 토글">
                    {isOpen ? "✖" : "☰"}
                </button>

                {/* 아래쪽 펼쳐지는 메뉴 */}
                <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                    <li><Link to="/" className={isActive("/") ? "active" : ""} onClick={handleLinkClick}>{t("menu.home")}</Link></li>
                    <li><Link to="/ugly" className={isActive("/ugly") ? "active" : ""} onClick={handleLinkClick}>{t("menu.ugly")}</Link></li>
                    <li><Link to="/mbti" className={isActive("/mbti") ? "active" : ""} onClick={handleLinkClick}>{t("menu.mbti")}</Link></li>
                    <li><Link to="/age" className={isActive("/age") ? "active" : ""} onClick={handleLinkClick}>{t("menu.age")}</Link></li>
                    <li><Link to="/vibe" className={isActive("/vibe") ? "active" : ""} onClick={handleLinkClick}>{t("menu.vibe")}</Link></li>
                    <li><Link to="/like" className={isActive("/like") ? "active" : ""} onClick={handleLinkClick}>{t("menu.lookalike")}</Link></li>
                    <li><Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={handleLinkClick}>{t("menu.contact")}</Link></li>
                </ul>
            </div>
        </nav>
    );
}
