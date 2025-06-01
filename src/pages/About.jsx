import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import LanguageSwitcher from "../components/LanguageSwitcher"; // 언어 선택 UI
import "../styles/about.css"; // 스타일 적용

export default function About() {
    const { t } = useTranslation(["about", "shared"]);

    return (
        <div className="about-container">
            <Helmet>
                <title>{t("about:title") || ""} | AI 얼굴 실험실</title>
                <meta name="description" content={t("about:intro") || ""} />
            </Helmet>

            <div className="language-switcher-wrapper">
                <LanguageSwitcher />
            </div>

            <h1 className="about-title">{t("about:title")}</h1>
            <p className="about-intro">{t("about:intro")}</p>

            <section className="about-section">
                <h2>{t("about:featuresTitle")}</h2>
                <ul>
                    <li>{t("about:features.ugly")}</li>
                    <li>{t("about:features.mbti")}</li>
                    <li>{t("about:features.age")}</li>
                    <li>{t("about:features.vibe")}</li>
                    <li>{t("about:features.lookalike")}</li>
                </ul>
            </section>

            <section className="about-section">
                <h2>{t("about:techTitle")}</h2>
                <p>{t("about:tech")}</p>
            </section>

            <section className="about-section">
                <h2>{t("about:privacyTitle")}</h2>
                <p>{t("about:privacy")}</p>
            </section>

            <section className="about-section">
                <h2>{t("about:disclaimerTitle")}</h2>
                <p>{t("about:disclaimer")}</p>
            </section>

            <section className="about-section">
                <h2>{t("about:usageTitle")}</h2>
                <p>{t("about:usage")}</p>
            </section>
        </div>
    );
}
