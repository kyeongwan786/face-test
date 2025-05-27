import React, { useEffect, useState } from "react";
import "../styles/VisitorCounter.css";

const API_URL = "https://face-test-backend-9txf.onrender.com";

export default function VisitorCounter() {
    const [todayCount, setTodayCount] = useState(null);
    const [totalCount, setTotalCount] = useState(null);

    useEffect(() => {
        const visited = sessionStorage.getItem("hasVisited");

        const fetchCount = async () => {
            try {
                const path = visited ? "api/visitor/count" : "api/visitor/increase";
                const res = await fetch(`${API_URL}/${path}`, {
                    method: visited ? "GET" : "POST"
                });

                if (!res.ok) {
                    throw new Error(`API 요청 실패: ${res.status}`);
                }

                const data = await res.json();
                console.log("✅ 방문자 수 응답:", data);

                setTodayCount(data.today ?? 0);
                setTotalCount(data.total ?? 0);

                if (!visited) {
                    sessionStorage.setItem("hasVisited", "true");
                }
            } catch (err) {
                console.error("❌ 방문자 수 처리 실패:", err);
                setTodayCount(0);
                setTotalCount(0);
            }
        };

        fetchCount();
    }, []);

    if (todayCount === null || totalCount === null) return null;

    return (
        <div className="visitor-count-wrapper">
            <div className="visitor-box">
                <div className="count-label">👁️ 오늘 방문자</div>
                <div className="count-number">{todayCount.toLocaleString()}명</div>
            </div>
            <div className="visitor-box">
                <div className="count-label">🌍 총 방문자</div>
                <div className="count-number">{totalCount.toLocaleString()}명</div>
            </div>
        </div>
    );
}
