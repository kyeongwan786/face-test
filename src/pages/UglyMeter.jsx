import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { loadModelByGender, predictImage } from "../utils/runModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import LanguageSwitcher from "../components/LanguageSwitcher";
import TestSuggestions from "../components/TestSuggestions";
import ExploreAllTests from "../components/ExploreAllTests";
import "../styles/common.css";
import "../styles/ugly.css";
import { Helmet } from "react-helmet";




const BUCKETS = [
    { key: "top", max: 20 },
    { key: "high", max: 40 },
    { key: "mid", max: 60 },
    { key: "low", max: 80 },
    { key: "bottom", max: Infinity }
];

const TIER_TABLE = [
    { key: "challenger", max: 10, file: "Challenger.png", color: "#ffd700" },
    { key: "grandmaster", max: 20, file: "Grandmaster.png", color: "#ff5252" },
    { key: "master", max: 30, file: "Master.png", color: "#b56cff" },
    { key: "diamond", max: 45, file: "Diamond.png", color: "#29d4f6" },
    { key: "platinum", max: 60, file: "Platinum.png", color: "#2db8a8" },
    { key: "gold", max: 75, file: "Gold.png", color: "#cfa93e" },
    { key: "silver", max: 90, file: "Silver.png", color: "#aeb6bf" },
    { key: "bronze", max: 101, file: "Bronze.png", color: "#5d5d5d" }
];

function getTier(score) {
    return TIER_TABLE.find((t) => score < t.max);
}

function getReaction(score, t) {
    if (score < 20) return t("reaction.top");
    if (score < 40) return t("reaction.high");
    if (score < 60) return t("reaction.mid");
    if (score < 80) return t("reaction.low");
    return t("reaction.bottom");
}

function getFunnyComment(score, t) {
    if (score < 20) return pickRandom(t("funnyComment.top", { returnObjects: true }));
    if (score < 40) return pickRandom(t("funnyComment.high", { returnObjects: true }));
    if (score < 60) return pickRandom(t("funnyComment.mid", { returnObjects: true }));
    if (score < 80) return pickRandom(t("funnyComment.low", { returnObjects: true }));
    return pickRandom(t("funnyComment.bottom", { returnObjects: true }));
}


