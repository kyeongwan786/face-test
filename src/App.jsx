import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./styles/about.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import './i18n';

// 페이지 컴포넌트
import Main from "./pages/Main";
import UglyMeter from "./pages/UglyMeter";
import AgeDetector from "./pages/AgeDetector";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import UglyFAQ from "./pages/UglyFAQ";
import MBTIFAQ from "./pages/MBTIFAQ";
import MBTIByFace from "./pages/MBTIByFace";
import VibeTest from "./pages/Vibe";
import Like from "./pages/Like";

// 스타일
import "./styles/common.css";
import "./styles/main.css";
import "./styles/Navbar.css";

export default function App() {
    return (
        <HelmetProvider>
            <Router>
                {/* 전체 페이지를 Flex column으로 구성하여 Footer 밀착 */}
                <div className="flex flex-col min-h-screen bg-white">
                    <Navbar />

                    {/* 메인 콘텐츠가 남은 공간을 채우도록 설정 */}
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Main />} />
                            <Route path="/ugly" element={<UglyMeter />} />
                            <Route path="/mbti" element={<MBTIByFace />} />
                            <Route path="/age" element={<AgeDetector />} />
                            <Route path="/vibe" element={<VibeTest />} />
                            <Route path="/like" element={<Like />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<Terms />} />
                            <Route path="/ugly-faq" element={<UglyFAQ />} />
                            <Route path="/mbti-faq" element={<MBTIFAQ />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </Router>
        </HelmetProvider>
    );
}