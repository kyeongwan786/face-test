import React, { useState, useRef, useEffect } from "react";
import { loadLikeModel, runLikeEstimation } from "../utils/runLikeModel";
import { likePresets } from "../utils/likePresets";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/common.css";
import "../styles/like.css";

import { Helmet } from "react-helmet";
import CommentSection from "../components/CommentSection";





export default function Like() {
    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const videoRef = useRef(null);
    const modalRef = useRef(null);
    const webcamWrapperRef = useRef(null);
    const inputBoxRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY < 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        // Kakao SDK 로딩
        if (!window.Kakao) {
            const script = document.createElement("script");
            script.src = "https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js";
            script.onload = () => window.Kakao.init("d3f8af96c1e986cbfb2216380f1ea8e7");
            document.head.appendChild(script);
        }

        // 광고 스크립트
        const adScript = document.createElement("script");
        adScript.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        adScript.async = true;
        document.body.appendChild(adScript);
    }, []);

    const scrollToInput = () => {
        inputBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleModeClick = (webcam) => {
        setUseWebcam(webcam);
        setTimeout(() => {
            if (webcam) {
                webcamWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
                scrollToInput();
            }
        }, 100);
    };

    useEffect(() => {
        if (useWebcam) {
            setWebcamReady(false);
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.onloadedmetadata = () => {
                            videoRef.current.play();
                            setWebcamReady(true);
                            setWebcamStream(stream);
                        };
                    }
                })
                .catch((err) => {
                    alert("웹캠 접근에 실패했습니다.");
                    console.error(err);
                });
        }
    }, [useWebcam]);

    const captureFromWebcam = async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL("image/jpeg");
        setImage(img.src);
        setLoading(true);
        webcamStream?.getTracks().forEach((track) => track.stop());

        try {
            await loadLikeModel(gender);
            await img.decode();
            const result = await runLikeEstimation(img, gender);
            setResult(result);
            setModalOpen(true);
        } catch (err) {
            alert("이미지 분석 실패");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            const imgSrc = reader.result;
            setImage(imgSrc);
            setLoading(true);
            try {
                await loadLikeModel(gender);
                const img = new Image();
                img.src = imgSrc;
                img.onload = async () => {
                    const result = await runLikeEstimation(img, gender);
                    setResult(result);
                    setModalOpen(true);
                };
            } catch (err) {
                alert("모델 로딩 실패");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        setModalOpen(false);
        setWebcamStream(null);
        setUseWebcam(false);
        if (inputRef.current) {
            inputRef.current.value = null;
        }
    };

    const shareKakao = () => {
        if (!window.Kakao || !window.Kakao.isInitialized()) {
            alert("카카오 SDK가 준비되지 않았습니다.");
            return;
        }

        const label = result?.label || "연예인";
        window.Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title: `AI 닮은꼴 테스트 결과: ${label}`,
                description: `나는 ${label} 님과 닮았대요! 당신은?`,
                imageUrl: image,
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: "나도 측정하기",
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    };

    return (
        <div className="page">
            <Helmet>
                <title>연예인 닮은꼴 찾기 | AI 얼굴 실험실</title>
                <meta name="description" content="당신은 과연 어떤 연예인과 닮았을까요? AI가 얼굴을 분석해 닮은꼴 연예인을 찾아드립니다!" />
                <meta property="og:title" content="연예인 닮은꼴 찾기 | AI 얼굴 실험실" />
                <meta property="og:description" content="사진만 올리면 AI가 닮은 연예인을 찾아줍니다! 병맛 보장, 연예인 소환!" />
                <meta property="og:image" content="/meta/lookalike.png" />
                <meta property="og:url" content="https://facealchemy.site/lookalike" />
                <meta property="og:type" content="website" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="연예인 닮은꼴 찾기 | AI 얼굴 실험실" />
                <meta name="twitter:description" content="나랑 닮은 연예인이 누군지 궁금해? AI가 얼굴만 보고 알려준다!" />
                <meta name="twitter:image" content="/meta/lookalike.png" />
            </Helmet>
            <div className="container">
                <header>
                    <h1 className="section-title">연예인 닮은꼴 테스트</h1>
                    <p className="section-sub">나와 가장 닮은 연예인은 누구일까? AI가 얼굴을 분석해 알려드려요!</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => handleModeClick(false)}>
                        사진 업로드하기
                    </button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => handleModeClick(true)}>
                        실시간으로 분석하기
                    </button>
                </div>

                {!useWebcam && (
                    <label className="upload-box" ref={inputBoxRef}>
                        <span className="upload-label">사진 올리기</span>
                        <input type="file" accept="image/*" hidden onChange={handleUpload} ref={inputRef} />
                    </label>
                )}

                {useWebcam && (
                    <div className="webcam-wrapper" ref={webcamWrapperRef}>
                        <video ref={videoRef} autoPlay muted playsInline className="video-frame" />
                        <div className="webcam-overlay-text">
                            {webcamReady ? "분석을 시작하세요" : "웹캠 준비 중..."}
                        </div>
                        {webcamReady && (
                            <button className="capture-button" onClick={captureFromWebcam}>분석 시작</button>
                        )}
                    </div>
                )}

                {loading && <LoadingSpinner />}
            </div>

            {showScrollButton && (
                <button className="go-analyze-button" onClick={scrollToInput}>🔍 분석하러 가기</button>
            )}

            {modalOpen && result && (
                <div className="overlay-blur" onClick={(e) => e.target.classList.contains("overlay-blur") && reset()}>
                    <div className="result-modal like-result-modal" ref={modalRef}>
                        <div className="like-photo-wrapper">
                            <img src={image} alt="user" className="modal-photo-circle like-photo" />
                        </div>
                        <h2 className="like-label">닮은 연예인: “{result.label}”</h2>
                        <p className="like-comment">AI 분석 결과, 당신은 <strong>{result.label}</strong> 님과 {result.confidence}% 닮았어요!</p>
                        {likePresets[result.label]?.description && (
                            <p className="like-description">
                                🧠 왜 닮았을까요? <br />{likePresets[result.label].description}
                            </p>
                        )}
                        <div className="modal-buttons like-buttons">
                            <button onClick={reset}>다시하기</button>
                            <button className="btn-kakao" onClick={shareKakao}>카카오톡 공유</button>
                        </div>
                    </div>
                </div>
            )}
            <CommentSection postId={1002} />


            {/* PC 광고 */}
            <div className="ad-pc-banner">
                <ins className="kakao_ad_area"
                     style={{ display: "block", width: "100%", maxWidth: 300, margin: "1rem auto" }}
                     data-ad-unit="DAN-2VAMRfWJcabygl9x"
                     data-ad-width="300"
                     data-ad-height="250"></ins>
            </div>

            {/* 모바일 띠배너 */}
            <div className="ad-mobile-fixed">
                <ins className="kakao_ad_area"
                     style={{ display: "block", width: 320, height: 50 }}
                     data-ad-unit="DAN-vq03WNxmpMBMVvd5"
                     data-ad-width="320"
                     data-ad-height="50"></ins>
            </div>
        </div>
    );
}
