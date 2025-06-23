import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api/axios';
import '../styles/comment.css';

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [form, setForm] = useState({ nickname: '', password: '', content: '' });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ password: '', content: '' });
    const [error, setError] = useState(null);

    const fetchComments = useCallback(async () => {
        try {
            const res = await axios.get(`/api/comments/${postId}`);
            if (Array.isArray(res.data)) {
                setComments(res.data);
            } else {
                setComments([]);
                console.error('응답 데이터가 배열이 아님:', res.data);
            }
        } catch (err) {
            console.error(err);
            setError('댓글을 불러오지 못했습니다.');
        }
    }, [postId]);

    useEffect(() => {
        if (postId) {
            fetchComments();
        } else {
            setError('postId가 전달되지 않았습니다.');
        }
    }, [fetchComments, postId]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        const { nickname, password, content } = form;
        if (!nickname || !password || !content) {
            alert('모든 항목을 입력하세요.');
            return;
        }

        try {
            await axios.post('/api/comments', { ...form, postId });
            setForm({ nickname: '', password: '', content: '' });
            fetchComments();
        } catch (err) {
            console.error(err);
            setError('댓글 등록 실패: 형식이 올바르지 않거나 서버 오류입니다.');
        }
    };

    const startEdit = (id, content) => {
        setEditId(id);
        setEditForm({ password: '', content });
    };

    const confirmEdit = async () => {
        try {
            const res = await axios.put(`/api/comments/${editId}`, null, {
                params: {
                    password: editForm.password,
                    content: editForm.content,
                },
            });
            if (res.data) {
                setEditId(null);
                fetchComments();
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('수정 실패');
        }
    };

    const handleDelete = async (id) => {
        const password = prompt('비밀번호를 입력하세요');
        if (!password) return;

        try {
            const res = await axios.delete(`/api/comments/${id}`, {
                params: { password },
            });
            if (res.data) {
                fetchComments();
            } else {
                alert('비밀번호가 틀렸습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('삭제 실패');
        }
    };

    return (
        <div className="comment-container">
            <h3>댓글</h3>

            <div className="comment-form">
                <input
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    placeholder="닉네임"
                />
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="비밀번호"
                />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={handleSubmit}>작성</button>
                {error && <div className="error">{error}</div>}
            </div>

            <ul className="comment-list">
                {comments.length === 0 && <li className="empty">댓글이 없습니다.</li>}
                {comments.map((c) => (
                    <li key={c.id} className="comment-item">
                        <strong>{c.nickname}</strong>
                        {editId === c.id ? (
                            <>
                <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                />
                                <input
                                    type="password"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                    placeholder="비밀번호"
                                />
                                <div className="btn-group">
                                    <button onClick={confirmEdit}>수정완료</button>
                                    <button onClick={() => setEditId(null)}>취소</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{c.content}</p>
                                <div className="btn-group">
                                    <button onClick={() => startEdit(c.id, c.content)}>수정</button>
                                    <button onClick={() => handleDelete(c.id)}>삭제</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
