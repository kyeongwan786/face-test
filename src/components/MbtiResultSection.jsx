import React, { useEffect, useState } from "react";
import { loadModelByGender, predictImage } from "@/utils/runModel";
import KakaoShareButton from "./KakaoShareButton";

export default function ResultSection({ image, gender }) {
    const [score, setScore] = useState(null);
    const [animatedScore, setAnimatedScore] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tier, setTier] = useState("");

    const getTier = (score) => {
        if (score >= 90) return "diamond";
        if (score >= 70) return "gold";
        if (score >= 40) return "silver";
        return "bronze";
    };

    useEffect(() => {
        if (!image) return;

        const analyze = async () => {
            setLoading(true);
            await loadModelByGender(gender);

            const imgElement = document.createElement("img");
            imgElement.src = image;
            imgElement.crossOrigin = "anonymous";

            imgElement.onload = async () => {
                const prediction = await predictImage(imgElement);
                const top = prediction.reduce((a, b) =>
                    a.probability > b.probability ? a : b
                );
                const finalScore = Math.round(top.probability * 100);
                setScore(finalScore);
                setTier(getTier(finalScore));
                setLoading(false);
            };
        };

        analyze();
    }, [image, gender]);

    useEffect(() => {
        if (score !== null) {
            let start = 0;
            const interval = setInterval(() => {
                start += 1;
                setAnimatedScore(start);
                if (start >= score) clearInterval(interval);
            }, 20);
        }
    }, [score]);

    return (
        <div className="mt-6 text-center">
            {loading ? (
                <p className="text-gray-600 animate-pulse">AI 분석 중...</p>
            ) : score !== null ? (
                <>
                    <img
                        src={`/rank/${tier}.png`}
                        alt={tier}
                        className="w-32 h-32 mx-auto mb-4"
                    />
                    <h2 className="text-4xl font-bold text-red-500">{animatedScore}점</h2>
                    <p className="mt-2 text-gray-600">
                        AI가 판단한 당신의 못생김 점수입니다. 그냥 웃고 넘기세요 😅
                    </p>
                    <KakaoShareButton />
                </>
            ) : null}
        </div>
    );
}
