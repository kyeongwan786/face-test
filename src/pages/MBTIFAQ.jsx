// src/pages/MBTIFAQ.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function MBTIFAQ() {
    return (
        <div className="container">
            <Helmet>
                <title>AI 관상 MBTI란? | AI 얼굴 실험실</title>
                <meta name="description" content="얼굴 이미지로 관상을 분석해 MBTI를 예측하는 AI 기반 콘텐츠입니다." />
            </Helmet>
            <h1>AI 관상 MBTI란?</h1>
            <p>이 콘텐츠는 얼굴 이미지에서 관상을 분석하여 가장 유사한 MBTI 유형을 예측하는 테스트입니다.</p>
            <p>머신러닝 기반으로 관상에서 나타나는 표정, 눈썹 모양, 얼굴형 등을 학습한 AI가 MBTI와의 상관관계를 추정합니다.</p>

            <h2>정확한가요?</h2>
            <p>재미 콘텐츠이며 과학적 정확도를 보장하지는 않습니다.</p>
            <p>하지만 실제 데이터셋과 사용자 피드백을 바탕으로 지속적으로 개선되고 있습니다.</p>

            <h2>작동 방식</h2>
            <p>Teachable Machine의 이미지 분류 모델을 활용해, 각 MBTI 유형별 얼굴 특징을 학습시켰습니다.</p>
            <p>업로드된 얼굴은 이 모델을 통해 예측되며, 가장 높은 확률을 가진 MBTI 유형으로 결과가 표시됩니다.</p>

            <h2>개인정보 처리</h2>
            <p>업로드한 이미지는 브라우저 내에서만 처리되며, 서버로 전송되거나 저장되지 않습니다.</p>
        </div>
    );
}
