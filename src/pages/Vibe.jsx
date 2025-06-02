import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { loadVibeModel, runVibeEstimation } from "../utils/runVibeModel";
import { vibePresets } from "../utils/vibePresets";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/common.css";
import "../styles/vibe.css";

const CONTEXTS = ["default", "interviewer", "date", "police", "dog", "kid"];
const CONTEXT_LABELS = {
    default: "기본",
    interviewer: "면접관",
    date: "소개팅",
    police: "경찰관",
    dog: "동네 강아지",
    kid: "초등학생"
};

export default function Vibe() {
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
    const modalRef = useRef(null);
    const webcamWrapperRef = useRef(null);
    const inputBoxRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY < 300);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToInput = () => inputBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

    const handleModeClick = (webcam) => {
        setUseWebcam(webcam);
        setTimeout(() => webcam ? webcamWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }) : scrollToInput(), 100);
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
            await loadVibeModel(gender);
            await img.decode();
            const result = await runVibeEstimation(img, gender);
            const label = result.toLowerCase().trim();
            const preset = vibePresets[label];
            if (!preset) throw new Error("Unknown label: " + result);
            setVibe({ label: preset.label, ...preset });
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
                await loadVibeModel(gender);
                const img = new Image();
                img.src = imgSrc;
                img.onload = async () => {
                    const result = await runVibeEstimation(img, gender);
                    const label = result.toLowerCase().trim();
                    const preset = vibePresets[label];
                    if (!preset) throw new Error("Unknown label: " + result);
                    setVibe({ label: preset.label, ...preset });
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
        setVibe(null);
        setModalOpen(false);
        setWebcamStream(null);
        setUseWebcam(false);
        setContext("default");
    };

    const getContextualComment = () => {
        if (!vibe) return "";
        switch (context) {
            case "interviewer": return `👔 면접관 시선\n${vibe.interviewerComment}`;
            case "date": return `💘 소개팅 첫마디\n${vibe.dateComment}`;
            case "police": return `👮 경찰관의 판단\n${vibe.policeComment}`;
            case "dog": return `🐶 동네 강아지 반응\n${vibe.dogComment}`;
            case "kid": return `🎒 초등학생 눈높이\n${vibe.kidComment}`;
            default: return `👁️ 첫인상\n${vibe.defaultComment}`;
        }
    };

    return (
        <div className="page">
            <div className="container">
                <header>
                    <h1 className="section-title">첫인상 테스트</h1>
                    <p className="section-sub">사진이나 실시간 영상으로 나의 첫인상을 분석해보세요</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="context-section">
                    <p className="context-title">👁️ 결과를 어떤 시선으로 볼까요?</p>
                    <p className="context-desc">상황·관점에 따라 달라지는 첫인상을 선택하세요!</p>

                    <div className="context-switcher">
                        {CONTEXTS.map((key) => (
                            <button key={key} className={context === key ? "context-button active" : "context-button"} onClick={() => { setContext(key); scrollToInput(); }}>
                                {CONTEXT_LABELS[key]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => handleModeClick(false)}>사진 업로드하기</button>
                    <button className={useWebcam ? "mode-button active" : "mode-button"} onClick={() => handleModeClick(true)}>실시간으로 분석하기</button>
                </div>

                {!useWebcam && (
                    <label className="upload-box" ref={inputBoxRef}>
                        <span className="upload-label">사진 올리기</span>
                        <input type="file" accept="image/*" hidden onChange={handleUpload} />
                    </label>
                )}

                {useWebcam && (
                    <div className="webcam-wrapper" ref={webcamWrapperRef}>
                        <video ref={videoRef} autoPlay muted playsInline className="video-frame" />
                        <div className="webcam-overlay-text">{webcamReady ? "분석을 시작하세요" : "웹캠 준비 중..."}</div>
                        {webcamReady && <button className="capture-button" onClick={captureFromWebcam}>분석 시작</button>}
                    </div>
                )}

                {loading && <LoadingSpinner />}
            </div>

            {showScrollButton && <button className="go-analyze-button" onClick={scrollToInput}>🔍 분석하러 가기</button>}

            {modalOpen && vibe && (
                <div className="overlay-blur">
                    <div className="result-modal" ref={modalRef}>
                        <img src={image} alt="user" className="modal-photo-circle" />
                        <h2 className="vibe-label">“{vibe.label}”</h2>
                        <p className="vibe-comment">{getContextualComment()}</p>
                        {vibe.description && <p className="vibe-description short-text">{vibe.description}</p>}
                        {vibe.keywords && <div className="keyword-list">{vibe.keywords.map((k, i) => <span key={i} className="tag">#{k}</span>)}</div>}
                        <div className="modal-buttons">
                            <button onClick={reset}>다시하기</button>
                            <button onClick={() => alert("카카오 공유 기능은 아직 구현되지 않았습니다.")}>카카오 공유</button>
                        </div>
                        <div className="alt-context-button">
                            <p className="alt-context-label">👀 다른 시선에서도 첫인상 테스트해보세요!</p>
                            <div className="context-switcher">
                                {CONTEXTS.filter((k) => k !== "default").map((key) => (
                                    <button key={key} className={context === key ? "context-button active" : "context-button"} onClick={() => setContext(key)}>
                                        {CONTEXT_LABELS[key]}
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
