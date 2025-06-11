// components/ResultThumbnailCard.jsx
import React from "react";

export default function ResultThumbnailCard({ image, tier, score, title, subtitle }) {
    return (
        <div
            id="thumbnail-capture-area"
            style={{
                width: "600px",
                height: "800px",
                padding: "2rem",
                borderRadius: "1rem",
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                fontFamily: "Pretendard, sans-serif",
                color: "#111",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <h1 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>😱 당신의 못생김 점수는</h1>
            <div style={{ textAlign: "center" }}>
                <img
                    src={image}
                    alt="face"
                    style={{ width: "200px", height: "200px", objectFit: "cover", borderRadius: "1rem", border: "4px solid #ccc" }}
                />
                <h2 style={{ fontSize: "2rem", marginTop: "1rem", color: tier?.color }}>{tier?.name}</h2>
                <p style={{ marginTop: "0.5rem", fontSize: "1.2rem" }}>{tier?.desc}</p>
            </div>
            <div style={{ marginTop: "2rem" }}>
                <p style={{ fontSize: "1.5rem" }}>📊 못생김 점수: <strong>{score}%</strong></p>
                <p style={{ fontSize: "1.1rem", marginTop: "0.8rem" }}>🧠 {title}</p>
                <p style={{ fontSize: "1rem", color: "#666" }}>{subtitle}</p>
            </div>
            <footer style={{ fontSize: "0.85rem", color: "#aaa", marginTop: "3rem" }}>
                © AI 얼굴 실험실 (facealchemy.site)
            </footer>
        </div>
    );
}
