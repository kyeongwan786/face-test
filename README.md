# 🧠 AI 얼굴 실험실 (AI Face Lab)

**AI 얼굴 실험실**은 사용자의 얼굴 이미지를 업로드하거나 웹캠으로 촬영하여, 다양한 AI 모델을 통해 얼굴을 분석하고 재미 요소 중심의 결과를 제공하는 엔터테인먼트형 웹 플랫폼입니다. 분석 항목으로는 못생김 점수, 관상 MBTI, AI 나이 추측, 첫인상 인식 등이 있으며, 모든 기능은 오락 목적이며 실제 과학적 정확도와는 무관합니다.

---

## ✨ 제공 기능 요약

- 🙃 **못생김 측정기**: 얼굴 이미지를 분석해 못생김 점수와 등급(티어)을 제공하며, 각 결과에 따라 개성 있는 해설을 출력
- 🔮 **관상 MBTI 분석기**: 얼굴만 보고 Teachable Machine 기반 AI가 예측한 MBTI 결과를 시각적으로 보여줌
- 📷 **AI 나이 추측기**: 남/여로 분기된 모델을 통해 얼굴의 예상 나이를 출력함
- 💖 **첫인상 분석기 (Vibe)**: 연예인 이미지 기반으로 학습한 모델을 통해 첫인상 키워드(예: smart, cold, stylish 등)를 반환하고 결과에 대한 설명까지 출력
- 🧾 **이용약관 / 개인정보처리방침**: 사용자 보호 및 Google AdSense 승인 대비를 위한 법적 고지 페이지 구성
- 🌐 **다국어 지원**: i18next 기반으로 한글, 영어, 일본어, 중국어, 베트남어 완비 (JSON 분할)
- 📊 **방문자 수 표시**: Spring Boot + MyBatis + MariaDB를 활용한 일간 / 누적 방문자 수 표시
- 📱 **모바일 / 태블릿 완전 대응**: 반응형 CSS를 통해 모든 기기에서 보기 좋게 구성
- 💬 **카카오톡 공유 기능**: 결과 캡처 또는 이미지 추출 후 카카오톡 공유까지 한 번에 지원
- 🌘 **다크 모드 지원 예정**
- 📲 **앱화(PWA)**: 장기적으로 React 기반으로 웹앱화하여 iOS/Android 앱 출시 계획

---

## 📁 프로젝트 디렉토리 구조

```
facetest/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── robots.txt
│   ├── manifest.json
│   ├── _redirects
│   ├── models/             # Teachable Machine 모델들 (분기별)
│   │   ├── age/
│   │   ├── mbti/
│   │   ├── ugly/
│   │   └── vibe/
│   ├── rank/               # 티어 배지 이미지
│   └── logo*.png
│
├── src/
│   ├── components/         # 재사용 가능한 UI 컴포넌트 모듈
│   │   ├── Footer.jsx
│   │   ├── GenderSelector.jsx
│   │   ├── KakaoShareButton.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ResultSection.jsx
│   │   ├── UploadSection.jsx
│   │   └── VisitorCounter.jsx
│   │
│   ├── pages/              # 주요 기능 페이지별 JSX 구성
│   │   ├── About.jsx
│   │   ├── AgeDetector.jsx
│   │   ├── Contact.jsx
│   │   ├── Main.jsx
│   │   ├── MBTIByFace.jsx
│   │   ├── MBTIFAQ.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Terms.jsx
│   │   ├── UglyFAQ.jsx
│   │   ├── UglyMeter.jsx
│   │   └── Vibe.jsx
│   │
│   ├── styles/             # 각 페이지 및 컴포넌트 스타일
│   │   ├── about.css
│   │   ├── common.css
│   │   ├── Footer.css
│   │   ├── LoadingSpinner.css
│   │   ├── mbti.css
│   │   ├── Navbar.css
│   │   ├── neo-common.css
│   │   ├── main.css
│   │   ├── ugly.css
│   │   └── vibe.css
│   │
│   ├── locales/            # i18n 다국어 JSON 리소스
│   │   ├── ko/
│   │   ├── en/
│   │   ├── ja/
│   │   ├── zh/
│   │   └── vi/
│   │     ├── shared.json
│   │     ├── about.json
│   │     ├── main.json
│   │     ├── ugly.json
│   │     ├── terms.json
│   │     ├── privacy.json
│   │     └── gender.json
│   │
│   ├── utils/              # 모델 로딩 및 처리 로직
│   │   ├── runAgeModel.js
│   │   ├── runMBTIModel.js
│   │   ├── runModel.js
│   │   ├── runVibeModel.js
│   │   ├── likePresets.js
│   │   └── vibePresets.js
│   │
│   ├── App.jsx
│   ├── index.js
│   ├── index.css
│   └── i18n.js             # 다국어 초기화
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
```

---

## ⚙️ 개발 실행

```bash
$ git clone https://github.com/your-username/facetest.git
$ cd facetest
$ npm install
$ npm start
```

---

## 🔧 현재 진행 중 및 예정 작업

- [ ] 다국어 JSON (main/ugly/terms/privacy/about/gender 등) 누락 및 key 누락 전수검사
- [ ] MBTI / 나이 / Vibe 페이지 다국어 적용 및 결과 텍스트 분기 처리
- [ ] Kakao 공유 기능 모든 테스트에 적용
- [ ] 모바일에서 모달, 레이아웃, 언어 선택 UI 완전 최적화
- [ ] 다크모드 테마 toggle 및 css 구조화
- [ ] Teachable Machine 모델 버전 리팩토링 (고정 seed 등)
- [ ] SEO / 메타태그 정비 (title, og:image 등 포함)
- [ ] 서비스 워커 / manifest 통한 PWA 기능 강화 및 아이콘 구성
- [ ] 앱 배포 준비 (Capacitor 또는 React Native로 포팅 검토)
- [ ] Google AdSense 승인 준비: 법적 고지, 콘텐츠 정책, 사용자 경험 전반 정비
- [ ] 언어 선택 부분 로고 밑으로 빼기.
- [ ] navbar 네이밍 수정

---

## 🚀 배포 계획

- ✅ Netlify 배포 완료 (기본 웹 테스트용)
- [ ] Vercel 등 멀티 호스팅 고려 + CDN 테스트
- [ ] 웹앱(PWA) 배포를 기반으로 App Store / Google Play 등록 준비

---

## 🗓 버전 기록

- `2025-06-01`: 다국어 구조 재정비, LanguageSwitcher 재설계, README 정비
- `2025-05-29`: Vibe 결과 상세화 및 모달 스타일 개선
- `2025-05-24`: 반응형 완성 및 Navbar 인터랙션 개선
- `2025-05-10`: React 19 적용 및 기능 통합
- `2025-04-20`: AI 모델 기반 얼굴 분석 기능 통합 완료
- `2025-03-05`: 프로젝트 시작

---

**문의 / 제안 / 버그 제보**: GitHub Issue 또는 Contact 페이지를 통해 남겨주세요 🙇
