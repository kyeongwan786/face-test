import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { loadVibeModel, runVibeEstimation } from "../utils/runVibeModel";
import { vibePresets } from "../utils/vibePresets";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import "../styles/common.css";
import "../styles/vibe.css";

/* ------------------------------------------------------------
   시선(컨텍스트) 정의 – 여기서만 수정하면 UI 전체가 반영됩니다.
------------------------------------------------------------ */
const CONTEXTS = [
    "default", // 기본 시선
    "interviewer", // 면접관
    "date",       // 소개팅 상대
    "police",     // 경찰관
    "dog",        // 동네 강아지
    "kid"         // 초등학생
];

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

    /* -------------------------------------------
       스크롤 위치에 따라 "분석하러 가기" 버튼 토글
    ------------------------------------------- */
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

    /* -------------------------------------------
       웹캠 스트림 초기화
    ------------------------------------------- */
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

    /* -------------------------------------------
       웹캠 캡처하여 분석
    ------------------------------------------- */
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

    /* -------------------------------------------
       업로드 이미지 분석
    ------------------------------------------- */
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

    /* -------------------------------------------
       다시하기 초기화
    ------------------------------------------- */
    const reset = () => {
        setImage(null);
        setVibe(null);
        setModalOpen(false);
        setWebcamStream(null);
        setUseWebcam(false);
        setContext("default");
    };

    /* -------------------------------------------
       컨텍스트에 따른 코멘트 반환
    ------------------------------------------- */
    const getContextualComment = () => {
        if (!vibe) return "";
        switch (context) {
            case "interviewer":
                return `👔 면접관 시선\n${vibe.interviewerComment}`;
            case "date":
                return `💘 소개팅 첫마디\n${vibe.dateComment}`;
            case "police":
                return `👮 경찰관의 판단\n${vibe.policeComment}`;
            case "dog":
                return `🐶 동네 강아지 반응\n${vibe.dogComment}`;
            case "kid":
                return `🎒 초등학생 눈높이\n${vibe.kidComment}`;
            default:
                return `👁️ 첫인상\n${vibe.defaultComment}`;
        }
    };

    /* ==========================================================
       렌더링
    ========================================================== */
    return (
        <div className="page">
            <div className="container">
                <header>
                    <h1 className="section-title">첫인상 테스트</h1>
                    <p className="section-sub">사진이나 실시간 영상으로 나의 첫인상을 분석해보세요</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                {/* --------------- 시선 선택 --------------- */}
                <div className="context-section">
                    <p className="context-title">👁️ 결과를 어떤 시선으로 볼까요?</p>
                    <p className="context-desc">상황·관점에 따라 달라지는 첫인상을 선택하세요!</p>

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
                                {CONTEXT_LABELS[key]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --------------- 분석 모드 토글 --------------- */}
                <div className="mode-toggle-buttons">
                    <button
                        className={!useWebcam ? "mode-button active" : "mode-button"}
                        onClick={() => handleModeClick(false)}
                    >
                        사진 업로드하기
                    </button>
                    <button
                        className={useWebcam ? "mode-button active" : "mode-button"}
                        onClick={() => handleModeClick(true)}
                    >
                        실시간으로 분석하기
                    </button>
                </div>

                {/* --------------- 입력 영역 --------------- */}
                {!useWebcam && (
                    <label className="upload-box" ref={inputBoxRef}>
                        <span className="upload-label">사진 올리기</span>
                        <input type="file" accept="image/*" hidden onChange={handleUpload} />
                    </label>
                )}

                {useWebcam && (
                    <div className="webcam-wrapper" ref={webcamWrapperRef}>
                        <video ref={videoRef} autoPlay muted playsInline className="video-frame" />
                        <div className="webcam-overlay-text">
                            {webcamReady ? "분석을 시작하세요" : "웹캠 준비 중..."}
                        </div>
                        {webcamReady && (
                            <button className="capture-button" onClick={captureFromWebcam}>
                                분석 시작
                            </button>
                        )}
                    </div>
                )}

                {loading && <LoadingSpinner />}
            </div>

            {/* --------------- 플로팅 CTA --------------- */}
            {showScrollButton && (
                <button className="go-analyze-button" onClick={scrollToInput}>
                    🔍 분석하러 가기
                </button>
            )}

            {/* --------------- 결과 모달 --------------- */}
            {modalOpen && vibe && (
                <div className="overlay-blur">
                    <div className="result-modal" ref={modalRef}>
                        <img src={image} alt="user" className="modal-photo-circle" />
                        <h2 className="vibe-label">“{vibe.label}”</h2>

                        <p className="vibe-comment">{getContextualComment()}</p>
                        {vibe.description && (
                            <p className="vibe-description short-text">{vibe.description}</p>
                        )}

                        {vibe.keywords && (
                            <div className="keyword-list">
                                {vibe.keywords.map((k, i) => (
                                    <span key={i} className="tag">
                    #{k}
                  </span>
                                ))}
                            </div>
                        )}

                        {/* ---- 모달 버튼 ---- */}
                        <div className="modal-buttons">
                            <button onClick={reset}>다시하기</button>
                            <button
                                onClick={() =>
                                    html2canvas(modalRef.current).then((canvas) => {
                                        const a = document.createElement("a");
                                        a.href = canvas.toDataURL("image/png");
                                        a.download = "vibe-result.png";
                                        a.click();
                                    })
                                }
                            >
                                결과 저장
                            </button>
                        </div>

                        {/* ---- 다른 시선 전환 ---- */}
                        <div className="alt-context-button">
                            <p className="alt-context-label">
                                👀 다른 시선에서도 첫인상 테스트해보세요!
                            </p>
                            <div className="context-switcher">
                                {CONTEXTS.filter((k) => k !== "default").map((key) => (
                                    <button
                                        key={key}
                                        className={context === key ? "context-button active" : "context-button"}
                                        onClick={() => setContext(key)}
                                    >
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
