import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "../styles/mbti.css";
import { loadMBTIModelByGender, predictMBTIImage } from "../utils/runMBTIModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import CommentSection from "../components/CommentSection";


export default function MBTIByFace() {
    const { t } = useTranslation(["mbti", "common"]);
    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [mbti, setMBTI] = useState(null);
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamDone, setWebcamDone] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const videoRef = useRef(null);
    const videoWrapperRef = useRef(null);

    // ✅ 광고 스크립트 삽입 (한 번만)
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (useWebcam) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setWebcamReady(true);
                        setWebcamStream(stream);
                    };
                })
                .catch(() => alert(t("error.webcam")));
        }
    }, [useWebcam, t]);

    const predictFromImage = async (img) => {
        await loadMBTIModelByGender(gender);
        const preds = await predictMBTIImage(img);
        const best = preds.reduce((a, b) => a.probability > b.probability ? a : b);
        setMBTI(best.className);
        const rawKeywords = t(`keywords.${best.className}`, { returnObjects: true });
        setKeywords(Array.isArray(rawKeywords) ? rawKeywords : []);
        setModalOpen(true);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
            const img = new Image();
            img.src = reader.result;
            img.onload = () => predictFromImage(img).finally(() => setLoading(false));
            setLoading(true);
        };
        reader.readAsDataURL(file);
    };

    const captureFromWebcam = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL("image/jpeg");
        setImage(img.src);
        webcamStream?.getTracks().forEach((t) => t.stop());
        await predictFromImage(img);
        setWebcamDone(true);
        setWebcamReady(false);
        setWebcamStream(null);
        setLoading(false);
    };

    const reset = () => {
        setImage(null);
        setMBTI(null);
        setModalOpen(false);
        setKeywords([]);
        setWebcamDone(false);
        webcamStream?.getTracks().forEach((t) => t.stop());
        setWebcamStream(null);
        setUseWebcam(false);
    };

    return (
        <div className="page">
            <Helmet>
                <title>관상 MBTI 분석기 | AI 얼굴 실험실</title>
                <meta name="description" content="AI가 당신의 얼굴만 보고 MBTI를 예측합니다. ISTJ부터 ENFP까지, 관상으로 분석해보자!" />
                <meta property="og:title" content="관상 MBTI 분석기 | AI 얼굴 실험실" />
                <meta property="og:description" content="얼굴로 보는 MBTI, AI가 관상으로 성격을 분석합니다. 병맛 + 놀라움 보장!" />
                <meta property="og:image" content="/meta/mbti.png" />
                <meta property="og:url" content="https://facealchemy.site/mbti" />
                <meta property="og:type" content="website" />
            </Helmet>

            <div className="language-switcher-wrapper"><LanguageSwitcher /></div>

            <div className="container">
                <header>
                    <h1>{t("title")}</h1>
                    <p className="subtitle">{t("subtitle")}</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => setUseWebcam(false)}>
                        {t("uploadMode")}
                    </button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => {
                        setUseWebcam(true);
                        setTimeout(() => videoWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
                    }}>
                        {t("webcamMode")}
                    </button>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (!image && !useWebcam ? (
                    <div className="upload-wrapper">
                        <label className="upload-box" htmlFor="uploadInput">
                            <span className="upload-label">{t("uploadLabel")}</span>
                        </label>
                        <input
                            id="uploadInput"
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleUpload}
                        />
                    </div>
                ) : useWebcam && !webcamDone ? (
                    <div className="webcam-wrapper active" ref={videoWrapperRef}>
                        <video ref={videoRef} autoPlay muted playsInline width="320" className="video-frame" />
                        <div className="webcam-overlay-text">{webcamReady ? t("webcamReady") : t("webcamNotReady")}</div>
                        {webcamReady && <button className="btn-analyze" onClick={captureFromWebcam}>{t("analyzeButton")}</button>}
                    </div>
                ) : null)}
            </div>

            {modalOpen && (
                <div className="overlay-blur">
                    <div className="result-modal mbti-style">
                        <p className="modal-main-title">{t("yourMBTIis")}</p>
                        <div className="photo-box mbti">
                            <img src={image} alt="uploaded" />
                        </div>
                        <h2 className="mbti-code">{mbti}</h2>
                        <p className="mbti-nickname">{t(`highlightLine.${mbti}`)}</p>

                        <div className="badge-box">
                            <span className="badge">{t(`titles.${mbti}`)}</span>
                        </div>

                        <div className="mbti-desc-box">
                            <p>{t(`desc.${mbti}`)}</p>
                        </div>

                        <div className="keyword-list">
                            {keywords.map((k) => <span key={k} className="tag">{k}</span>)}
                        </div>

                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>{t("retryButton")}</button>
                            <button className="btn-kakao">{t("shareKakao")}</button>
                        </div>

                        <div className="other-tests-box">
                            <p className="section-title">{t("common:testSuggestions.title")}</p>
                            <div className="test-suggestions">
                                <Link to="/age" className="test-suggestion-card">
                                    <span className="test-emoji">📷</span>
                                    <div className="test-text">
                                        <strong>{t("common:testSuggestions.tests.age.title")}</strong>
                                        <p>{t("common:testSuggestions.tests.age.desc")}</p>
                                    </div>
                                </Link>
                                <Link to="/vibe" className="test-suggestion-card">
                                    <span className="test-emoji">💖</span>
                                    <div className="test-text">
                                        <strong>{t("common:testSuggestions.tests.vibe.title")}</strong>
                                        <p>{t("common:testSuggestions.tests.vibe.desc")}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <button className="modal-close" onClick={reset}>×</button>
                    </div>
                </div>
            )}
            <CommentSection postId={1001} />



            {/* ✅ 광고: PC용 */}
            <div className="ad-pc-banner">
                <ins className="kakao_ad_area"
                     style={{ display: "block", width: "300px", height: "250px", margin: "2rem auto" }}
                     data-ad-unit="DAN-2VAMRfWJcabygl9x"
                     data-ad-width="300"
                     data-ad-height="250"></ins>
            </div>

            {/* ✅ 광고: 모바일 띠배너 */}
            <div className="ad-mobile-fixed">
                <ins className="kakao_ad_area"
                     style={{ display: "block", width: "100%", height: "50px" }}
                     data-ad-unit="DAN-vq03WNxmpMBMVvd5"
                     data-ad-width="320"
                     data-ad-height="50"></ins>
            </div>
        </div>
    );
}
