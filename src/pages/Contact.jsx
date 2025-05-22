import React from "react";
import { Helmet } from "react-helmet-async";

export default function Contact() {
    return (
        <div className="container">
            <Helmet>
                <title>문의 | AI 얼굴 실험실</title>
                <meta name="description" content="AI 얼굴 실험실에 대한 문의는 이메일을 통해 가능합니다." />
            </Helmet>
            <h1>문의하기</h1>
            <p>사이트 관련 문의는 아래 이메일로 연락해주세요.</p>
            <p>📧 rkw2115@gmail.com</p>
        </div>
    );
}