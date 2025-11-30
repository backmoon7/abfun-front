'use client';

import { useState, useEffect } from 'react';
import { commentApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './CommentList.module.css';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        nickname: string;
        avatar: string;
    };
}

export default function CommentList({ videoId }: { videoId: string }) {
    const { user } = useAuthStore();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComments();
    }, [videoId]);

    const loadComments = async () => {
        try {
            const res = await commentApi.list(videoId);
            setComments(res.data || []);
        } catch (error) {
            console.error('Failed to load comments', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            await commentApi.create(videoId, newComment);
            setNewComment('');
            loadComments(); // Reload comments
        } catch (error) {
            console.error('Failed to post comment', error);
            alert('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        try {
            await commentApi.delete(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment', error);
        }
    };

    return (
        <div className={styles.container}>
            <h3>Comments ({comments.length})</h3>
            
            {user ? (
                <form onSubmit={handleSubmit} className={styles.inputForm}>
                    <img src={user.avatar || '/default-avatar.png'} alt="My Avatar" className={styles.myAvatar} />
                    <div className={styles.inputWrapper}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={2}
                        />
                        <button type="submit" disabled={loading || !newComment.trim()}>
                            {loading ? 'Posting...' : 'Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className={styles.loginPrompt}>
                    Please <a href="/auth/login">login</a> to comment.
                </div>
            )}

            <div className={styles.list}>
                {comments.map(comment => (
                    <div key={comment.id} className={styles.commentItem}>
                        <img src={comment.user?.avatar || '/default-avatar.png'} alt={comment.user?.nickname} className={styles.avatar} />
                        <div className={styles.content}>
                            <div className={styles.header}>
                                <span className={styles.username}>{comment.user?.nickname || 'Unknown'}</span>
                                <span className={styles.date}>{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className={styles.text}>{comment.content}</p>
                            {user && user.id === comment.user?.id && (
                                <button onClick={() => handleDelete(comment.id)} className={styles.deleteBtn}>Delete</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
