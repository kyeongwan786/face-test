// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/Footer.css";

export default function Footer() {
    const { t } = useTranslation("shared");

    return (
        <footer className="footer">
            <div className="footer-container">
                <p>© 2025 Ugly Challenge</p>
                <ul className="footer-links">
                    <li><Link to="/about">{t("menu.about")}</Link></li>
                    <li><Link to="/ugly-faq">못생김 FAQ</Link></li>
                    <li><Link to="/mbti-faq">MBTI FAQ</Link></li>
                    <li><Link to="/terms">{t("menu.terms")}</Link></li>
                    <li><Link to="/privacy">{t("menu.privacy")}</Link></li>
                </ul>
            </div>
        </footer>
    );
}
