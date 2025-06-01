import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "../styles/mbti.css";
import { loadMBTIModelByGender, predictMBTIImage } from "../utils/runMBTIModel";
import GenderSelector from "../components/GenderSelector";
import LoadingSpinner from "../components/LoadingSpinner";

const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const CONFETTI_COUNT = 40;

const MBTI_COLOR = {
    NF: "#ff7ab2", NT: "#8e44ff", SF: "#00c8b4", ST: "#3fa8ff",
};

const MBTI_DESC = {
    INFP: "이상주의적이며 감성적인 성향입니다. 타인의 감정을 잘 이해하며 예술적인 재능이 뛰어납니다.",
    ENFP: "창의적이고 에너지가 넘칩니다. 새로운 아이디어를 탐험하며 타인과의 교류를 즐깁니다.",
    INFJ: "깊이 있는 사고와 높은 직관력을 지닌 조용한 통찰가입니다. 타인에 대한 이해와 배려가 뛰어납니다.",
    ENFJ: "타인을 이끄는 데 탁월하며 사교적입니다. 공동체를 위한 결정을 잘 내리는 유형입니다.",
    INTP: "논리적이며 분석적인 성향으로 지식을 탐구하는 데 열정을 가집니다.",
    ENTP: "도전을 즐기고 토론을 좋아합니다. 혁신적인 사고방식을 가진 유형입니다.",
    INTJ: "계획적이고 전략적인 사고를 하며 독립적입니다. 미래를 내다보는 통찰력이 뛰어납니다.",
    ENTJ: "지도자적 기질이 있으며 목표 달성을 위해 체계적으로 행동합니다.",
    ISFP: "조용하고 온화하며 현재의 순간을 소중히 여깁니다. 감각적이고 미적 감각이 뛰어납니다.",
    ESFP: "활동적이고 사교적이며 즐거움을 추구합니다. 타인의 기분을 잘 파악합니다.",
    ISTP: "논리적이면서 실용적인 문제 해결 능력이 뛰어납니다. 상황에 유연하게 대처합니다.",
    ESTP: "현실적이며 행동 중심적입니다. 즉흥적인 상황에도 강한 적응력을 보입니다.",
    ISFJ: "성실하고 책임감이 강하며 타인을 돕는 것에 보람을 느낍니다.",
    ESFJ: "타인과 조화를 중요시하며 따뜻하고 사교적입니다. 공동체 의식이 강합니다.",
    ISTJ: "신중하고 철저하며 규칙을 잘 따릅니다. 계획적으로 일하는 것을 선호합니다.",
    ESTJ: "현실적이고 조직적인 리더 유형입니다. 질서와 구조를 중요시합니다.",
};

const MBTI_KEYWORDS = {
    INFP: ["감성", "이상주의", "창의"], ENFP: ["열정", "창의", "교류"],
    INFJ: ["통찰", "배려", "깊이"], ENFJ: ["리더", "사교", "조화"],
    INTP: ["분석", "지식", "논리"], ENTP: ["혁신", "토론", "도전"],
    INTJ: ["전략", "독립", "예측"], ENTJ: ["결단", "조직", "목표"],
    ISFP: ["온화", "예술", "감각"], ESFP: ["사교", "활동", "즐거움"],
    ISTP: ["실용", "유연", "문제해결"], ESTP: ["즉흥", "현실", "적응"],
    ISFJ: ["헌신", "책임", "지원"], ESFJ: ["조화", "사랑", "배려"],
    ISTJ: ["성실", "규칙", "계획"], ESTJ: ["조직", "리더", "실행"],
};

const getMBTIColor = (t) => MBTI_COLOR[`${t[1]}${t[2]}`] || "#8e44ff";

const dataURLtoFile = (dataUrl, filename) => {
    const [header, b64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)[1];
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return new File([buf], filename, { type: mime });
};

const makeConfetti = (color) =>
    Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const style = {
            left: Math.random() * 100 + "%",
            width: 6 + Math.random() * 6 + "px",
            height: 6 + Math.random() * 6 + "px",
            backgroundColor: color,
            animationDelay: Math.random() * 2 + "s",
        };
        return <div key={i} className="confetti" style={style} />;
    });

