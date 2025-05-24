// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(prev => !prev);
    const handleLinkClick = () => setIsOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* 왼쪽: 로고 */}
                <div className="nav-left">
                    <Link to="/" className="logo">👁️ AI 얼굴 실험실</Link>
                </div>

                {/* 오른쪽: 햄버거 */}
                <button className="hamburger" onClick={toggleMenu} aria-label="메뉴 토글">
                    {isOpen ? "✖" : "☰"}
                </button>

                {/* 아래쪽 펼쳐지는 메뉴 */}
                <ul className={`nav-links ${isOpen ? "open" : ""}`}>
                    <li><Link to="/" className={isActive("/") ? "active" : ""} onClick={handleLinkClick}>홈</Link></li>
                    <li><Link to="/ugly" className={isActive("/ugly") ? "active" : ""} onClick={handleLinkClick}>못생김 테스트</Link></li>
                    <li><Link to="/mbti" className={isActive("/mbti") ? "active" : ""} onClick={handleLinkClick}>관상 MBTI</Link></li>
                    <li><Link to="/faceage" className={isActive("/faceage") ? "active" : ""} onClick={handleLinkClick}>액면가 테스트</Link></li>
                    <li><Link to="/firstface" className={isActive("/firstface") ? "active" : ""} onClick={handleLinkClick}>첫인상 테스트</Link></li>
                    <li><Link to="/like" className={isActive("/like") ? "active" : ""} onClick={handleLinkClick}>연예인 닮은꼴</Link></li>
                    <li><Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={handleLinkClick}>문의</Link></li>
                </ul>
            </div>
        </nav>
    );
}
