import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>© 2025 Ugly Challenge</p>
                <ul className="footer-links">
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/ugly-faq">못생김 FAQ</Link></li>
                    <li><Link to="/mbti-faq">MBTI FAQ</Link></li>
                    <li><Link to="/terms">이용약관</Link></li>
                    <li><Link to="/privacy">개인정보처리방침</Link></li>
                </ul>
            </div>
        </footer>
    );
}
