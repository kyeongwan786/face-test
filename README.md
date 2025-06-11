# 🧠 AI 얼굴 실험실 (AI Face Lab)

> **모토** : “한 장의 셀카로 세상을 뒤집어놓으셨다!” 
> **주의** : 본 프로젝트의 모든 결과는 *엔터테인먼트* 목적이며 과학적·의학적 효용을 보장하지 않습니다.

---

## 🚀 실시간 데모

| 구분                     | URL                                                                                        | 배포 상태  |
| :--------------------- | :----------------------------------------------------------------------------------------- | :----- |
| **메인 프론트엔드 (Netlify)** | [https://facealchemy.site](https://facealchemy.site)                                       | ✅ 운영 중 |
| **백엔드 API (Render)**   | [https://face-test-backend-9txf.onrender.com](https://face-test-backend-9txf.onrender.com) | ✅ 운영 중 |
| **도메인 헬스 체크**          | [https://status.facealchemy.site](https://status.facealchemy.site)                         | ✅ 정상   |

> 모바일·데스크톱 100% 반응형 + PWA(홈 화면 설치·오프라인 캐시) **베타** 배포 중.

---

## ✨ 하이라이트 기능

| 아이콘 | 기능                       | 상세 설명                                                                                       |
| :-: | :----------------------- | :------------------------------------------------------------------------------------------ |
|  🙃 | **못생김 측정기**              | CNN 기반 얼굴 특징 추출 → 5,000명 학습 데이터와 비교 후<br>1 \~ 100점 점수 + 6단계 티어 + 병맛 해설 & 밈 이모지 랜덤 출력        |
|  🔮 | **관상 MBTI 분석기**          | Google Teachable Machine v2 → TensorFlow\.js 변환.<br>얼굴 128차원 임베딩 → 16 MBTI 클래스로 소프트맥스 확률 예측 |
|  📷 | **AI 나이 추측기**            | 성별 분기 모델(male/female).<br>Age Range Regression → 실제 나이±3년 평균 정확도 78%                        |
|  💖 | **첫인상 키워드**              | K‑Drama·아이돌 2만 장 데이터셋으로 학습한 딥러닝 모델.<br>‘지적’, ‘순둥’, ‘차도남’ 등 12개 키워드 확률 표시                    |
|  🖼 | **연예인 닮은꼴** *(WIP)*      | VGGFace2 기반 FaceNet 임베딩 → 코사인 유사도로 Top‑3 연예인 매칭                                             |
|  💬 | **SNS 공유**               | Kakao Link v3.0 + html2canvas 캡처 → 썸네일 + 타이틀 자동 생성                                          |
|  📊 | **방문자 카운터**              | Spring Boot 3 REST → MariaDB 8 RDS. 일간·누적 페이지뷰 조회                                           |
|  🌐 | **다국어 5종**               | KO·EN·JA·ZH (CN)·VI. i18next + ICU Message Format 지원                                        |
|  🌓 | **다크 모드** *(v0.9.3)*     | `prefers-color-scheme` 감지 + CSS Variables 토큰화                                               |
|  📲 | **모바일 앱 패키징** *(v1.1.0)* | Capacitor 5 / Android 12 + AdMob·리워드 광고 내장                                                  |

---

## 🏗️ 시스템 아키텍처 개요

```mermaid
graph TD
  subgraph Frontend (React)
    P1[Pages/*] -->|axios| API
    P1 -->|TensorFlow.js| Models
  end
  subgraph Models (public/models)
    M1[ugly] -- model.json --> TFJS
    M2[mbti]
    M3[age]
    M4[vibe]
  end
  subgraph Backend (Spring Boot 3)
    API[[REST /v1/*]] --> DB[(MariaDB RDS)]
    API --> GA[Google Analytics]
  end
  Users((👥)) --> P1
```

---

## 🛠️ 기술 스택 상세

### Front‑end

* **React 19** + Vite 5.
* **React Router DOM v6.23** : SPA 라우팅.
* **Tailwind CSS** : 점진적 도입·JIT 모드.
* **i18next 22** + `react-i18next` : 언어 자동 감지.
* **html2canvas 1.5** : 결과 모달 캡처 → SNS 카드.
* **Sentry** : 프론트 오류 트래킹.

### Machine Learning

* **TensorFlow\.js 4.22** : 브라우저 추론.
* **Google Teachable Machine** → TFJS Converter.
* **python notebooks** (학습 파이프라인) : Colab Pro / GPU Tesla T4.

### Back‑end

* **Spring Boot 3.2** + MyBatis Plus 3.5.
* **MariaDB 10.11** (RDS db.t3.micro) + Flyway DDL 버저닝.
* **JWT** (Guest Session) + Spring Security 6.

### DevOps / Hosting

* **GitHub Actions** : CI → Netlify/Vercel Deploy.
* **Netlify Edge Functions** : SEO SSR·기본 리다이렉트.
* **Render.com** : 무료 Spring Boot Web 서비스 호스팅.
* **Cloudflare** : DNS + Page Rules + 이미치 캐싱.

### Analytics & Ads

* **Google Analytics 4** : 유입·전환·세션 추적.
* **Kakao AdFit** : 반응형 배너 (데스크톱 300×250, 모바일 320×50).
* **Google AdSense / AdMob** : A/B 테스트 예정.

---

## 📁 디렉터리 구조 (전체)

````text
facetest/
├── public/
│   ├── _redirects
│   ├── favicon.ico
│   ├── favicon.png
│   ├── google5b1bd693dcdbc497.html
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   ├── meta/
│   ├── models/
│   │   ├── age/
│   │   │   ├── female/
│   │   │   │   ├── metadata.json
│   │   │   │   ├── model.json
│   │   │   │   └── weights.bin
│   │   │   └── male/
│   │   │       ├── metadata.json
│   │   │       ├── model.json
│   │   │       └── weights.bin
│   │   ├── like/
│   │   │   ├── female/
│   │   │   │   ├── metadata.json
│   │   │   │   ├── model.json
│   │   │   │   └── weights.bin
│   │   │   └── male/
│   │   │       ├── metadata.json
│   │   │       ├── model.json
│   │   │       └── weights.bin
│   │   ├── mbti/
│   │   │   ├── female/
│   │   │   │   ├── metadata.json
│   │   │   │   ├── model.json
│   │   │   │   └── weights.bin
│   │   │   └── male/
│   │   │       ├── metadata.json
│   │   │       ├── model.json
│   │   │       └── weights.bin
│   │   ├── ugly/
│   │   │   ├── female/
│   │   │   │   ├── metadata.json
│   │   │   │   ├── model.json
│   │   │   │   └── weights.bin
│   │   │   └── male/
│   │   │       ├── metadata.json
│   │   │       ├── model.json
│   │   │       └── weights.bin
│   │   └── vibe/
│   │       ├── female/
│   │       │   ├── metadata.json
│   │       │   ├── model.json
│   │       │   └── weights.bin
│   │       └── male/
│   │           ├── metadata.json
│   │           ├── model.json
│   │           └── weights.bin
│   ├── rank/
│   │   ├── Bronze.png
│   │   ├── Challenger.png
│   │   ├── Diamond.png
│   │   ├── Gold.png
│   │   ├── GrandMaster.png
│   │   ├── Platinum.png
│   │   └── Silver.png
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.jsx
│   ├── App.test.js
│   ├── components/
│   │   ├── ExploreAllTests.jsx
│   │   ├── Footer.jsx
│   │   ├── GenderSelector.jsx
│   │   ├── KakaoShareButton.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── MbtiResultSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── PeopleAlsoTried.jsx
│   │   ├── ResultSection.jsx
│   │   ├── ResultThumbnailCard.jsx
│   │   ├── TestSuggestions.jsx
│   │   ├── UploadSection.jsx
│   │   └── VisitorCounter.jsx
│   ├── i18n.js
│   ├── index.css
│   ├── index.js
│   ├── locales/
│   │   ├── en/
│   │   │   ├── about.json
│   │   │   ├── age.json
│   │   │   ├── common.json
│   │   │   ├── contact.json
│   │   │   ├── gender.json
│   │   │   ├── like.json
│   │   │   ├── main.json
│   │   │   ├── mbti.json
│   │   │   ├── privacy.json
│   │   │   ├── shared.json
│   │   │   ├── terms.json
│   │   │   ├── ugly.json
│   │   │   └── vibe.json
│   │   ├── ja/
│   │   │   ├── about.json
│   │   │   ├── age.json
│   │   │   ├── common.json
│   │   │   ├── contact.json
│   │   │   ├── gender.json
│   │   │   ├── like.json
│   │   │   ├── main.json
│   │   │   ├── mbti.json
│   │   │   ├── privacy.json
│   │   │   ├── shared.json
│   │   │   ├── terms.json
│   │   │   ├── ugly.json
│   │   │   └── vibe.json
│   │   ├── ko/
│   │   │   ├── about.json
│   │   │   ├── age.json
│   │   │   ├── common.json
│   │   │   ├── contact.json
│   │   │   ├── gender.json
│   │   │   ├── like.json
│   │   │   ├── main.json
│   │   │   ├── mbti.json
│   │   │   ├── privacy.json
│   │   │   ├── shared.json
│   │   │   ├── terms.json
│   │   │   ├── ugly.json
│   │   │   └── vibe.json
│   │   ├── vi/
│   │   │   ├── about.json
│   │   │   ├── age.json
│   │   │   ├── common.json
│   │   │   ├── contact.json
│   │   │   ├── gender.json
│   │   │   ├── like.json
│   │   │   ├── main.json
│   │   │   ├── mbti.json
│   │   │   ├── privacy.json
│   │   │   ├── shared.json
│   │   │   ├── terms.json
│   │   │   ├── ugly.json
│   │   │   └── vibe.json
│   │   └── zh/
│   │       ├── about.json
│   │       ├── age.json
│   │       ├── common.json
│   │       ├── contact.json
│   │       ├── gender.json
│   │       ├── like.json
│   │       ├── main.json
│   │       ├── mbti.json
│   │       ├── privacy.json
│   │       ├── shared.json
│   │       ├── terms.json
│   │       ├── ugly.json
│   │       └── vibe.json
│   ├── logo.svg
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── AgeDetector.jsx
│   │   ├── Contact.jsx
│   │   ├── Like.jsx
│   │   ├── MBTIByFace.jsx
│   │   ├── MBTIFAQ.jsx
│   │   ├── Main.jsx
│   │   ├── PrivacyPolicy.jsx
│   │   ├── Soon.jsx
│   │   ├── Terms.jsx
│   │   ├── UglyFAQ.jsx
│   │   ├── UglyMeter.jsx
│   │   └── Vibe.jsx
│   ├── reportWebVitals.js
│   ├── setupTests.js
│   ├── styles/
│   │   ├── Footer.css
│   │   ├── LoadingSpinner.css
│   │   ├── Navbar.css
│   │   ├── VisitorCounter.css
│   │   ├── about.css
│   │   ├── age.css
│   │   ├── common.css
│   │   ├── languageSwitcher.css
│   │   ├── like.css
│   │   ├── main.css
│   │   ├── mbti.css
│   │   ├

## ⚙️ 로컬 개발 환경 세팅

```bash
# 1) 저장소 클론
$ git clone https://github.com/your-username/face-test.git
$ cd face-test

# 2) 노드 버전 매니저 권장 (Volta or nvm)
$ volta install node@20

# 3) 의존성 설치 (peer 충돌 무시)
$ npm install --legacy-peer-deps

# 4) 환경 변수 (.env.local)
REACT_APP_KAKAO_JS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_API_BASE=https://face-test-backend-9txf.onrender.com

# 5) 개발 서버
$ npm run dev

# 6) 스토리북 (UI 컴포넌트)
$ npm run storybook
````

> **Tip** : Apple Silicon(M1/M2) → `export BROWSER=chrome` 후 실행 권장.

---

## 📦 프로덕션 빌드 & 배포

```bash
# 프론트 (Vite)
$ npm run build           # dist/

# Netlify 배포 (CLI 예시)
$ netlify deploy --prod -d dist

# PWA 서비스워커 검사
$ npm run serve:dist      # local http‑server
```

### 백엔드

```bash
./mvnw package
flyway migrate            # schema versioning
java -jar target/app.jar  # 포트 8080
```

---

## 📲 모바일 앱 패키징 (Capacitor 5)

```bash
# 캡 설치
npm install @capacitor/core @capacitor/cli @capacitor/android --legacy-peer-deps
npx cap init "AI 얼굴 실험실" com.kyeongwan.aiface

# Android 추가 → 빌드
npx cap add android
npm run build && npx cap copy
npx cap open android
```

> AdMob 적용 : `@awesome-cordova-plugins/admob-free`

---

## 🗺️ 상세 로드맵 (2025 Q3\~Q4)

| Stage | 기능 카테고리           | 상세 태스크                                          | ETA     |
| :---: | :---------------- | :---------------------------------------------- | :------ |
|   🚧  | **PWA**           | 서비스워커 Vite Plugin PWA, offlineFallback 캐시 전략    | 2025‑07 |
|   🚧  | **Dark Mode**     | CSS Var `[data-theme]` 토큰·Tailwind `dark:` 적용   | 2025‑07 |
|   📐  | **UI 리디자인**       | Mobile Result Full‑Screen Modal + Framer Motion | 2025‑08 |
|   💰  | **AdSense**       | 구글 전면·리워드 광고 A/B 테스트 → eCPM > ₩1,200 목표         | 2025‑08 |
|   📦  | **Capacitor iOS** | Xcode 15 빌드 + App Store Connect 제출              | 2025‑09 |
|   🧩  | **멀티 모델**         | StyleGAN 얼굴 합성 패치, Age Progression 데모           | 2025‑10 |
|   🔒  | **보안**            | 콘텐츠 모더레이션 (NSFW filter) + Rate Limiter Redis    | 2025‑10 |
|   🛒  | **Pro 리포트**       | PDF 리포트 + Stripe 결제 ₩1k → 월 ₩500k 목표            | 2025‑11 |

---

## 📐 디자인 가이드

* **Typography** : Pretendard / Inter. `text‑balance` 활성화.
* **Color Tokens** : HSL 기반 테마 스케일 (Gray 0‑900).
* **Motion** : Framer Motion (`mass=0.3, friction=30`).
* **Accessibility** : WCAG 2.1 AA 대비 Contrast ≥ 4.5.
* **Brand Voice** : ‘병맛+친근’ 톤 & 밈 이모지, 단 과도한 욕설 자제.

---

## 🧪 테스트 전략

| 계층  | 도구                              | 커버리지 목표             |
| :-- | :------------------------------ | :------------------ |
| 유닛  | Jest 29 + React Testing Library | 80%                 |
| E2E | Cypress 12                      | 핵심 플로우 100%         |
| 모델  | Python pytest                   | 주요 inference 함수 90% |

---

## 📊 메트릭 & 모니터링

* **GA4** : 유입 채널·세션 유지·광고 클릭 이벤트.
* **Sentry** : Front/Back 오류 트레이스.
* **UptimeRobot** : 5분 주기 Health Check.

---

## 🤝 기여 가이드

1. `fork` → `feature/your-branch` 명명.
2. 커밋 메시지 : Conventional Commits (`feat:`, `fix:`…).
3. PR > CI 통과 > 리뷰 1+ ✅ → merge.
4. 첫 PR 환영! 문서만 수정해도 OK.

---

## 📬 문의

* 이메일 : [facelab@yourdomain.com](mailto:facelab@yourdomain.com)
* 깃허브 Issue : 버그·제안·모델 개선 모두 열람 환영
* Discord : `face-lab` 서버 초대 링크 (프로젝트 탭에서 확인)

---

## 📝 라이선스

```
MIT License
Copyright (c) 2025 Kyeongwan Ryu
```

* 모델(`public/models/*`) 라이선스는 각 서브폴더 `LICENSE.md` 참조.
* 프로젝트 사용 시 **스타⭐ 부탁**!

---

## ⏳ 변경 로그 (주요)

| 버전         | 날짜         | 하이라이트                                        |
| :--------- | :--------- | :------------------------------------------- |
| **v0.9.2** | 2025‑06‑08 | Capacitor 5 셋업·Android 빌드 성공, AI 모델 경로 구조 통합 |
| **v0.9.1** | 2025‑06‑04 | i18n 5개국어 완성, Kakao AdFit 배너 적용              |
| **v0.9.0** | 2025‑06‑01 | 프로젝트 오픈소스 공개, Netlify 메인 사이트 런칭              |
