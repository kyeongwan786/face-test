// 📁 src/App.js
import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import html2canvas from "html2canvas";
import "./styles/App.css";

const MODEL_URL = "/model/";
const UGLY_KEY = "ugly";
const KAKAO_KEY = "d3f8af96c1e986cbfb2216380f1ea8e7";
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

const BUCKETS = [
  { max: 20, title: "조명 걱정 끝", sub: "화보 컷 바로 저장" },
  { max: 40, title: "화면 담당", sub: "프로필 갈아끼울 타이밍" },
  { max: 60, title: "평균선 착지", sub: "과금 없이 무난 클리어" },
  { max: 80, title: "카메라가 한숨", sub: "광각 켜도 답답" },
  { max: Infinity, title: "렌즈에 타격", sub: "친구들 캡처 중" }
];

const TIER_TABLE = [
  { max: 10, name: "Challenger", file: "Challenger.png", color: "#ffd700" },
  { max: 20, name: "Grandmaster", file: "Grandmaster.png", color: "#ff5252" },
  { max: 30, name: "Master", file: "Master.png", color: "#b56cff" },
  { max: 45, name: "Diamond", file: "Diamond.png", color: "#29d4f6" },
  { max: 60, name: "Platinum", file: "Platinum.png", color: "#2db8a8" },
  { max: 75, name: "Gold", file: "Gold.png", color: "#cfa93e" },
  { max: 90, name: "Silver", file: "Silver.png", color: "#aeb6bf" },
  { max: 101, name: "Bronze", file: "Bronze.png", color: "#5d5d5d" }
];

function getTier(score) {
  return TIER_TABLE.find(t => score < t.max);
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
    Bronze: "남은 인원"
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

export default function App() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [origFile, setOrigFile] = useState(null);
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState(null);
  const [tier, setTier] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!window.Kakao) {
      const s = document.createElement("script");
      s.src = "https://t1.kakaocdn.net/kakao_js_sdk/v1/kakao.min.js";
      s.onload = () => window.Kakao.init(KAKAO_KEY);
      document.head.appendChild(s);
    } else if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
    }
    (async () => {
      const m = await tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
      setModel(m);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!model || !image) return;
    const img = new Image();
    img.src = image;
    img.onload = async () => {
      const preds = await model.predict(img);
      const ugly = preds.find(p => p.className.toLowerCase().includes(UGLY_KEY));
      const s = Math.round((ugly?.probability ?? 0) * 100);
      setScore(s);
      setComment(BUCKETS.find(b => s < b.max));
      setTier(getTier(s));
      setModalOpen(true);
    };
  }, [image, model]);

  const handleUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    setOrigFile(file);
    const fr = new FileReader();
    fr.onload = () => setImage(fr.result);
    fr.readAsDataURL(file);
  };

  const reset = () => {
    setImage(null);
    setOrigFile(null);
    setScore(null);
    setComment(null);
    setTier(null);
    setModalOpen(false);
  };

  const saveShot = () => {
    if (!modalRef.current) return;
    html2canvas(modalRef.current, { scale: 2 }).then(canvas => {
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
        alert("이미지 크기가 5MB를 초과하여 카카오톡에 업로드할 수 없습니다. 파일을 다시 선택해 주세요.");
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
          link: { mobileWebUrl: pageUrl, webUrl: pageUrl }
        },
        buttons: [
          {
            title: "나도 측정하기",
            link: { mobileWebUrl: pageUrl, webUrl: pageUrl }
          }
        ]
      });
    } catch (err) {
      console.error(err);
      alert(`카카오톡 공유에 실패했습니다 🙏\n${err?.message || ""}`);
    }
  };

  return (
      <div className="container">
        {modalOpen && (
            <div className="overlay-blur">
              <div
                  className="result-modal"
                  ref={modalRef}
                  style={{ "--tier-color": tier?.color }}
              >
                <img src={image} alt="uploaded" className="modal-photo-circle" />

                <div className="tier-badge-wrapper">
                  <img
                      src={`/rank/${tier?.file}`}
                      alt={tier?.name}
                      style={{ width: 190, height: "auto" }}
                  />
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

        <header>
          <h1>못생김 측정 챌린지</h1>
          <p className="subtitle">사진을 올려 자존감 시험해 보자 🧪</p>
        </header>

        {loading && <p className="loading-text">🔄 모델 불러오는 중…</p>}

        {!image && !loading && (
            <label className="upload-box">
              📷 <span className="upload-label">사진 올리기</span>
              <input type="file" accept="image/*" hidden onChange={handleUpload} />
              <p className="upload-tip">얼굴이 뚜렷하면 OK!</p>
            </label>
        )}

        <footer>© 2025 Ugly Challenge</footer>
      </div>
  );
}
