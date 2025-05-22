// src/components/GenderSelector.jsx
import React from "react";
import "../styles/ugly.css";

export default function GenderSelector({ gender, setGender }) {
    return (
        <div className="gender-selector">
            <label>성별을 선택하세요:</label>
            <div className="gender-buttons">
                <button
                    type="button"
                    className={`gender-button ${gender === "female" ? "active-female" : ""}`}
                    onClick={() => setGender("female")}
                >
                    여자
                </button>
                <button
                    type="button"
                    className={`gender-button ${gender === "male" ? "active-male" : ""}`}
                    onClick={() => setGender("male")}
                >
                    남자
                </button>
            </div>
        </div>
    );
}
