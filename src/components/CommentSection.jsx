import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import '../styles/comment.css';


const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [form, setForm] = useState({ nickname: '', password: '', content: '' });
    const [editId, setEditId] = useState(null);
    const [editForm, setEditForm] = useState({ password: '', content: '' });
    const [error, setError] = useState(null);

    const fetchComments = useCallback(async () => {
        if (!postId) {
            setError('postId가 전달되지 않았습니다.');
            return;
        }

        try {
            const res = await axios.get(`/api/comments/${postId}`);
            setComments(res.data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('댓글을 불러오지 못했습니다.');
        }
    }, [postId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.nickname || !form.password || !form.content) return alert('모든 칸을 입력하세요');

        await axios.post('/api/comments', { ...form, postId });
        setForm({ nickname: '', password: '', content: '' });
        fetchComments();
    };

    const handleEditClick = (id, content) => {
        setEditId(id);
        setEditForm({ password: '', content });
    };

    const handleEditConfirm = async () => {
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
    };

    const handleDelete = async (id) => {
        const password = prompt('비밀번호를 입력하세요');
        if (!password) return;

        const res = await axios.delete(`/api/comments/${id}`, {
            params: { password },
        });

        if (res.data) {
            fetchComments();
        } else {
            alert('비밀번호가 틀렸습니다.');
        }
    };

    return (
        <div className="comment-section" style={{ marginTop: '2rem' }}>
            <h3>댓글</h3>


            <div style={{ marginBottom: '1em' }}>
                <input
                    type="text"
                    name="nickname"
                    placeholder="닉네임"
                    value={form.nickname}
                    onChange={handleInputChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleInputChange}
                />
                <textarea
                    name="content"
                    placeholder="댓글 내용"
                    value={form.content}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>작성</button>
            </div>


            {error && <div style={{ color: 'red' }}>{error}</div>}

            <ul>
                {comments.length === 0 && !error && <li>댓글이 없습니다.</li>}
                {comments.map((c) => (
                    <li key={c.id} style={{ marginBottom: '1em', borderBottom: '1px solid #ccc' }}>
                        <strong>{c.nickname}</strong> <br />
                        {editId === c.id ? (
                            <>
                <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                />
                                <input
                                    type="password"
                                    placeholder="비밀번호"
                                    value={editForm.password}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                />
                                <button onClick={handleEditConfirm}>수정완료</button>
                                <button onClick={() => setEditId(null)}>취소</button>
                            </>
                        ) : (
                            <>
                                <p>{c.content}</p>
                                <button onClick={() => handleEditClick(c.id, c.content)}>수정</button>
                                <button onClick={() => handleDelete(c.id)}>삭제</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
