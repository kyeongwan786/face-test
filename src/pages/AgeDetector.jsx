// ✅ Updated AgeDetector.jsx with smooth scroll on webcam mode activation
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

import "../styles/neo-common.css";
import "../styles/age.css";

import LoadingSpinner from "../components/LoadingSpinner";
import GenderSelector from "../components/GenderSelector";
import { runAgeEstimation } from "../utils/runAgeModel";

const AGE_GROUPS = {
    10: {
        min: 10,
        max: 19,
        desc: "어라? <strong>초딩</strong> 아니야? 👶<br>상큼하고 생기발랄! 아직도 급식 냄새가 나요.",
        keywords: ["초딩st", "상큼발랄", "급식체"]
    },
    20: {
        min: 20,
        max: 29,
        desc: "대학생 느낌 물씬 🎓<br><strong>인기 많았던 학과 인기인st</strong>.",
        keywords: ["20대 감성", "MT 여신", "캠퍼스 커플"]
    },
    30: {
        min: 30,
        max: 39,
        desc: "성숙미와 안정감의 조화 🧑‍💼<br><strong>지금이 외모 전성기입니다!</strong>",
        keywords: ["성숙미", "전성기", "안정감"]
    },
    40: {
        min: 40,
        max: 49,
        desc: "품격 있는 카리스마 💼<br>중후한 매력으로 사람을 사로잡는 타입.",
        keywords: ["중후함", "품격", "신뢰"]
    },
    50: {
        min: 50,
        max: 59,
        desc: "클래스는 영원하다 🧐<br><strong>말 한마디에 신뢰가 철철 넘쳐요.</strong>",
        keywords: ["신뢰감", "클래스", "노련미"]
    },
    60: {
        min: 60,
        max: 75,
        desc: "이순재 느낌 나는데요? 🎩<br>품위와 여유로움의 정점에 도달하셨습니다.",
        keywords: ["품위", "여유", "관록"]
    },
};

export default function AgeDetector() {
    const [gender, setGender] = useState("male");
    const [image, setImage] = useState(null);
    const [tick, setTick] = useState("--");
    const [desc, setDesc] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [cam, setCam] = useState(false);

    const webcamRef = useRef(null);
    const modalRef = useRef(null);
    const bounceRef = useRef(null);
    const settleRef = useRef(null);
    const webcamWrapperRef = useRef(null);

    const scrollToWebcam = () => {
        if (webcamWrapperRef.current) {
            webcamWrapperRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    const startBounce = (final) => {
        let pos = 10, dir = 3, elapsed = 0;
        bounceRef.current = setInterval(() => {
            pos += dir;
            if (pos >= 80 || pos <= 10) dir *= -1;
            setTick(pos);
            elapsed += 30;
            if (elapsed >= 3000) {
                clearInterval(bounceRef.current);
                startSettle(final);
            }
        }, 30);
    };

    const startSettle = (final) => {
        let f = 0;
        settleRef.current = setInterval(() => {
            const wobble = Math.sin((f / 24) * Math.PI * 6) * 4;
            setTick(Math.round(final + wobble));
            if (++f >= 24) {
                clearInterval(settleRef.current);
                setTick(final);
                setDone(true);
            }
        }, 25);
    };

    const processImage = async (dataUrl) => {
        setImage(dataUrl);
        setModal(true);
        setLoading(true);
        setTick("분석중");
        setDesc("AI가 얼굴 특징을 분석 중입니다…");
        setDone(false);

        const img = new Image();
        img.src = dataUrl;
        img.onload = async () => {
            try {
                const cls = await runAgeEstimation(img, gender);
                const group = AGE_GROUPS[cls] || AGE_GROUPS[30];
                const final = Math.floor(Math.random() * (group.max - group.min + 1)) + group.min;
                startBounce(final);
                setTimeout(() => {
                    setDesc(group.desc);
                    setKeywords(group.keywords || []);
                }, 3600);
            } catch (e) {
                console.error(e);
                alert("AI 예측 실패");
            } finally {
                setLoading(false);
            }
        };
    };

    const upload = (e) => {
        const f = e.target.files[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => processImage(r.result);
        r.readAsDataURL(f);
    };

    const capture = () => webcamRef.current && processImage(webcamRef.current.getScreenshot());

    const reset = () => {
        clearInterval(bounceRef.current);
        clearInterval(settleRef.current);
        setImage(null);
        setTick("--");
        setDesc("");
        setKeywords([]);
        setDone(false);
        setModal(false);
        setCam(false);
        setLoading(false);
    };

    const save = () =>
        modalRef.current &&
        html2canvas(modalRef.current, { scale: 2 }).then((c) => {
            const a = document.createElement("a");
            a.download = "age-result.png";
            a.href = c.toDataURL("image/png");
            a.click();
        });

    const gaugeW = !isNaN(Number(tick)) ? `${(tick / 80) * 100}%` : "0%";

    return (
        <div className="page">
            {modal && (
                <div className="overlay-blur">
                    <div className="result-modal age-modal" ref={modalRef}>
                        <img className="modal-photo-circle" src={image} alt="face" />
                        <h2 className="age-head">
                            <span className="ai-gradient">AI&nbsp;예측&nbsp;나이</span>
                            <br />
                            <strong className={`age-number ${done ? "final" : ""}`}>{tick}</strong>
                        </h2>

                        <div className="age-bar-wrapper">
                            <div className="age-bar-bg">
                                <div className="age-bar-fill" style={{ width: gaugeW }} />
                            </div>
                            <div className="age-labels">
                                {[10, 20, 30, 40, 50, 60, 70, 80].map((n) => (
                                    <span key={n}>{n}</span>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`desc-box ${done ? "enhanced" : ""}`}
                            dangerouslySetInnerHTML={{ __html: desc }}
                        />

                        <div className="keyword-tags">
                            {keywords.map((kw, i) => (
                                <span className="keyword-tag" key={i}>{kw}</span>
                            ))}
                        </div>

                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>다시 하기</button>
                            <button className="btn-save" onClick={save}>결과 저장</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container">
                <header>
                    <h1>AI 얼굴 나이 예측</h1>
                    <p className="subtitle">당신의 얼굴에서 AI가 나이를 추측해드립니다</p>
                </header>

                <GenderSelector gender={gender} setGender={setGender} />

                {!image && !loading && (
                    <div className="mode-toggle-buttons">
                        <button className={!cam ? "mode-button active" : "mode-button"} onClick={() => setCam(false)}>사진 업로드하기</button>
                        <button
                            className={cam ? "mode-button active" : "mode-button"}
                            onClick={() => {
                                setCam(true);
                                setTimeout(scrollToWebcam, 100);
                            }}
                        >
                            실시간으로 분석하기
                        </button>
                    </div>
                )}

                {loading && <LoadingSpinner />}

                {!image && !loading && cam && (
                    <div className="webcam-wrapper" ref={webcamWrapperRef}>
                        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "user" }} className="video-frame" />
                        <p className="webcam-overlay-text">분석을 시작하세요</p>
                        <button className="capture-button" onClick={capture}>분석 시작</button>
                    </div>
                )}

                {!image && !loading && !cam && (
                    <div className="upload-wrapper">
                        <label className="upload-box" htmlFor="uploadAgeInput">사진 업로드하기</label>
                        <input id="uploadAgeInput" type="file" accept="image/*" hidden onChange={upload} />
                    </div>
                )}
            </div>
        </div>
    );
}
