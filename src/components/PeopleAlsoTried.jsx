import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function PeopleAlsoTried() {
    const { t } = useTranslation("common");

    const tests = ["age", "mbti", "vibe"];

    return (
        <div className="people-also-tried">
            <h3 className="section-title">{t("peopleAlsoTried.title")}</h3>
            <div className="test-card-grid">
                {tests.map((key) => (
                    <Link to={`/${key}`} key={key} className="test-card">
                        <h4>{t(`peopleAlsoTried.tests.${key}.title`)}</h4>
                        <p>{t(`peopleAlsoTried.tests.${key}.desc`)}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
