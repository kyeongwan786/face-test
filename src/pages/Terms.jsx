import React from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import LanguageSwitcher from "../components/LanguageSwitcher"; // ✅ 언어 선택 컴포넌트
import "../styles/about.css"; // 공통 스타일 재사용 가능

export default function Terms() {
    const { t } = useTranslation(["terms", "shared"]); // ✅ terms + shared 네임스페이스

    return (
        <div className="about-container">
            <Helmet>
                <title>{t("terms:title")} | AI 얼굴 실험실</title>
                <meta name="description" content={t("terms:metaDescription")} />
            </Helmet>

            {/* 언어 선택 */}
            <div className="language-switcher-wrapper">
                <span className="language-switcher-label">
                    {t("shared:language.selectPrompt") || "언어 선택"}
                </span>
                <LanguageSwitcher />
            </div>

            <h1 className="about-title">{t("terms:title")}</h1>

            <section className="about-section">
                <p>{t("terms:intro1")}</p>
                <p>{t("terms:intro2")}</p>
                <p>{t("terms:intro3")}</p>
            </section>
        </div>
    );
}
