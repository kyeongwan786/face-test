// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/about.css";

export default function PrivacyPolicy() {
    const { t } = useTranslation(["privacy", "shared"]);

    const sectionNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="about-container">
            <Helmet>
                <title>{t("privacy:title")} | AI 얼굴 실험실</title>
                <meta name="description" content={t("privacy:metaDescription")} />
            </Helmet>

            <div className="language-switcher-wrapper">
                <LanguageSwitcher />
            </div>

            <h1 className="about-title">{t("privacy:title")}</h1>

            <section className="about-section">
                <p>{t("privacy:intro")}</p>
            </section>

            {sectionNumbers.map((num) => (
                <section key={num} className="about-section">
                    <h2>{t(`privacy:section${num}Title`)}</h2>
                    {t(`privacy:section${num}Content`)
                        .split("\n")
                        .map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                </section>
            ))}

            <footer className="about-footer">
                <p>{t("privacy:footer")}</p>
            </footer>
        </div>
    );
}
