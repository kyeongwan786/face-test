// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE, // .env에서 설정
    withCredentials: true, // 세션 쿠키 등을 사용할 경우
});

export default instance;
