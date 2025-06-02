import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";
import { loadVibeModel, runVibeEstimation } from "../utils/runVibeModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/common.css";
import "../styles/vibe.css";

const CONTEXTS = ["default", "interviewer", "date", "police", "dog", "kid"];

export default function Vibe() {
    const { t } = useTranslation("vibe");
    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [vibe, setVibe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [context, setContext] = useState("default");
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const videoRef = useRef(null);
    const webcamWrapperRef = useRef(null);
    const inputBoxRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY < 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToInput = () => {
        inputBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const handleModeClick = (webcam) => {
        setUseWebcam(webcam);
        setTimeout(() => {
            webcam
                ? webcamWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                : scrollToInput();
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
                    alert(t("fail"));
                    console.error(err);
                });
        }
    }, [useWebcam, t]);

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
            await loadVibeModel(gender);
            await img.decode();
            const result = await runVibeEstimation(img, gender);
            const label = result.toLowerCase().trim();
            setVibe({ label });
            setModalOpen(true);
        } catch (err) {
            alert(t("fail"));
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
                await loadVibeModel(gender);
                const img = new Image();
                img.src = imgSrc;
                img.onload = async () => {
                    const result = await runVibeEstimation(img, gender);
                    const label = result.toLowerCase().trim();
                    setVibe({ label });
                    setModalOpen(true);
                };
            } catch (err) {
                alert(t("fail"));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const reset = () => {
        setImage(null);
        setVibe(null);
        setModalOpen(false);
        setWebcamStream(null);
        setUseWebcam(false);
        setContext("default");
    };

    const getContextualComment = () => {
        if (!vibe) return "";
        return t(`${vibe.label}.${context}Comment`);
    };

    return (
        <div className="page">
            <div className="container">
                <LanguageSwitcher />
                <header>
                    <h1 className="section-title">{t("title")}</h1>
                    <p className="section-sub">{t("subtitle")}</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="context-section">
                    <p className="context-title">{t("contextTitle")}</p>
                    <p className="context-desc">{t("contextDesc")}</p>
                    <div className="context-switcher">
                        {CONTEXTS.map((key) => (
                            <button
                                key={key}
                                className={context === key ? "context-button active" : "context-button"}
                                onClick={() => {
                                    setContext(key);
                                    scrollToInput();
                                }}
                            >
                                {t(`contexts.${key}`)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => handleModeClick(false)}>
                        {t("uploadButton")}
                    </button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => handleModeClick(true)}>
                        {t("webcamButton")}
                    </button>
                </div>

                {!useWebcam && (
                    <label className="upload-box" ref={inputBoxRef}>
                        <span className="upload-label">{t("uploadLabel")}</span>
                        <input type="file" accept="image/*" hidden onChange={handleUpload} />
                    </label>
                )}

                {useWebcam && (
                    <div className="webcam-wrapper" ref={webcamWrapperRef}>
                        <video ref={videoRef} autoPlay muted playsInline className="video-frame" />
                        <div className="webcam-overlay-text">
                            {webcamReady ? t("startAnalysis") : t("webcamOverlay")}
                        </div>
                        {webcamReady && (
                            <button className="capture-button" onClick={captureFromWebcam}>
                                {t("startAnalysis")}
                            </button>
                        )}
                    </div>
                )}

                {loading && <LoadingSpinner />}
            </div>

            {showScrollButton && (
                <button className="go-analyze-button" onClick={scrollToInput}>
                    {t("analyzeNow")}
                </button>
            )}

            {modalOpen && vibe && (
                <div className="overlay-blur" onClick={(e) => e.target.classList.contains("overlay-blur") && reset()}>
                    <div className="result-modal">
                        <button className="modal-close-button" onClick={reset}>×</button>
                        <img src={image} alt="user" className="modal-photo-circle" />
                        <h2 className="vibe-label">{t("resultLabel", { label: t(`${vibe.label}.label`) })}</h2>
                        <p className="vibe-comment">{getContextualComment()}</p>
                        <p className="vibe-description short-text">{t(`${vibe.label}.description`)}</p>
                        <div className="keyword-list">
                            {[0, 1, 2, 3].map((i) => (
                                <span key={i} className="tag">#{t(`${vibe.label}.keywords.${i}`)}</span>
                            ))}
                        </div>
                        <div className="modal-buttons">
                            <button onClick={reset}>{t("retry")}</button>
                            <button onClick={() => alert("카카오 공유 기능은 아직 구현되지 않았습니다.")}>
                                {t("shareKakao")}
                            </button>
                        </div>
                        <div className="alt-context-button">
                            <p className="alt-context-label">{t("altContextLabel")}</p>
                            <div className="context-switcher">
                                {CONTEXTS.filter((k) => k !== "default").map((key) => (
                                    <button key={key} className={context === key ? "context-button active" : "context-button"} onClick={() => setContext(key)}>
                                        {t(`contexts.${key}`)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
