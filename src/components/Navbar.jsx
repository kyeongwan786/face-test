// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css"; // ✅ 경로 확인!

export default function Navbar() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo">👁️ AI 얼굴 실험실</Link>
                <ul className="nav-links">
                    <li><Link to="/" className={isActive("/") ? "active" : ""}>홈</Link></li>
                    <li><Link to="/ugly" className={isActive("/ugly") ? "active" : ""}>못생김 테스트</Link></li>
                    <li><Link to="/mbti" className={isActive("/mbti") ? "active" : ""}>관상 MBTI</Link></li>
                    <li><Link to="/faceage" className={isActive("/faceage") ? "active" : ""}>액면가 테스트</Link></li>
                    <li><Link to="/firstface" className={isActive("/firstface") ? "active" : ""}>첫인상 테스트</Link></li>
                    <li><Link to="/like" className={isActive("/like") ? "active" : ""}>연예인 닮은꼴 찾기</Link></li>
                    <li><Link to="/contact" className={isActive("/contact") ? "active" : ""}>문의</Link></li>
                </ul>
            </div>
        </nav>
    );
}
