'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ThumbsUp, Star, Share2 } from 'lucide-react';
import { api } from '@/lib/api';
import VideoPlayer from '@/components/video/VideoPlayer';
import styles from './VideoDetail.module.css';

export default function VideoDetailPage() {
    const params = useParams();
    const id = params.id;
    const [video, setVideo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                // Mock data for now if API fails or is not ready
                // const res = await api.get(`/videos/${id}`);
                // setVideo(res.data.video);

                // Simulating API response for demo
                setVideo({
                    id: Number(id),
                    title: 'Building a Bilibili Clone with Next.js',
                    description: 'In this video, we will learn how to build a modern video streaming platform using Next.js 14, TypeScript, and Go.',
                    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Test video
                    view_count: 12034,
                    like_count: 856,
                    created_at: new Date().toISOString(),
                    user: {
                        id: 1,
                        username: 'TechMaster',
                        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechMaster'
                    }
                });
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
            if (liked) {
                await api.delete('/interaction/like', { data: { video_id: Number(id) } });
            } else {
                await api.post('/interaction/like', { video_id: Number(id) });
            }
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
                <VideoPlayer src={video.url} videoId={video.id} />

                <div className={styles.videoInfo}>
                    <h1 className={styles.title}>{video.title}</h1>
                    <div className={styles.meta}>
                        <span>{video.view_count.toLocaleString()} views</span>
                        <span>{new Date(video.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={`${styles.actionBtn} ${liked ? styles.active : ''}`}
                            onClick={handleLike}
                        >
                            <ThumbsUp size={24} />
                            <span>{liked ? video.like_count + 1 : video.like_count}</span>
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
            </div>

            <div className={styles.sidebar}>
                <div className={styles.authorCard}>
                    <img src={video.user.avatar_url} alt={video.user.username} className={styles.authorAvatar} />
                    <div className={styles.authorInfo}>
                        <div className={styles.authorName}>{video.user.username}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>100k followers</div>
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
