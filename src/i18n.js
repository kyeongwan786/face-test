import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 📁 한국어
import koShared from "./locales/ko/shared.json";
import koAbout from "./locales/ko/about.json";
import koMain from "./locales/ko/main.json";
import koUgly from "./locales/ko/ugly.json";
import koTerms from "./locales/ko/terms.json";
import koPrivacy from "./locales/ko/privacy.json";
import koGender from "./locales/ko/gender.json";
import koMbti from "./locales/ko/mbti.json";
import koAge from "./locales/ko/age.json";
import koContact from "./locales/ko/contact.json";
import koVibe from "./locales/ko/vibe.json";
import koCommon from "./locales/ko/common.json";

// 📁 영어
import enShared from "./locales/en/shared.json";
import enAbout from "./locales/en/about.json";
import enMain from "./locales/en/main.json";
import enUgly from "./locales/en/ugly.json";
import enTerms from "./locales/en/terms.json";
import enPrivacy from "./locales/en/privacy.json";
import enGender from "./locales/en/gender.json";
import enMbti from "./locales/en/mbti.json";
import enAge from "./locales/en/age.json";
import enContact from "./locales/en/contact.json";
import enVibe from "./locales/en/vibe.json";
import enCommon from "./locales/en/common.json";

// 📁 일본어
import jaShared from "./locales/ja/shared.json";
import jaAbout from "./locales/ja/about.json";
import jaMain from "./locales/ja/main.json";
import jaUgly from "./locales/ja/ugly.json";
import jaTerms from "./locales/ja/terms.json";
import jaPrivacy from "./locales/ja/privacy.json";
import jaGender from "./locales/ja/gender.json";
import jaMbti from "./locales/ja/mbti.json";
import jaAge from "./locales/ja/age.json";
import jaContact from "./locales/ja/contact.json";
import jaVibe from "./locales/ja/vibe.json";
import jaCommon from "./locales/ja/common.json";

// 📁 중국어
import zhShared from "./locales/zh/shared.json";
import zhAbout from "./locales/zh/about.json";
import zhMain from "./locales/zh/main.json";
import zhUgly from "./locales/zh/ugly.json";
import zhTerms from "./locales/zh/terms.json";
import zhPrivacy from "./locales/zh/privacy.json";
import zhGender from "./locales/zh/gender.json";
import zhMbti from "./locales/zh/mbti.json";
import zhAge from "./locales/zh/age.json";
import zhContact from "./locales/zh/contact.json";
import zhVibe from "./locales/zh/vibe.json";
import zhCommon from "./locales/zh/common.json";

// 📁 베트남어
import viShared from "./locales/vi/shared.json";
import viAbout from "./locales/vi/about.json";
import viMain from "./locales/vi/main.json";
import viUgly from "./locales/vi/ugly.json";
import viTerms from "./locales/vi/terms.json";
import viPrivacy from "./locales/vi/privacy.json";
import viGender from "./locales/vi/gender.json";
import viMbti from "./locales/vi/mbti.json";
import viAge from "./locales/vi/age.json";
import viContact from "./locales/vi/contact.json";
import viVibe from "./locales/vi/vibe.json";
import viCommon from "./locales/vi/common.json";

i18n.use(initReactI18next).init({
    resources: {
        ko: {
            shared: koShared,
            about: koAbout,
            main: koMain,
            ugly: koUgly,
            terms: koTerms,
            privacy: koPrivacy,
            gender: koGender,
            mbti: koMbti,
            age: koAge,
            contact: koContact,
            vibe: koVibe,
            common: koCommon,
        },
        en: {
            shared: enShared,
            about: enAbout,
            main: enMain,
            ugly: enUgly,
            terms: enTerms,
            privacy: enPrivacy,
            gender: enGender,
            mbti: enMbti,
            age: enAge,
            contact: enContact,
            vibe: enVibe,
            common: enCommon,
        },
        ja: {
            shared: jaShared,
            about: jaAbout,
            main: jaMain,
            ugly: jaUgly,
            terms: jaTerms,
            privacy: jaPrivacy,
            gender: jaGender,
            mbti: jaMbti,
            age: jaAge,
            contact: jaContact,
            vibe: jaVibe,
            common: jaCommon,
        },
        zh: {
            shared: zhShared,
            about: zhAbout,
            main: zhMain,
            ugly: zhUgly,
            terms: zhTerms,
            privacy: zhPrivacy,
            gender: zhGender,
            mbti: zhMbti,
            age: zhAge,
            contact: zhContact,
            vibe: zhVibe,
            common: zhCommon,
        },
        vi: {
            shared: viShared,
            about: viAbout,
            main: viMain,
            ugly: viUgly,
            terms: viTerms,
            privacy: viPrivacy,
            gender: viGender,
            mbti: viMbti,
            age: viAge,
            contact: viContact,
            vibe: viVibe,
            common: viCommon,
        },
    },
    fallbackLng: "ko",
    lng: "ko",
    ns: [
        "shared",
        "about",
        "main",
        "ugly",
        "terms",
        "privacy",
        "gender",
        "mbti",
        "age",
        "contact",
        "vibe",
        "common"
    ],
    defaultNS: "shared",
    interpolation: {
        escapeValue: false,
    },
    returnObjects: true,
});

export default i18n;
