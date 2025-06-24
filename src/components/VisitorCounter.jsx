import React, { useEffect, useState } from "react";
import "../styles/VisitorCounter.css";

// ✅ 백엔드 주소 업데이트
const API_URL = "https://face-test-backend-1-u318.onrender.com";

export default function VisitorCounter() {
    const [todayCount, setTodayCount] = useState(null);
    const [totalCount, setTotalCount] = useState(null);

    useEffect(() => {
        const visited = sessionStorage.getItem("hasVisited");

        const fetchCount = async () => {
            try {
                // 방문자 기록 or 조회
                if (!visited) {
                    const res = await fetch(`${API_URL}/api/visitor/record`, { method: "POST" });
                    if (!res.ok) throw new Error(`API 요청 실패: ${res.status}`);
                    sessionStorage.setItem("hasVisited", "true");
                }

                // 오늘 방문 수
                const todayRes = await fetch(`${API_URL}/api/visitor/today`);
                const totalRes = await fetch(`${API_URL}/api/visitor/total`);

                if (!todayRes.ok || !totalRes.ok) {
                    throw new Error("방문자 수 조회 실패");
                }

                const todayData = await todayRes.json();
                const totalData = await totalRes.json();

                console.log("✅ 방문자 수 응답:", { todayData, totalData });

                setTodayCount(todayData.count ?? 0);
                setTotalCount(totalData.count ?? 0);
            } catch (err) {
                console.error("❌ 방문자 수 처리 실패:", err);
                setTodayCount(0);
                setTotalCount(0);
            }
        };

        fetchCount();
    }, []);

    if (todayCount === null || totalCount === null) {
        return (
            <div className="visitor-count-wrapper">
                <div className="visitor-box loading">
                    <div className="count-label">👁️ 방문자 수 불러오는 중...</div>
                </div>
            </div>
        );
    }

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
