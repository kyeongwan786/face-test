import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "https://face-test-backend-9txf.onrender.com";

export default function CommentSection({ pageType }) {
    const [comments, setComments] = useState([]);
    const [form, setForm] = useState({ nickname: "", password: "", content: "" });
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem("likedComments") || "{}"));

    useEffect(() => {
        fetch(`${API_BASE}/api/comments?type=${pageType}`)
            .then(res => res.json())
            .then(setComments)
            .catch(() => setComments([]))
            .finally(() => setLoading(false));
    }, [pageType]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        if (!form.nickname || !form.password || !form.content) return alert("모든 항목을 입력해주세요");
        await fetch(`${API_BASE}/api/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, pageType }),
        });
        setForm({ nickname: "", password: "", content: "" });
        const res = await fetch(`${API_BASE}/api/comments?type=${pageType}`);
        const data = await res.json();
        setComments(data);
    };

    const deleteComment = async (id) => {
        const pw = prompt("비밀번호를 입력하세요:");
        if (!pw) return;
        const res = await fetch(`${API_BASE}/api/comments/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: pw }),
        });
        if (res.ok) {
            const updated = await fetch(`${API_BASE}/api/comments?type=${pageType}`);
            setComments(await updated.json());
        } else {
            alert("비밀번호가 일치하지 않습니다");
        }
    };

    return (
        <div className="comment-section">
            <h3 className="text-lg font-bold mb-2">💬 댓글 ({comments.length})</h3>

            {loading ? <p>불러오는 중...</p> : comments.length === 0 && <p>아직 댓글이 없습니다.</p>}

            <ul className="space-y-2">
                {comments.map(c => (
                    <li key={c.id} className="p-3 border rounded bg-white/70">
                        <div className="flex justify-between items-center">
                            <strong>{c.nickname}</strong>
                            <div className="space-x-2 text-sm">
                                <button
                                    onClick={() => {
                                        setEditingId(c.id);
                                        setEditContent(c.content);
                                    }}
                                    className="text-blue-600"
                                >수정</button>
                                <button
                                    onClick={() => deleteComment(c.id)}
                                    className="text-red-500"
                                >삭제</button>
                                <button
                                    onClick={() => {
                                        if (liked[c.id]) return;
                                        const newLiked = { ...liked, [c.id]: true };
                                        setLiked(newLiked);
                                        localStorage.setItem("likedComments", JSON.stringify(newLiked));
                                    }}
                                    className={`text-pink-600 ${liked[c.id] ? "opacity-50 pointer-events-none" : ""}`}
                                >❤️ 좋아요</button>
                            </div>
                        </div>

                        {editingId === c.id ? (
                            <div className="mt-2 space-y-2">
                                <textarea
                                    className="input"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                                <input
                                    type="password"
                                    className="input"
                                    placeholder="비밀번호 입력"
                                    id={`pw-${c.id}`}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={async () => {
                                            const pw = document.getElementById(`pw-${c.id}`).value;
                                            const res = await fetch(`${API_BASE}/api/comments/${c.id}`, {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ password: pw, content: editContent }),
                                            });
                                            if (res.ok) {
                                                const newRes = await fetch(`${API_BASE}/api/comments?type=${pageType}`);
                                                setComments(await newRes.json());
                                                setEditingId(null);
                                            } else {
                                                alert("비밀번호가 틀립니다");
                                            }
                                        }}
                                        className="bg-blue-500 text-white px-3 py-1 rounded"
                                    >확인</button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="text-gray-500"
                                    >취소</button>
                                </div>
                            </div>
                        ) : (
                            <p className="mt-1">{c.content}</p>
                        )}

                        <small className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            <div className="mt-4 space-y-2">
                <input name="nickname" value={form.nickname} onChange={handleChange} placeholder="닉네임" className="input" />
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="비밀번호" className="input" />
                <textarea name="content" value={form.content} onChange={handleChange} placeholder="댓글 내용" className="input" />
                <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">댓글 작성</button>
            </div>
        </div>
    );
}