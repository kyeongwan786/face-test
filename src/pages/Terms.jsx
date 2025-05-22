import React from "react";
import { Helmet } from "react-helmet-async";

export default function Terms() {
    return (
        <div className="container">
            <Helmet>
                <title>이용약관 | AI 얼굴 실험실</title>
                <meta name="description" content="AI 얼굴 실험실 이용에 필요한 이용약관을 확인하세요." />
            </Helmet>
            <h1>이용약관</h1>
            <p>본 사이트는 AI 기반의 테스트 및 예측 결과를 제공하는 재미용 웹사이트입니다.</p>
            <p>모든 결과는 참고용이며, 실제 외모나 성격 등을 판단하는 기준으로 사용해서는 안 됩니다.</p>
            <p>사이트 내의 모든 콘텐츠는 저작권 보호를 받으며, 무단 복제 및 재배포를 금지합니다.</p>
        </div>
    );
}