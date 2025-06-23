// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE, // .env 파일에 반드시 REACT_APP_API_BASE 정의 필요
    withCredentials: true, // 쿠키를 포함한 CORS 요청 허용
});

// 요청 인터셉터 (선택)
api.interceptors.request.use(
    config => {
        // 필요 시 여기서 헤더 추가 가능
        return config;
    },
    error => Promise.reject(error)
);

// 응답 인터셉터 (선택)
api.interceptors.response.use(
    response => response,
    error => {
        // 공통 에러 처리 예시
        if (error.response?.status === 401) {
            console.warn('인증 오류: 로그인 필요');
        }
        return Promise.reject(error);
    }
);

export default api;
