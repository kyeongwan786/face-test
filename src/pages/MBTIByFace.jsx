// MBTIByFace.jsx - 다국어(i18n) 적용된 전체 코드
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import "../styles/mbti.css";
import { loadMBTIModelByGender, predictMBTIImage } from "../utils/runMBTIModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import LanguageSwitcher from "../components/LanguageSwitcher";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const CONFETTI_COUNT = 40;

const MBTI_COLOR = {
    NF: "#ff7ab2", NT: "#8e44ff", SF: "#00c8b4", ST: "#3fa8ff",
};

const MBTI_DESC_EXTENDED = { /* 그대로 유지 */ };
const MBTI_CELEBS = { /* 그대로 유지 */ };
const MBTI_KEYWORDS = { /* 그대로 유지 */ };
const getMBTIColor = (t) => MBTI_COLOR[`${t[1]}${t[2]}`] || "#8e44ff";

export default function MBTIByFace() {
    const { t } = useTranslation("mbti");

    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [mbti, setMBTI] = useState(null);
    const [mbtiColor, setMBTIColor] = useState(MBTI_COLOR.NT);
    const [keywords, setKeywords] = useState([]);
    const [confetti, setConfetti] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamDone, setWebcamDone] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const videoRef = useRef(null);
    const modalRef = useRef(null);
    const videoWrapperRef = useRef(null);

    const scrollToWebcam = () => {
        videoWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    useEffect(() => {
        if (!window.Kakao) {
            const s = document.createElement("script");
            s.src = "https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js";
            s.onload = () => window.Kakao.init("d3f8af96c1e986cbfb2216380f1ea8e7");
            document.head.appendChild(s);
        }
    }, []);

    useEffect(() => {
        if (useWebcam) {
            setWebcamReady(false);
            setWebcamDone(false);
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setWebcamReady(true);
                        setWebcamStream(stream);
                    };
                })
                .catch((e) => {
                    alert(t("error.webcam"));
                    console.error(e);
                });
        }
    }, [useWebcam]);

    const applyPrediction = (best) => {
        setMBTI(best.className);
        const color = getMBTIColor(best.className);
        setMBTIColor(color);
        setKeywords(MBTI_KEYWORDS[best.className] || []);
        setConfetti(makeConfetti(color));
        setModalOpen(true);
    };

    const predictFromImage = async (img) => {
        await loadMBTIModelByGender(gender);
        const preds = await predictMBTIImage(img);
        const best = preds.reduce((a, b) => (a.probability > b.probability ? a : b));
        applyPrediction(best);
    };

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
            setImage(reader.result);
            setLoading(true);
            const img = new Image();
            img.src = reader.result;
            img.onload = async () => {
                try { await predictFromImage(img); } catch { alert(t("error.upload")); }
                finally { setLoading(false); }
            };
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
        setLoading(true);
        webcamStream?.getTracks().forEach((t) => t.stop());
        try { await predictFromImage(img); } catch { alert(t("error.upload")); }
        finally {
            setLoading(false);
            setWebcamDone(true);
        }
    };

    const reset = () => {
        setImage(null); setMBTI(null); setModalOpen(false);
        setKeywords([]); setConfetti([]); setWebcamDone(false);
        webcamStream?.getTracks().forEach((t) => t.stop());
        setWebcamStream(null); setUseWebcam(false);
    };

    const shareKakao = async () => {
        const { Kakao } = window;
        if (!Kakao?.isInitialized()) return alert(t("error.kakaoNotReady"));
        try {
            const canvas = await html2canvas(modalRef.current, { scale: 1 });
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            const res = await Kakao.Share.uploadImage({ file: [dataURLtoFile(dataUrl, "result.jpg")] });
            const pageUrl = window.location.origin;
            await Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: t("share.title", { mbti }),
                    description: MBTI_DESC_EXTENDED[mbti],
                    imageUrl: res.infos.original.url,
                    link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                },
                buttons: [
                    { title: t("share.button"), link: { mobileWebUrl: pageUrl, webUrl: pageUrl } },
                ],
            });
        } catch (e) {
            console.error(e);
            alert(t("error.kakao"));
        }
    };

    const makeConfetti = (color) => Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const style = {
            left: Math.random() * 100 + "%",
            width: 6 + Math.random() * 6 + "px",
            height: 6 + Math.random() * 6 + "px",
            backgroundColor: color,
            animationDelay: Math.random() * 2 + "s",
        };
        return <div key={i} className="confetti" style={style} />;
    });

    const dataURLtoFile = (dataUrl, filename) => {
        const [header, b64] = dataUrl.split(",");
        const mime = header.match(/:(.*?);/)[1];
        const bin = atob(b64);
        const buf = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
        return new File([buf], filename, { type: mime });
    };

    return (
        <div className="page">
            <div className="language-switcher-wrapper">
                <LanguageSwitcher />
            </div>

            {modalOpen && (
                <div className="overlay-blur">
                    <div className="result-modal" ref={modalRef} style={{ "--mbti-color": mbtiColor }}>
                        <div className="confetti-wrapper">{confetti}</div>
                        <img className="modal-photo-circle" src={image} alt="uploaded" />
                        <h2 className="mbti-type">
                            {t("resultPrefix")} <strong style={{ color: mbtiColor }}>{mbti}</strong>{t("resultSuffix")}
                        </h2>
                        <p className="mbti-desc">{MBTI_DESC_EXTENDED[mbti]}</p>
                        <p className="mbti-example">{t("celebrityLabel")}: <strong>{MBTI_CELEBS[mbti]}</strong></p>
                        <div className="keyword-list">
                            {keywords.map((k) => (
                                <span key={k} className="tag" style={{ "--mbti-color": mbtiColor }}>{k}</span>
                            ))}
                        </div>
                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>{t("retryButton")}</button>
                            <button className="btn-kakao" onClick={shareKakao}>{t("shareKakao")}</button>
                        </div>
                    </div>
                </div>
            )}

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
                    <button
                        className={useWebcam ? "mode-button active" : "mode-button"}
                        onClick={() => {
                            setUseWebcam(true);
                            setTimeout(scrollToWebcam, 100);
                        }}
                    >
                        {t("webcamMode")}
                    </button>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    !image && (
                        <>
                            {!useWebcam && (
                                <div className="upload-wrapper">
                                    <label className="upload-box" htmlFor="uploadInput">
                                        <span className="upload-label">{t("uploadLabel")}</span>
                                    </label>
                                    <input id="uploadInput" type="file" accept="image/*" hidden onChange={handleUpload} />
                                </div>
                            )}
                            {useWebcam && (
                                <div className="webcam-wrapper active" ref={videoWrapperRef}>
                                    <video ref={videoRef} autoPlay muted playsInline width="320" className="video-frame" />
                                    {webcamDone ? (
                                        <>
                                            <div className="webcam-overlay-text retry-message">
                                                {t("webcamDoneMessage")}
                                            </div>
                                            <button className="btn-retry webcam-retry" onClick={reset}>{t("webcamRetry")}</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="webcam-overlay-text">
                                                {webcamReady ? t("webcamReady") : t("webcamNotReady")}
                                            </div>
                                            {webcamReady && (
                                                <button className="btn-analyze" onClick={captureFromWebcam}>{t("analyzeButton")}</button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )
                )}
            </div>
        </div>
    );
}
