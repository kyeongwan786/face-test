import React from "react";
import "../styles/LoadingSpinner.css";

const LoadingSpinner = () => {
    return (
        <div className="spinner-container">
            <div className="spinner" />
            <p className="loading-text">모델 불러오는 중...</p>
        </div>
    );
};

export default LoadingSpinner;
