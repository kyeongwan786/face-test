import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/about.css";

export default function Terms() {
    const { t } = useTranslation(["terms", "shared"]);

    // 조항 번호만 배열로 관리
    const sectionNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <div className="about-container">
            <Helmet>
                <title>{t("terms:title")} | AI 얼굴 실험실</title>
                <meta name="description" content={t("terms:metaDescription")} />
            </Helmet>

            <div className="language-switcher-wrapper">
                <LanguageSwitcher />
            </div>


            <h1 className="about-title">{t("terms:title")}</h1>

            <section className="about-section">
                <p>{t("terms:intro")}</p>
            </section>

            {/* 조항 반복 렌더링 */}
            {sectionNumbers.map((num) => (
                <section key={num} className="about-section">
                    <h2>{t(`terms:section${num}Title`)}</h2>
                    {t(`terms:section${num}Content`)
                        .split("\n")
                        .map((line, i) => (
                            <p key={i}>{line}</p>
                        ))}
                </section>
            ))}

            <footer className="about-footer">
                <p>{t("terms:footer")}</p>
            </footer>
        </div>
    );
}
