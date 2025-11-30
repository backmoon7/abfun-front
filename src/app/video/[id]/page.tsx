'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ThumbsUp, Star, Share2 } from 'lucide-react';
import { videoApi, interactionApi } from '@/lib/api';
import VideoPlayer from '@/components/video/VideoPlayer';
import CommentList from '@/components/video/CommentList';
import styles from './VideoDetail.module.css';

export default function VideoDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const res = await videoApi.getDetail(id);
                setVideo(res.data);
                // Check if liked status is available in response, otherwise default to false
                // setLiked(res.data.is_liked); 
            } catch (error) {
                console.error('Failed to fetch video:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchVideo();
    }, [id]);

    const handleLike = async () => {
        // Optimistic update
        setLiked(!liked);
        try {
            await interactionApi.likeVideo(id);
            // Update like count in video object
            setVideo((prev: any) => ({
                ...prev,
                like_count: liked ? prev.like_count - 1 : prev.like_count + 1
            }));
        } catch (error) {
            console.error('Like failed', error);
            setLiked(!liked); // Revert
        }
    };

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
    if (!video) return <div style={{ padding: 40, textAlign: 'center' }}>Video not found</div>;

    return (
        <div className={styles.container}>
            <div className={styles.mainContent}>
                <VideoPlayer src={video.video_url} poster={video.cover_url} />

                <div className={styles.videoInfo}>
                    <h1 className={styles.title}>{video.title}</h1>
                    <div className={styles.meta}>
                        <span>{video.view_count?.toLocaleString() || 0} views</span>
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${liked ? styles.active : ''}`}
                            onClick={handleLike}
                        >
                            <ThumbsUp size={24} />
                            <span>{video.like_count || 0}</span>
                        </button>
                        <button className={styles.actionBtn}>
                            <Star size={24} />
                            <span>Favorite</span>
                        </button>
                        <button className={styles.actionBtn}>
                            <Share2 size={24} />
                            <span>Share</span>
                        </button>
                    </div>

                    <div className={styles.description}>
                        {video.description}
                    </div>
                </div>

                <CommentList videoId={id} />
            </div>

            <div className={styles.sidebar}>
                <div className={styles.authorCard}>
                    <img src={video.author?.avatar || '/default-avatar.png'} alt={video.author?.nickname} className={styles.authorAvatar} />
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{video.author?.nickname || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>Author</div>
                    </div>
                    <button className={styles.followBtn}>+ Follow</button>
                </div>

                {/* Related Videos Placeholder */}
                <div style={{ marginTop: 20 }}>
                    <h3 style={{ fontSize: 16, marginBottom: 10 }}>Related Videos</h3>
                    <div style={{ height: 100, background: '#f1f2f3', borderRadius: 4 }}></div>
                    <div style={{ height: 100, background: '#f1f2f3', borderRadius: 4, marginTop: 10 }}></div>
                </div>
            </div>
        </div>
    );
}
