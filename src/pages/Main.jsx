// src/pages/Main.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import VisitorCounter from "../components/VisitorCounter"; // ✅ 추가
import "../styles/common.css";
import "../styles/main.css";
import "../styles/VisitorCounter.css"; // ✅ 스타일도 연결

export default function Main() {
    useEffect(() => {
        const adScript = document.createElement("script");
        adScript.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        adScript.async = true;
        document.body.appendChild(adScript);
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <header className="hero">
                <h1><span className="highlight">AI</span> 얼굴 분석 실험실</h1>
                <p className="hero-subtitle">
                    재미있고 중독성 있는 얼굴 기반 테스트!<br />
                    못생김 수치부터 관상 MBTI까지, AI가 판단합니다.
                </p>
                <div className="hero-buttons">
                    <Link to="/ugly" className="btn primary">👀 못생김 테스트</Link>
                    <Link to="/mbti" className="btn secondary">🧠 관상 MBTI</Link>
                </div>
            </header>

            {/* 콘텐츠 카드 영역 */}
            <section className="cards">
                {/* 카드들 */}
                <div className="card" id="ugly">
                    <div className="emoji">😵</div>
                    <h3>못생김 수치 테스트</h3>
                    <p>AI가 당신의 못생김 정도를 수치화하고 티어로 보여드립니다.</p>
                    <Link to="/ugly" className="card-btn">테스트 시작</Link>
                </div>
                <div className="card" id="mbti">
                    <div className="emoji">🧠</div>
                    <h3>관상으로 보는 MBTI</h3>
                    <p>얼굴 생김새로 성격 유형을 AI가 분석합니다.</p>
                    <Link to="/mbti" className="card-btn">예측해보기</Link>
                </div>
                <div className="card" id="soon">
                    <div className="emoji">📸</div>
                    <h3>AI 액면가 측정기</h3>
                    <p>사진 속 얼굴 나이를 AI가 예측합니다. (곧 출시)</p>
                    <Link to="/age" className="card-btn disabled">준비 중</Link>
                </div>
                <div className="card">
                    <div className="emoji">😍</div>
                    <h3>AI 첫인상 분석</h3>
                    <p>AI가 평가한 첫인상 분석! (예정)</p>
                    <Link to="/first" className="card-btn disabled">준비 중</Link>
                </div>
                <div className="card">
                    <div className="emoji">😍</div>
                    <h3>연예인 닮은꼴 찾기</h3>
                    <p>AI가 찾은 당신과 닮은 연예인! (예정)</p>
                    <Link to="/like" className="card-btn disabled">준비 중</Link>
                </div>
            </section>

            {/* ✅ 방문자 수 카운터 위치 */}
            <VisitorCounter />

            {/* 광고 삽입 영역 */}
            <div style={{ textAlign: "center", margin: "2.5rem auto" }}>
                <ins className="kakao_ad_area"
                     style={{ display: "none" }}
                     data-ad-unit="DAN-HnW0xoFCrjMWyDYg"
                     data-ad-width="250"
                     data-ad-height="250"
                ></ins>
            </div>
        </div>
    );
}
