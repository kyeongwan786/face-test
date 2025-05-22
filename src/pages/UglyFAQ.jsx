// src/pages/UglyFAQ.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function UglyFAQ() {
    return (
        <div className="container">
            <Helmet>
                <title>못생김 측정기란? | AI 얼굴 실험실</title>
                <meta name="description" content="못생김 측정기는 AI가 얼굴 이미지를 기반으로 점수를 예측하는 재미있는 테스트입니다." />
            </Helmet>
            <h1>못생김 측정기란?</h1>
            <p>이 테스트는 Teachable Machine 기반의 이미지 분류 모델을 활용하여 얼굴 이미지로부터 '못생김 점수'를 예측하는 재미 콘텐츠입니다.</p>
            <p>실제 외모를 평가하는 목적이 아닌, AI가 학습한 데이터를 기반으로 한 확률적 유사도 테스트입니다.</p>

            <h2>점수는 어떻게 산정되나요?</h2>
            <p>사용자의 얼굴을 분석하여 특정 클래스로 분류한 후, 해당 클래스의 예측 확률을 기준으로 점수를 산정합니다.</p>
            <p>높은 점수가 나온다고 해서 실제로 못생긴 것이 아니며, 결과는 재미로 봐주세요.</p>

            <h2>주의사항</h2>
            <ul>
                <li>사진은 정면 얼굴이 잘 보이게 업로드해주세요.</li>
                <li>조명, 배경, 각도에 따라 예측 결과가 달라질 수 있습니다.</li>
                <li>모든 결과는 저장되지 않으며, 개인정보를 수집하지 않습니다.</li>
            </ul>
        </div>
    );
}