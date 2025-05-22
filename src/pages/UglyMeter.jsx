// 수정된 UglyMeter.jsx - 수동 분석 버튼 추가 및 웹캠 재사용 가능하게 개선
import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { loadModelByGender, predictImage } from "../utils/runModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/common.css";
import "../styles/ugly.css";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export default function UglyMeter() {
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
            setComment(BUCKETS.find((b) => s < b.max));
            setTier(getTier(s));
            setModalOpen(true);
            setWebcamFinished(true);
        } catch (err) {
            console.error("이미지 디코딩 실패:", err);
            alert("이미지를 분석하는 중 문제가 발생했습니다.");
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
                    setComment(BUCKETS.find((b) => s < b.max));
                    setTier(getTier(s));
                    setModalOpen(true);
                };
            } catch (err) {
                alert("모델을 불러오는데 실패했습니다.");
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

    const saveShot = () => {
        if (!modalRef.current) return;
        html2canvas(modalRef.current, { scale: 2 }).then((canvas) => {
            const a = document.createElement("a");
            a.download = "ugly-result.png";
            a.href = canvas.toDataURL("image/png", 0.9);
            a.click();
        });
    };

    const shareKakao = async () => {
        const { Kakao } = window;
        if (!Kakao?.isInitialized()) {
            alert("카카오 SDK 준비 중!");
            return;
        }
        try {
            let file = origFile;
            if (!file) {
                const canvas = await html2canvas(modalRef.current, { scale: 1 });
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                file = dataURLtoFile(dataUrl, "result.jpg");
            }
            if (file.size > MAX_UPLOAD_SIZE) {
                alert("이미지 크기가 5MB를 초과하여 카카오톡에 업로드할 수 없습니다.");
                return;
            }
            const { infos } = await Kakao.Share.uploadImage({ file: [file] });
            const imgUrl = infos.original.url;
            const pageUrl = window.location.origin;
            await Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: `못생김 ${score}%`,
                    description: `${comment.title} ${comment.sub}`,
                    imageUrl: imgUrl,
                    link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                },
                buttons: [
                    {
                        title: "나도 측정하기",
                        link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                    },
                ],
            });
        } catch (err) {
            console.error(err);
            alert("카카오톡 공유에 실패했습니다.");
        }
    };

    return (
        <div className="page">
            {modalOpen && (
                <div className="overlay-blur">
                    <div className="result-modal" ref={modalRef} style={{ "--tier-color": tier?.color }}>
                        <img src={image} alt="uploaded" className="modal-photo-circle" />
                        <div className="tier-badge-wrapper">
                            <img src={`/rank/${tier?.file}`} alt={tier?.name} />
                        </div>
                        <p className="tier-name">{tier?.name}</p>
                        <p className="tier-desc">{tierDesc(tier?.name)}</p>
                        <div className="modal-score">
                            <span className="score-label">못생김</span>
                            <span className="modal-percent">{score}%</span>
                        </div>
                        <p className="modal-title">{comment?.title}</p>
                        <p className="modal-sub">{comment?.sub}</p>
                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>다시하기</button>
                            <button className="btn-save" onClick={saveShot}>결과 저장</button>
                            <button className="btn-kakao" onClick={shareKakao}>카카오톡 공유</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <header>
                    <h1>못생김 측정기</h1>
                    <p className="subtitle">성별을 선택하고 아래 방식 중 하나로 측정해보세요</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => setUseWebcam(false)}>
                        사진 업로드하기
                    </button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => setUseWebcam(true)}>
                        실시간으로 분석하기
                    </button>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : (
                    !image && (
                        <>
                            {!useWebcam && (
                                <label className="upload-box">
                                    📷 <span className="upload-label">사진 올리기</span>
                                    <input type="file" accept="image/*" hidden onChange={handleUpload} />
                                </label>
                            )}
                            {useWebcam && (
                                <div className="webcam-wrapper active">
                                    <video ref={videoRef} autoPlay muted playsInline width="300" />
                                    {webcamFinished ? (
                                        <>
                                            <div className="webcam-overlay-text retry-message">
                                                분석이 완료되었습니다. 다시 시도하려면 버튼을 눌러주세요.
                                            </div>
                                            <button className="btn-retry webcam-retry" onClick={reset}>
                                                다시 시도하기
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="webcam-overlay-text">
                                                {webcamReady ? "분석을 시작하세요" : "웹캠 준비 중..."}
                                            </div>
                                            {webcamReady && (
                                                <button className="btn-analyze webcam-analyze" onClick={captureFromWebcam}>
                                                    분석 시작
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
        </div>
    );
}

const BUCKETS = [
    { max: 20, title: "최상위 티어", sub: "훌륭한데요?" },
    { max: 40, title: "상위 티어", sub: "괜찮은데요?" },
    { max: 60, title: "평균선 착지", sub: "낫배드~" },
    { max: 80, title: "카메라가 한숨", sub: "흠........" },
    { max: Infinity, title: "괜찮아요", sub: "그럴 수 있어요" },
];

const TIER_TABLE = [
    { max: 10, name: "Challenger", file: "Challenger.png", color: "#ffd700" },
    { max: 20, name: "Grandmaster", file: "Grandmaster.png", color: "#ff5252" },
    { max: 30, name: "Master", file: "Master.png", color: "#b56cff" },
    { max: 45, name: "Diamond", file: "Diamond.png", color: "#29d4f6" },
    { max: 60, name: "Platinum", file: "Platinum.png", color: "#2db8a8" },
    { max: 75, name: "Gold", file: "Gold.png", color: "#cfa93e" },
    { max: 90, name: "Silver", file: "Silver.png", color: "#aeb6bf" },
    { max: 101, name: "Bronze", file: "Bronze.png", color: "#5d5d5d" },
];

function getTier(score) {
    return TIER_TABLE.find((t) => score < t.max);
}

function tierDesc(name) {
    const map = {
        Challenger: "상위 0.01%",
        Grandmaster: "상위 0.1%",
        Master: "상위 1%",
        Diamond: "상위 5%",
        Platinum: "상위 10%",
        Gold: "상위 25%",
        Silver: "상위 50%",
        Bronze: "남은 인원",
    };
    return map[name] + " 티어";
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
