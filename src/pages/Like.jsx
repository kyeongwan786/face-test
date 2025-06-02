import React, { useState, useRef, useEffect } from "react";
import { loadLikeModel, runLikeEstimation } from "../utils/runLikeModel";
import { likePresets } from "../utils/likePresets";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/common.css";
import "../styles/like.css";

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

    return (
        <div className="page">
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
                <div className="overlay-blur">
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}