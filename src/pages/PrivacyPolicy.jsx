// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
    return (
        <div className="container">
            <Helmet>
                <title>개인정보처리방침 | AI 얼굴 실험실</title>
                <meta name="description" content="AI 얼굴 실험실의 개인정보 보호 정책에 대해 안내합니다." />
            </Helmet>
            <h1>개인정보처리방침</h1>
            <p>본 사이트는 사용자로부터 어떠한 개인정보도 수집하지 않습니다.</p>
            <p>사진 업로드는 AI 예측용으로만 사용되며, 서버로 전송되지 않고 즉시 폐기됩니다.</p>
            <p>카카오톡 공유 시 카카오 SDK를 이용하며, 해당 플랫폼의 개인정보 처리방침을 따릅니다.</p>
        </div>
    );
}