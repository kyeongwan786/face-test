import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function TestSuggestions() {
    const { t } = useTranslation("common");

    const tests = [
        {
            icon: "⚡",
            key: "age",
            path: "/age",
        },
        {
            icon: "☺",
            key: "mbti",
            path: "/mbti",
        },
        {
            icon: "🔍",
            key: "vibe",
            path: "/vibe",
        },
    ];

    return (
        <div className="test-suggestions">
            <h3 className="test-suggestions-title">{t("testSuggestions.title")}</h3>
            <div className="test-suggestions-grid">
                {tests.map((test, idx) => (
                    <Link to={test.path} key={idx} className="test-card">
                        <div className="test-card-icon">{test.icon}</div>
                        <h4 className="test-card-title">{t(`testSuggestions.tests.${test.key}.title`)}</h4>
                        <p className="test-card-desc">{t(`testSuggestions.tests.${test.key}.desc`)}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
