import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/ugly.css";

export default function GenderSelector({ gender, setGender }) {
    const { t } = useTranslation("gender");

    return (
        <div className="gender-selector">
            <label>{t("selectGender")}</label>
            <div className="gender-buttons">
                <button
                    type="button"
                    className={`gender-button ${gender === "male" ? "active-male" : ""}`}
                    onClick={() => {
                        console.log("👦 모델: 남자 선택됨");
                        setGender("male");
                    }}
                >
                    {t("male")}
                </button>
                <button
                    type="button"
                    className={`gender-button ${gender === "female" ? "active-female" : ""}`}
                    onClick={() => {
                        console.log("👧 모델: 여자 선택됨");
                        setGender("female");
                    }}
                >
                    {t("female")}
                </button>
            </div>
        </div>
    );
}
