// ✅ 최종 수정본: 저장 기능 제거, 다시하기 & 카카오 공유만 유지 + 광고 삽입 위치 수정
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { loadModelByGender, predictImage } from "../utils/runModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "../styles/common.css";
import "../styles/ugly.css";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export default function UglyMeter() {
    const { t } = useTranslation("ugly");
    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [origFile, setOrigFile] = useState(null);
    const [score, setScore] = useState(null);
    const [comment, setComment] = useState(null);
    const [tier, setTier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [webcamReady, setWebcamReady] = useState(false);
    const [webcamFinished, setWebcamFinished] = useState(false);
    const [webcamStream, setWebcamStream] = useState(null);
    const videoRef = useRef(null);
    const modalRef = useRef(null);
    const webcamWrapperRef = useRef(null);

    const scrollToWebcam = () => {
        if (webcamWrapperRef.current) {
            webcamWrapperRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    useEffect(() => {
        if (!window.Kakao) {
            const s = document.createElement("script");
            s.src = "https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js";
            s.onload = () => window.Kakao.init("d3f8af96c1e986cbfb2216380f1ea8e7");
            document.head.appendChild(s);
        }

        const adScript = document.createElement("script");
        adScript.src = "//t1.daumcdn.net/kas/static/ba.min.js";
        adScript.async = true;
        document.body.appendChild(adScript);
    }, []);

    useEffect(() => {
        if (useWebcam) {
            setWebcamReady(false);
            setWebcamFinished(false);
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setWebcamReady(true);
                        setWebcamStream(stream);
                    };
                }
            }).catch((err) => {
                alert(t("error.webcamAccess"));
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

        if (webcamStream) {
            webcamStream.getTracks().forEach((track) => track.stop());
        }

        await loadModelByGender(gender);
        try {
            await img.decode();
            const preds = await predictImage(img);
            const ugly = preds.find((p) => p.className.toLowerCase().includes("ugly"));
            const s = Math.round((ugly?.probability ?? 0) * 100);
            setScore(s);
            const matched = BUCKETS.find((b) => s < b.max);
            setComment({ title: t(`buckets.${matched.key}.title`), sub: t(`buckets.${matched.key}.sub`) });
            const tTier = getTier(s);
            setTier({ ...tTier, name: t(`tier.${tTier.key}.name`), desc: t(`tier.${tTier.key}.desc`) });
            setModalOpen(true);
            setWebcamFinished(true);
        } catch (err) {
            console.error("이미지 디코딩 실패:", err);
            alert(t("error.analysisFailed"));
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setOrigFile(file);
        const reader = new FileReader();
        reader.onload = async () => {
            const imgSrc = reader.result;
            setImage(imgSrc);
            setLoading(true);

            try {
                await loadModelByGender(gender);
                const img = new Image();
                img.src = imgSrc;
                img.onload = async () => {
                    const preds = await predictImage(img);
                    const ugly = preds.find((p) => p.className.toLowerCase().includes("ugly"));
                    const s = Math.round((ugly?.probability ?? 0) * 100);
                    setScore(s);
                    const matched = BUCKETS.find((b) => s < b.max);
                    setComment({ title: t(`buckets.${matched.key}.title`), sub: t(`buckets.${matched.key}.sub`) });
                    const tTier = getTier(s);
                    setTier({ ...tTier, name: t(`tier.${tTier.key}.name`), desc: t(`tier.${tTier.key}.desc`) });
                    setModalOpen(true);
                };
            } catch (err) {
                alert(t("error.modelLoad"));
            } finally {
                setLoading(false);
            }
        };
        reader.readAsDataURL(file);
    };

    const reset = () => {
        setImage(null);
        setOrigFile(null);
        setScore(null);
        setComment(null);
        setTier(null);
        setModalOpen(false);
        setWebcamFinished(false);
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
            let file = origFile;
            if (!file) {
                file = dataURLtoFile(dataUrl, "result.jpg");
            }
            if (file.size > MAX_UPLOAD_SIZE) {
                alert(t("error.sizeLimit"));
                return;
            }
            const { infos } = await Kakao.Share.uploadImage({ file: [file] });
            const imgUrl = infos.original.url;
            const pageUrl = window.location.origin;
            await Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: t("share.title", { score }),
                    description: `${comment.title} ${comment.sub}`,
                    imageUrl: imgUrl,
                    link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                },
                buttons: [
                    {
                        title: t("share.button"),
                        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                    },
                ],
            });
        } catch (err) {
            console.error(err);
            alert(t("error.kakaoFail"));
        }
    };

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

                <div className="ad-pc-banner">
                    <ins className="kakao_ad_area" style={{ display: "block", width: "100%", maxWidth: "300px", margin: "1rem auto" }} data-ad-unit="DAN-2VAMRfWJcabygl9x" data-ad-width="300" data-ad-height="250"></ins>
                </div>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => setUseWebcam(false)}>
                        {t("mode.upload")}
                    </button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => {
                        setUseWebcam(true);
                        setTimeout(scrollToWebcam, 100);
                    }}>
                        {t("mode.webcam")}
                    </button>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    !image && (
                        <>
                            {!useWebcam && (
                                <label className="upload-box">
                                    <span className="upload-label">{t("upload.label")}</span>
                                    <input type="file" accept="image/*" hidden onChange={handleUpload} />
                                </label>
                            )}
                            {useWebcam && (
                                <div className="webcam-wrapper active" ref={webcamWrapperRef}>
                                    <video ref={videoRef} autoPlay muted playsInline width="300" />
                                    {webcamFinished ? (
                                        <>
                                            <div className="webcam-overlay-text retry-message">
                                                {t("webcam.done")}
                                            </div>
                                            <button className="btn-retry webcam-retry" onClick={reset}>
                                                {t("buttons.retry")}
                                            </button>
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
                            )}
                        </>
                    )
                )}
            </div>

            <div className="ad-mobile-fixed">
                <ins className="kakao_ad_area" style={{ display: "block", width: "320px", height: "50px" }} data-ad-unit="DAN-vq03WNxmpMBMVvd5" data-ad-width="320" data-ad-height="50"></ins>
            </div>

            {modalOpen && (
                <div className="overlay-blur">
                    <div className="result-modal" ref={modalRef} style={{ "--tier-color": tier?.color }}>
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
                            <button className="btn-retry" onClick={reset}>{t("buttons.retry")}</button>
                            <button className="btn-kakao" onClick={shareKakao}>{t("buttons.kakao")}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

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

function dataURLtoFile(dataUrl, filename) {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
}
