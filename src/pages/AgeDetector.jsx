// ✅ AgeDetector.jsx with i18n support (with LanguageSwitcher)
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";
import { useTranslation } from "react-i18next";

import "../styles/neo-common.css";
import "../styles/age.css";

import LoadingSpinner from "../components/LoadingSpinner";
import GenderSelector from "../components/GenderSelector";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { runAgeEstimation } from "../utils/runAgeModel";

export default function AgeDetector() {
    const { t } = useTranslation("age");

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
        webcamWrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
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
        setTick(t("analyzing"));
        setDesc(t("initialDesc"));
        setDone(false);

        const img = new Image();
        img.src = dataUrl;
        img.onload = async () => {
            try {
                const cls = await runAgeEstimation(img, gender);
                const final = Math.floor(Math.random() * 10) + cls;
                startBounce(final);
                setTimeout(() => {
                    setDesc(t(`group${cls}.desc`));
                    setKeywords(t(`group${cls}.keywords`, { returnObjects: true }));
                }, 3600);
            } catch (e) {
                console.error(e);
                alert(t("fail"));
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

    const shareKakao = () => alert(t("notImplemented"));

    const gaugeW = !isNaN(Number(tick)) ? `${(tick / 80) * 100}%` : "0%";

    return (
        <div className="page">
            <LanguageSwitcher />

            {modal && (
                <div className="overlay-blur" onClick={(e) => {
                    if (e.target.classList.contains("overlay-blur")) reset();
                }}>
                    <div className="result-modal age-modal" ref={modalRef}>
                        <button className="modal-close-button" onClick={reset}>x</button>
                        <img className="modal-photo-circle" src={image} alt="face" />
                        <h2 className="age-head">
                            <span className="ai-gradient">{t("ageLabel")}</span><br />
                            <strong className={`age-number ${done ? "final" : ""}`}>{tick}</strong>
                        </h2>
                        <div className="age-bar-wrapper">
                            <div className="age-bar-bg">
                                <div className="age-bar-fill" style={{ width: gaugeW }} />
                            </div>
                            <div className="age-labels">
                                {[10, 20, 30, 40, 50, 60, 70, 80].map((n) => <span key={n}>{n}</span>)}
                            </div>
                        </div>
                        <div className={`desc-box ${done ? "enhanced" : ""}`} dangerouslySetInnerHTML={{ __html: desc }} />
                        <div className="keyword-tags">
                            {keywords.map((kw, i) => <span className="keyword-tag" key={i}>{kw}</span>)}
                        </div>
                        <div className="modal-buttons">
                            <button className="btn-retry" onClick={reset}>{t("retry")}</button>
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

                {!image && !loading && (
                    <div className="mode-toggle-buttons">
                        <button className={!cam ? "mode-button active" : "mode-button"} onClick={() => setCam(false)}>{t("uploadButton")}</button>
                        <button className={cam ? "mode-button active" : "mode-button"} onClick={() => { setCam(true); setTimeout(scrollToWebcam, 100); }}>{t("webcamButton")}</button>
                    </div>
                )}

                {loading && <LoadingSpinner />}

                {!image && !loading && cam && (
                    <div className="webcam-wrapper" ref={webcamWrapperRef}>
                        <Webcam ref={webcamRef} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "user" }} className="video-frame" />
                        <p className="webcam-overlay-text">{t("webcamOverlay")}</p>
                        <button className="capture-button" onClick={capture}>{t("startAnalysis")}</button>
                    </div>
                )}

                {!image && !loading && !cam && (
                    <div className="upload-wrapper">
                        <label className="upload-box" htmlFor="uploadAgeInput">{t("uploadButton")}</label>
                        <input id="uploadAgeInput" type="file" accept="image/*" hidden onChange={upload} />
                    </div>
                )}
            </div>
        </div>
    );
}
