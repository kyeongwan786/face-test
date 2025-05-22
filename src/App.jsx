// App.jsx (정상 구조)
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


import "./styles/common.css";
import "./styles/main.css"; // 또는 각 페이지에 개별 import
import "./styles/Navbar.css";
import MBTIByFace from "./pages/MBTIByFace"; // ✅ 꼭 필요!

export default function App() {
    return (
        <HelmetProvider>
            <Router>
                <Navbar />
                <main>
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
            </Router>
        </HelmetProvider>
    );
}
