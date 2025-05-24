import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// 페이지 컴포넌트
import Main from "./pages/Main";
import UglyMeter from "./pages/UglyMeter";
import Soon from "./pages/Soon";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import UglyFAQ from "./pages/UglyFAQ";
import MBTIFAQ from "./pages/MBTIFAQ";
import MBTIByFace from "./pages/MBTIByFace"; // ✅ 꼭 필요!

// 스타일
import "./styles/common.css";
import "./styles/main.css";
import "./styles/Navbar.css";

export default function App() {
    return (
        <HelmetProvider>
            <Router>
                {/* ✅ 전체를 감싸는 flex wrapper */}
                <div className="page-wrapper">
                    <Navbar />

                    {/* ✅ 콘텐츠가 공간을 채우도록 설정 */}
                    <main className="page-content">
                        <Routes>
                            <Route path="/" element={<Main />} />
                            <Route path="/ugly" element={<UglyMeter />} />
                            <Route path="/mbti" element={<MBTIByFace />} />
                            <Route path="/faceage" element={<Soon />} />
                            <Route path="/firstface" element={<Soon />} />
                            <Route path="/like" element={<Soon />} />
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
