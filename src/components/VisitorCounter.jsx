// src/components/VisitorCounter.jsx
import React, { useEffect, useState } from "react";
import "../styles/VisitorCounter.css";

const API_URL = "https://face-test-backend-9txf.onrender.com/"; // ✅ 로컬 Spring Boot 주소

export default function VisitorCounter() {
    const [count, setCount] = useState(null);

    useEffect(() => {
        const visited = sessionStorage.getItem("hasVisited");

        if (!visited) {
            fetch(`${API_URL}/api/visitor/increase`, {
                method: "POST"
            })
                .then(res => res.json())
                .then(data => {
                    setCount(data);
                    sessionStorage.setItem("hasVisited", "true");
                })
                .catch(err => console.error("방문자 수 증가 실패", err));
        } else {
            fetch(`${API_URL}/api/visitor/count`)
                .then(res => res.json())
                .then(data => setCount(data))
                .catch(err => console.error("방문자 수 조회 실패", err));
        }
    }, []);

    if (count === null) return null;

    return (
        <div className="visitor-count-wrapper">
            <p>👁️ 누적 방문자 수: <strong>{count.toLocaleString()}</strong>명</p>
        </div>
    );
}