function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function UglyMeter() {
    const { t } = useTranslation("ugly");
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

    const videoRef = useRef(null);
    const webcamWrapperRef = useRef(null);

    useEffect(() => {
        if (!window.Kakao) {
            const s = document.createElement("script");
            s.src = "https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js";
            s.onload = () => window.Kakao.init("d3f8af96c1e986cbfb2216380f1ea8e7");
            document.head.appendChild(s);
        }
        const ad = document.createElement("script");
        ad.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        ad.async = true;
        document.body.appendChild(ad);
    }, []);

    useEffect(() => {
        if (useWebcam) {
            setWebcamReady(false);
            setWebcamFinished(false);
            navigator.mediaDevices.getUserMedia({ video: true })
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

    const predictAndShow = async (img) => {
        await loadModelByGender(gender);
        const preds = await predictImage(img);
        const ugly = preds.find((p) => p.className.toLowerCase().includes("ugly"));
        const s = Math.round((ugly?.probability ?? 0) * 100);
        setScore(s);

        const matched = BUCKETS.find((b) => s < b.max);
        setComment({
            title: t(`buckets.${matched.key}.title`),
            sub: t(`buckets.${matched.key}.sub`)
        });

        const currentTier = getTier(s);
        setTier({
            ...currentTier,
            name: t(`tier.${currentTier.key}.name`),
            desc: t(`tier.${currentTier.key}.desc`)
        });

        setModalOpen(true);
    };

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

    const captureFromWebcam = async () => {
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
                    title: `못생김 ${score}%`,
                    description: `${comment.title} ${comment.sub}`,
                    imageUrl: infos.original.url,
                    link: { mobileWebUrl: pageUrl, webUrl: pageUrl }
                },
                buttons: [
                    {
                        title: t("share.button"),
                        link: { mobileWebUrl: pageUrl, webUrl: pageUrl }
                    }
                ]
            });
        } catch {
            alert(t("error.kakaoFail"));
        }
    };

    return (
        <div className="page">
            <Helmet>
                <title>못생김 측정기 | AI 얼굴 실험실</title>
                <meta name="description" content="AI가 당신의 얼굴을 분석해 못생김 점수를 매겨드립니다. 티어, 개드립 해설까지 완벽 지원!" />
                <meta property="og:title" content="못생김 측정기 | AI 얼굴 실험실" />
                <meta property="og:description" content="얼굴 하나로 못생김 티어 분석받고 병맛 해설까지! AI 얼굴 실험실에서 지금 확인하세요." />
                <meta property="og:image" content="/meta/ugly.png" />
                <meta property="og:url" content="https://facealchemy.site/ugly" />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="container">
                <header>
                    <h1>{t("title")}</h1>
                    <p className="subtitle">{t("subtitle")}</p>
                    <div className="language-switcher-wrapper">
                        <LanguageSwitcher />
                    </div>
                </header>
                <GenderSelector gender={gender} setGender={setGender} />
                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => setUseWebcam(false)}>
                        {t("mode.upload")}
                    </button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => {
                        setUseWebcam(true);
                        setTimeout(() => webcamWrapperRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                    }}>
                        {t("mode.webcam")}
                    </button>
                </div>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    !image && (!useWebcam ? (
                        <label className="upload-box">
                            <span className="upload-label">{t("upload.label")}</span>
                            <input type="file" accept="image/*" hidden onChange={handleUpload} />
                        </label>
                    ) : (
                        <div className="webcam-wrapper active" ref={webcamWrapperRef}>
                            <video ref={videoRef} autoPlay muted playsInline width="300" />
                            {webcamFinished ? (
                                <>
                                    <div className="webcam-overlay-text retry-message">{t("webcam.done")}</div>
                                    <button className="btn-retry webcam-retry" onClick={reset}>{t("buttons.retry")}</button>
                                </>
                            ) : (
                                <>
                                    <div className="webcam-overlay-text">
                                        {webcamReady ? t("webcam.ready") : t("webcam.loading")}
                                    </div>
                                    {webcamReady && (
                                        <button className="btn-analyze webcam-analyze" onClick={captureFromWebcam}>
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
            {modalOpen && (
                <div className="overlay-blur funny-theme" onClick={(e) => {
                    if (e.target.classList.contains("overlay-blur")) reset();
                }}>
                    <div className="funny-result-modal" style={{ '--tier-color': tier?.color }}>
                        <button className="modal-close" onClick={reset}>×</button>
                        <h2 className="funny-modal-title">{getReaction(score, t)}</h2>
                        <div className="funny-photo-frame">
                            <img src={image} alt="uploaded" className="funny-photo" />
                        </div>
                        <div className="funny-tier-badge">
                            <img src={`/rank/${tier?.file}`} alt={tier?.name} />
                            <p className="tier-name big">{tier?.name}</p>
                            <p className="tier-desc">{tier?.desc}</p>
                        </div>
                        <div className="funny-score-block">
                            <p className="funny-score-label">{t("result.score")}</p>
                            <p className="funny-score">{score}%</p>
                        </div>
                        <div className="funny-comment-box">
                            <p className="comment-main">{comment?.title}</p>
                            <p className="comment-sub">{comment?.sub}</p>
                        </div>
                        <div className="funny-random-comment">🧠 "{getFunnyComment(score, t)}"</div>
                        <TestSuggestions />
                        <div className="modal-buttons">
                            <button className="common-btn retry" onClick={reset}>🔁 {t("buttons.retry")}</button>
                            <button className="common-btn kakao" onClick={shareKakao}>💬 {t("buttons.kakao")}</button>
                        </div>

                    </div>
                </div>
            )}
            <div className="explore-tests-section">
                <ExploreAllTests />
            </div>
        </div>
    );
}
