// src/pages/Main.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import VisitorCounter from "../components/VisitorCounter";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/common.css";
import "../styles/main.css";
import "../styles/VisitorCounter.css";

export default function Main() {
    const { t } = useTranslation("main");

    useEffect(() => {
        // 카카오 애드핏 스크립트 삽입 (한 번만)
        const adScript = document.createElement("script");
        adScript.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        adScript.async = true;
        document.body.appendChild(adScript);
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <header className="hero">
                <h1>{t("hero.title")}</h1>
                <p className="hero-subtitle">{t("hero.subtitle")}</p>
                <div className="hero-buttons">
                    <Link to="/ugly" className="btn primary">
                        {t("hero.uglyBtn")}
                    </Link>
                    <Link to="/mbti" className="btn secondary">
                        {t("hero.mbtiBtn")}
                    </Link>
                </div>
            </header>

            {/* 언어 선택 */}
            <div className="language-switcher-wrapper" style={{ textAlign: "right", padding: "1rem" }}>
                <LanguageSwitcher />
            </div>

            {/* 카드 영역 */}
            <section className="cards">
                {["ugly", "mbti", "age", "vibe", "lookalike"].map((key) => (
                    <div className="card" id={key} key={key}>
                        <div className="emoji">{t(`cards.${key}.emoji`)}</div>
                        <h3>{t(`cards.${key}.title`)}</h3>
                        <p>{t(`cards.${key}.desc`)}</p>
                        <Link to={`/${key === "lookalike" ? "like" : key}`} className="card-btn">
                            {t(`cards.${key}.cta`)}
                        </Link>
                    </div>
                ))}
            </section>

            {/* 방문자 수 카운터 */}
            <VisitorCounter />

            {/* 카카오 애드핏 광고 삽입 */}
            <div style={{ textAlign: "center", margin: "2.5rem auto" }}>
                <ins
                    className="kakao_ad_area"
                    style={{
                        display: "block",
                        width: "100%",
                        maxWidth: "300px",
                        margin: "0 auto"
                    }}
                    data-ad-unit="DAN-HnW0xoFCrjMWyDYg"
                    data-ad-width="250"
                    data-ad-height="250"
                ></ins>
            </div>
        </div>
    );
}
