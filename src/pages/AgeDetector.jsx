import React from "react";
import "../styles/App.css";

export default function AgeDetector() {
    return (
        <div className="container">
            <header>
                <h1>얼굴 나이 측정기</h1>
                <p className="subtitle">사진 속 얼굴로 AI가 나이를 예측합니다.</p>
            </header>

            <label className="upload-box">
                <span className="upload-label">📸 기능 준비 중</span>
                <span className="upload-tip">조만간 오픈됩니다!</span>
            </label>

        </div>
    );
}
