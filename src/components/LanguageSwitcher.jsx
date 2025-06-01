import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/languageSwitcher.css"; // 경로 확인 필수

export default function LanguageSwitcher() {
    const { i18n, t } = useTranslation("shared");

    const handleChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="language-switcher-wrapper">
            <label htmlFor="language-select" className="language-switcher-label">
                {t("language.selectPrompt")}
            </label>
            <select
                id="language-select"
                value={i18n.language}
                onChange={handleChange}
            >
                <option value="ko">{t("language.ko")}</option>
                <option value="en">{t("language.en")}</option>
                <option value="ja">{t("language.ja")}</option>
                <option value="zh">{t("language.zh")}</option>
                <option value="vi">{t("language.vi")}</option>
            </select>
        </div>
    );
}