export default function MBTIByFace() {
    const [gender, setGender] = useState("male");
    const [useWebcam, setUseWebcam] = useState(false);
    const [image, setImage] = useState(null);
    const [origFile, setOrigFile] = useState(null);
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
        if (videoWrapperRef.current) {
            videoWrapperRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
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
            navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current.play();
                        setWebcamReady(true);
                        setWebcamStream(stream);
                    };
                }
            }).catch((e) => {
                alert("웹캠 접근 실패");
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
        setOrigFile(file);
        const reader = new FileReader();
        reader.onload = async () => {
            setImage(reader.result);
            setLoading(true);
            const img = new Image();
            img.src = reader.result;
            img.onload = async () => {
                try { await predictFromImage(img); } catch { alert("분석 오류"); }
                finally { setLoading(false); }
            };
        };
        reader.readAsDataURL(file);
    };

    const captureFromWebcam = async () => {
        if (!videoRef.current) return;
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
        const img = new Image();
        img.src = canvas.toDataURL("image/jpeg");
        setImage(img.src);
        setLoading(true);
        if (webcamStream) webcamStream.getTracks().forEach((t) => t.stop());
        try { await predictFromImage(img); }
        catch { alert("분석 오류"); }
        finally {
            setLoading(false);
            setWebcamDone(true);
        }
    };

    const reset = () => {
        setImage(null); setOrigFile(null); setMBTI(null); setModalOpen(false);
        setKeywords([]); setConfetti([]); setWebcamDone(false);
        if (webcamStream) webcamStream.getTracks().forEach((t) => t.stop());
        setWebcamStream(null); setUseWebcam(false);
    };

    const saveShot = () => {
        if (!modalRef.current) return;
        html2canvas(modalRef.current, { scale: 2 }).then((canvas) => {
            const a = document.createElement("a");
            a.download = "mbti-result.png";
            a.href = canvas.toDataURL("image/png", 0.9);
            a.click();
        });
    };

    const shareKakao = async () => {
        const { Kakao } = window;
        if (!Kakao?.isInitialized()) return alert("카카오 SDK 준비 중!");
        try {
            let file = origFile;
            if (!file) {
                const canvas = await html2canvas(modalRef.current, { scale: 1 });
                const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
                file = dataURLtoFile(dataUrl, "result.jpg");
            }
            if (file.size > MAX_UPLOAD_SIZE) return alert("이미지 5MB 초과");
            const { infos } = await Kakao.Share.uploadImage({ file: [file] });
            const imgUrl = infos.original.url;
            const pageUrl = window.location.origin;
            await Kakao.Share.sendDefault({
                objectType: "feed",
                content: {
                    title: `내 관상 MBTI는 ${mbti}!`,
                    description: MBTI_DESC[mbti],
                    imageUrl: imgUrl,
                    link: { mobileWebUrl: pageUrl, webUrl: pageUrl },
                },
                buttons: [
                    { title: "나도 측정하기", link: { mobileWebUrl: pageUrl, webUrl: pageUrl } },
                ],
            });
        } catch (e) {
            console.error(e);
            alert("카카오 공유 실패");
        }
    };

    return (
        <div className="page">
            {modalOpen && (
                <div className="overlay-blur">
                    <div className="result-modal" ref={modalRef} style={{ "--mbti-color": mbtiColor }}>
                        <div className="confetti-wrapper">{confetti}</div>
                        <img className="modal-photo-circle" src={image} alt="uploaded" />
                        <p className="mbti-type">예측된 MBTI: <strong>{mbti}</strong></p>
                        <p className="mbti-desc">{MBTI_DESC[mbti]}</p>
                        <div className="keyword-list">
                            {keywords.map((k) => (
                                <span key={k} className="tag" style={{ "--mbti-color": mbtiColor }}>{k}</span>
                            ))}
                        </div>
                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>다시 하기</button>
                            <button className="btn-save" onClick={saveShot}>결과 저장</button>
                            <button className="btn-kakao" onClick={shareKakao}>카카오톡 공유</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <header>
                    <h1>관상으로 보는 MBTI</h1>
                    <p className="subtitle">성별을 선택하고 아래 방식 중 하나로 측정해보세요</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                <div className="mode-toggle-buttons">
                    <button className={!useWebcam ? "mode-button active" : "mode-button"} onClick={() => setUseWebcam(false)}>
                        사진 업로드하기
                    </button>
                    <button
                        className={useWebcam ? "mode-button active" : "mode-button"}
                        onClick={() => {
                            setUseWebcam(true);
                            setTimeout(scrollToWebcam, 100);
                        }}
                    >
                        실시간으로 분석하기
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
                                        <span className="upload-label">사진 업로드</span>
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
                                                분석이 완료되었습니다. 다시 시도하려면 버튼을 눌러주세요.
                                            </div>
                                            <button className="btn-retry webcam-retry" onClick={reset}>다시 시도하기</button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="webcam-overlay-text">
                                                {webcamReady ? "분석을 시작하세요" : "웹캠 준비 중..."}
                                            </div>
                                            {webcamReady && (
                                                <button className="btn-analyze" onClick={captureFromWebcam}>분석 시작</button>
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