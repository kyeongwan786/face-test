import React, { useEffect, useState } from "react";
import "../styles/VisitorCounter.css";

// 슬래시(/) 없이 끝나도록 수정
const API_URL = "https://face-test-backend-9txf.onrender.com";

export default function VisitorCounter() {
    const [count, setCount] = useState(null);

    useEffect(() => {
        const visited = sessionStorage.getItem("hasVisited");

        const fetchCount = async () => {
            try {
                const url = visited
                    ? `${API_URL}/api/visitor/count`
                    : `${API_URL}/api/visitor/increase`;
                const res = await fetch(url, {
                    method: visited ? "GET" : "POST"
                });
                const data = await res.json();
                setCount(data.count ?? data); // 숫자만 저장
                if (!visited) {
                    sessionStorage.setItem("hasVisited", "true");
                }
            } catch (err) {
                console.error("방문자 수 처리 실패", err);
            }
        };

        fetchCount();
    }, []);

    if (count === null) return null;

    return (
        <div className="visitor-count-wrapper">
            <p>👁️ 누적 방문자 수: <strong>{count.toLocaleString()}</strong>명</p>
        </div>
    );
}
