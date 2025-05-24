# AI 얼굴 실험실

AI 얼굴 실험실은 유저의 얼굴 이미지를 분석하여 다양한 재미 요소를 제공하는 웹 기반 인터랙티브 플랫폼입니다.

못생김 측정기, 관상으로 보는 MBTI, AI 나이 추측, AI 호감도 분석 등 다양한 얼굴 기반 테스트를 제공하며,
React 기반으로 구축되어 있고 Teachable Machine 모델을 활용해 AI 추론을 수행합니다.

## 🔧 프로젝트 구조 설명

```
facetest/
├── public/
│   ├── models/                # Teachable Machine에서 export한 gender별 모델 파일
│   │   ├── female/            # 여성 모델 metadata.json, model.json, weights.bin
│   │   └── male/              # 남성 모델 metadata.json, model.json, weights.bin
│   ├── rank/                  # 티어 뱃지 이미지 리소스
│   ├── favicon.ico
│   └── index.html
│
├── src/
│   ├── components/           # 재사용 가능한 UI 컴포넌트 모듈들
│   │   ├── GenderSelector.jsx      # 남/여 성별 선택 버튼 UI
│   │   ├── KakaoShareButton.jsx   # 카카오톡 공유 버튼 컴포넌트
│   │   ├── Navbar.jsx              # 최상단 고정 네비게이션 바
│   │   ├── ResultSection.jsx       # 결과 모달 섹션 (이미지, 점수, 티어 등)
│   │   └── UploadSection.jsx       # 사진 업로드 관련 컴포넌트
│
│   ├── pages/                # 라우팅되는 각 페이지 단위 컴포넌트
│   │   ├── Main.jsx               # 메인 랜딩 페이지
│   │   ├── UglyMeter.jsx         # 못생김 측정기
│   │   ├── MBTIByFace.jsx        # 관상 기반 MBTI 분석
│   │   ├── AgeDetector.jsx       # AI 나이 분석
│   │   ├── Contact.jsx           # 문의하기 페이지
│   │   ├── PrivacyPolicy.jsx     # 개인정보 처리방침
│   │   ├── Terms.jsx             # 이용약관
│   │   ├── UglyFAQ.jsx           # 못생김 측정기 FAQ
│   │   └── MBTIFAQ.jsx           # MBTI 분석 FAQ
│
│   ├── styles/              # CSS 스타일 시트 파일 모듈화
│   │   ├── common.css            # 전역 테마 변수 및 공통 요소 스타일
│   │   ├── main.css              # 메인 페이지 전용 스타일
│   │   ├── ugly.css              # 못생김 측정기 전용 스타일
│   │   └── Navbar.css            # 네비게이션 바 스타일
│
│   ├── utils/               # AI 모델 추론 유틸리티
│   │   └── runModel.js           # 이미지 로딩 및 모델 예측 처리 함수
│
│   ├── App.jsx              # React Router 라우팅 설정 및 글로벌 레이아웃
│   ├── index.js             # React 앱의 진입점
│   └── index.css            # 초기화용 스타일 시트
```

---

## ✅ 지금까지 작업한 내용

* 전체 디자인 리뉴얼 (메인 랜딩 페이지 / 결과 모달 / 네브바 / 각 테스트 UI)
* CSS 모듈화 및 구조 분리 (common.css, main.css, ugly.css, Navbar.css)
* Teachable Machine 모델 분기 처리 (성별별 모델 로딩)
* 사진 업로드 기능 및 결과 표시 (티어 이미지, 점수, 카카오톡 공유 등)
* 성별 선택 인터페이스 개선 (기본 `<select>` 제거 → 버튼 UI 적용)
* 모든 페이지에 일관된 레이아웃 적용 (footer 가로폭 문제 해결)
* 라우팅 페이지 추가 및 연결 완료

    * `About`, `Contact`, `Terms`, `PrivacyPolicy`, `UglyFAQ`, `MBTIFAQ` 등

## 🧭 앞으로 해야 할 일

* [ ] 결과 공유 기능 성능 및 예외 처리 강화
* [ ] 애드센스 심사 준비용 SEO 개선 (meta 태그, Helmet 적용 등)
* [ ] 애드센스 정책 기반 콘텐츠 강화 (FAQ, 설명, 결과 해설 텍스트 추가)
* [ ] 사용자 데이터 처리에 대한 안내 보완 (입력한 사진은 서버에 저장되지 않음 등)

## ℹ️ 콘텐츠 설명

### 🙃 못생김 측정기

> 사용자가 업로드한 얼굴 이미지를 기반으로 AI가 "못생김 점수"를 추정하며, 티어 뱃지와 함께 결과를 표시합니다.

### 🔮 관상으로 보는 MBTI (추후 공개)

> 얼굴 이미지를 기반으로 관상적 특징을 분석하여 MBTI를 예측하는 기능입니다.

### 📈 FAQ 형식 콘텐츠 (Google AdSense 대비)

* `UglyFAQ`, `MBTIFAQ` 페이지는 각각 각 테스트에 대한 자주 묻는 질문을 다룹니다.
* 추론 방식, 신뢰도, 데이터 처리 방식 등 유저의 궁금증을 해소하기 위한 콘텐츠입니다.

### 🔒 개인정보처리방침 & 이용약관

* 구글 애드센스 승인을 위한 필수 법적 고지 페이지로 구성되어 있습니다.
* `/privacy` `/terms` 경로에 접근 가능하며, 각종 문의 페이지도 `/contact`로 연결됩니다.

## ✅ 기술 스택

* React 19
* React Router DOM 6
* Teachable Machine + @tensorflow/tfjs
* Tailwind 일부 유틸
* html2canvas (결과 캡처용)
* Kakao JavaScript SDK (카카오 공유)
* CSS Modules로 모듈화된 디자인 시스템 적용


---------2025.05.23---------
1. 댓글 / 공유 가능하게끔
2. 나머지 컨텐츠 보강




