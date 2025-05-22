import React, { useEffect } from "react";

export default function KakaoShareButton({
                                             title = "못생김 측정기",
                                             description = "AI가 판단한 못생김 점수 공개!",
                                         }) {
    useEffect(() => {
        if (!window.Kakao?.isInitialized()) {
            window.Kakao.init("d3f8af96c1e986cbfb2216380f1ea8e7"); // ⚠️ 여기에 본인 JS 키 입력
        }
    }, []);

    const shareKakao = () => {
        if (!window.Kakao) return;

        window.Kakao.Link.sendDefault({
            objectType: "feed",
            content: {
                title,
                description,
                imageUrl: "https://via.placeholder.com/300x200.png?text=Ugly+Score",
                link: {
                    mobileWebUrl: window.location.href,
                    webUrl: window.location.href,
                },
            },
            buttons: [
                {
                    title: "나도 테스트 해보기",
                    link: {
                        mobileWebUrl: window.location.href,
                        webUrl: window.location.href,
                    },
                },
            ],
        });
    };

    return (
        <button
            onClick={shareKakao}
            className="mt-4 px-4 py-2 bg-yellow-300 text-black rounded shadow hover:bg-yellow-400"
        >
            카카오톡으로 공유하기
        </button>
    );
}
