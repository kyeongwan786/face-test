// src/pages/UglyMeter.jsx
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { loadModelByGender, predictImage } from "../utils/runModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/common.css";
import "../styles/ugly.css";

export default function UglyMeter() {
    const { t } = useTranslation("ugly");

    /* ───────── state ───────── */
    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [score, setScore] = useState(null);
    const [comment, setComment] = useState(null);
    const [tier, setTier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamFinished, setWebcamFinished] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);

    /* ───────── ref ───────── */
    const videoRef = useRef(null);
    const webcamWrapperRef = useRef(null);

    /* ───────── utils ───────── */
    const scrollToWebcam = () => {
        webcamWrapperRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    };

    /* ───────── sdk / ads script ───────── */
    useEffect(() => {
        if (!window.Kakao) {
            const s = document.createElement("script");
            s.src = "https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js";
            s.onload = () =>
                window.Kakao.init("d3f8af96c1e986cbfb2216380f1ea8e7");
            document.head.appendChild(s);
        }
        const ad = document.createElement("script");
        ad.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        ad.async = true;
        document.body.appendChild(ad);
    }, []);

    /* ───────── webcam on/off ───────── */
    useEffect(() => {
        if (useWebcam) {
            setWebcamReady(false);
            setWebcamFinished(false);
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setWebcamReady(true);
                        setWebcamStream(stream);
                    };
                })
                .catch(() => alert(t("error.webcamAccess")));
        }
    }, [useWebcam, t]);

    /* ───────── core predict helper ───────── */
    const predictAndShow = async (img) => {
        await loadModelByGender(gender);
        const preds = await predictImage(img);
        const ugly = preds.find((p) =>
            p.className.toLowerCase().includes("ugly")
        );
        const s = Math.round((ugly?.probability ?? 0) * 100);
        setScore(s);

        const matched = BUCKETS.find((b) => s < b.max);
        setComment({
            title: t(`buckets.${matched.key}.title`),
            sub: t(`buckets.${matched.key}.sub`),
        });

        const currentTier = getTier(s);
        setTier({
            ...currentTier,
            name: t(`tier.${currentTier.key}.name`),
            desc: t(`tier.${currentTier.key}.desc`),
        });

        setModalOpen(true);
    };

    /* ───────── upload flow ───────── */
    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const imgSrc = reader.result;
            setImage(imgSrc);
            setLoading(true);
            const img = new Image();
            img.src = imgSrc;
            img.onload = async () => {
                try {
                    await predictAndShow(img);
                } finally {
                    setLoading(false);
                }
            };
        };
        reader.readAsDataURL(file);
    };

    /* ───────── webcam capture ───────── */
    const captureFromWebcam = async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

        const data = canvas.toDataURL("image/jpeg");
        setImage(data);
        setLoading(true);

        webcamStream?.getTracks().forEach((t) => t.stop());
        const img = new Image();
        img.src = data;

        try {
            await img.decode();
            await predictAndShow(img);
        } finally {
            setLoading(false);
            setWebcamFinished(true);
        }
    };

    /* ───────── reset ───────── */
    const reset = () => {
        setImage(null);
        setScore(null);
        setComment(null);
        setTier(null);
        setModalOpen(false);
        setWebcamFinished(false);
        webcamStream?.getTracks().forEach((t) => t.stop());
        setWebcamStream(null);
        setUseWebcam(false);
    };

    /* ───────── kakao share ───────── */
    const shareKakao = async () => {
        const { Kakao } = window;
        if (!Kakao?.isInitialized()) {
            alert(t("error.kakaoInit"));
            return;
        }
        try {
            const blob = await fetch(image).then((r) => r.blob());
            const file = new File([blob], "result.jpg", { type: blob.type });
            const { infos } = await Kakao.Share.uploadImage({ file: [file] });
            const pageUrl = window.location.origin;

            await Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: t("share.title", { score }),
                    description: `${comment.title} ${comment.sub}`,
                    imageUrl: infos.original.url,
                    link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                },
                buttons: [
                    {
                        title: t("share.button"),
                        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                    },
                ],
            });
        } catch {
            alert(t("error.kakaoFail"));
        }
    };

    /* ───────── jsx ───────── */
    return (
        <div className="page">
            <div className="language-switcher-wrapper">
                <LanguageSwitcher />
            </div>

            <div className="container">
                <header>
                    <h1>{t("title")}</h1>
                    <p className="subtitle">{t("subtitle")}</p>
                </header>



                <GenderSelector gender={gender} setGender={setGender} />

                <div className="mode-toggle-buttons">
                    <button
                        className={!useWebcam ? "mode-button active" : "mode-button"}
                        onClick={() => setUseWebcam(false)}
                    >
                        {t("mode.upload")}
                    </button>
                    <button
                        className={useWebcam ? "mode-button active" : "mode-button"}
                        onClick={() => {
                            setUseWebcam(true);
                            setTimeout(scrollToWebcam, 100);
                        }}
                    >
                        {t("mode.webcam")}
                    </button>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    !image &&
                    (!useWebcam ? (
                        <label className="upload-box">
                            <span className="upload-label">{t("upload.label")}</span>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleUpload}
                            />
                        </label>
                    ) : (
                        <div className="webcam-wrapper active" ref={webcamWrapperRef}>
                            <video ref={videoRef} autoPlay muted playsInline width="300" />
                            {webcamFinished ? (
                                <>
                                    <div className="webcam-overlay-text retry-message">
                                        {t("webcam.done")}
                                    </div>
                                    <button
                                        className="btn-retry webcam-retry"
                                        onClick={reset}
                                    >
                                        {t("buttons.retry")}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="webcam-overlay-text">
                                        {webcamReady ? t("webcam.ready") : t("webcam.loading")}
                                    </div>
                                    {webcamReady && (
                                        <button
                                            className="btn-analyze webcam-analyze"
                                            onClick={captureFromWebcam}
                                        >
                                            {t("buttons.analyze")}
                                        </button>
                                    )}
                                </>
                            )}
                            {!webcamReady && <LoadingSpinner />}
                        </div>
                    ))
                )}
            </div>

            {/* PC 광고 */}
            <div className="ad-pc-banner">
                <ins
                    className="kakao_ad_area"
                    style={{
                        display: "block",
                        width: "100%",
                        maxWidth: 300,
                        margin: "1rem auto",
                    }}
                    data-ad-unit="DAN-2VAMRfWJcabygl9x"
                    data-ad-width="300"
                    data-ad-height="250"
                ></ins>
            </div>

            {/* 모바일 띠배너 */}
            <div className="ad-mobile-fixed">
                <ins
                    className="kakao_ad_area"
                    style={{ display: "block", width: 320, height: 50 }}
                    data-ad-unit="DAN-vq03WNxmpMBMVvd5"
                    data-ad-width="320"
                    data-ad-height="50"
                ></ins>
            </div>

            {/* 결과 모달 */}



            {modalOpen && (
                <div
                    className="overlay-blur"
                    onClick={(e) => {
                        if (e.target.classList.contains("overlay-blur")) reset();
                    }}
                >
                    <div className="result-modal" style={{ "--tier-color": tier?.color }}>
                        <button className="modal-close" onClick={reset}>
                            ×
                        </button>

                        <img src={image} alt="uploaded" className="modal-photo-circle" />

                        <div className="tier-badge-wrapper">
                            <img src={`/rank/${tier?.file}`} alt={tier?.name} />
                        </div>

                        <p className="tier-name">{tier?.name}</p>
                        <p className="tier-desc">{tier?.desc}</p>

                        <div className="modal-score">
                            <span className="score-label">{t("result.label")}</span>
                            <span className="modal-percent">{score}%</span>
                        </div>

                        <p className="modal-title">{comment?.title}</p>
                        <p className="modal-sub">{comment?.sub}</p>

                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>
                                {t("buttons.retry")}
                            </button>
                            <button className="btn-kakao" onClick={shareKakao}>
                                {t("buttons.kakao")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

/* ───────── constants ───────── */
const BUCKETS = [
    { key: "top", max: 20 },
    { key: "high", max: 40 },
    { key: "mid", max: 60 },
    { key: "low", max: 80 },
    { key: "bottom", max: Infinity },
];

const TIER_TABLE = [
    { key: "challenger", max: 10, file: "Challenger.png", color: "#ffd700" },
    { key: "grandmaster", max: 20, file: "Grandmaster.png", color: "#ff5252" },
    { key: "master", max: 30, file: "Master.png", color: "#b56cff" },
    { key: "diamond", max: 45, file: "Diamond.png", color: "#29d4f6" },
    { key: "platinum", max: 60, file: "Platinum.png", color: "#2db8a8" },
    { key: "gold", max: 75, file: "Gold.png", color: "#cfa93e" },
    { key: "silver", max: 90, file: "Silver.png", color: "#aeb6bf" },
    { key: "bronze", max: 101, file: "Bronze.png", color: "#5d5d5d" },
];

function getTier(score) {
    return TIER_TABLE.find((t) => score < t.max);
}
