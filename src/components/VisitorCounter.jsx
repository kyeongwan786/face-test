import React, { useEffect, useState } from "react";
import "../styles/VisitorCounter.css";

const API_URL = "https://facealchemy.site/"; // 너의 Spring Boot 서버 도메인 주소

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
                });
        } else {
            fetch(`${API_URL}/api/visitor/count`)
                .then(res => res.json())
                .then(data => setCount(data));
        }
    }, []);

    if (count === null) return null;

    return (
        <div className="visitor-count-wrapper">
            <p>👁️ 누적 방문자 수: <strong>{count.toLocaleString()}</strong>명</p>
        </div>
    );
}
