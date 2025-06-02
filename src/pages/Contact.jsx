// src/pages/Contact.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/about.css"; // 공통 스타일 재사용

export default function Contact() {
    const { t } = useTranslation(["contact", "shared"]);

    return (
        <div className="about-container">
            <Helmet>
                <title>{t("contact:title")} | AI 얼굴 실험실</title>
                <meta name="description" content={t("contact:intro")} />
            </Helmet>

            <div className="language-switcher-wrapper">
                <LanguageSwitcher />
            </div>

            <h1 className="about-title">{t("contact:title")}</h1>

            <section className="about-section">
                <p>{t("contact:intro")}</p>
                <p>
                    <strong>{t("contact:emailLabel")}:</strong>{" "}
                    <a href={`mailto:${t("contact:emailAddress")}`}>
                        {t("contact:emailAddress")}
                    </a>
                </p>
                <p>{t("contact:responseTime")}</p>
                <p className="contact-note">{t("contact:note")}</p>
            </section>
        </div>
    );
}
