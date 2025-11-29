'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import VideoCard from '@/components/video/VideoCard';
import styles from './Profile.module.css';

export default function UserProfilePage() {
    const params = useParams();
    const id = params.id;
    const [user, setUser] = useState<any>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Mock data for now
                // const userRes = await api.get(`/user/profile/${id}`);
                // setUser(userRes.data.user);

                setUser({
                    id: Number(id),
                    username: 'TechMaster',
                    email: 'tech@example.com',
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=TechMaster`,
                    created_at: new Date().toISOString()
                });

                // const videosRes = await api.get(`/videos/user/${id}`);
                // setVideos(videosRes.data.videos);
                setVideos([
                    {
                        id: 1,
                        title: 'Building a Bilibili Clone with Next.js',
                        description: '...',
                        url: '...',
                        user_id: 1,
                        view_count: 12034,
                        like_count: 856,
                        created_at: new Date().toISOString(),
                        thumbnail: 'https://picsum.photos/seed/1/640/360'
                    },
                    {
                        id: 2,
                        title: 'Advanced Go Concurrency Patterns',
                        description: '...',
                        url: '...',
                        user_id: 1,
                        view_count: 5400,
                        like_count: 320,
                        created_at: new Date().toISOString(),
                        thumbnail: 'https://picsum.photos/seed/2/640/360'
                    }
                ]);

            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchData();
    }, [id]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
    if (!user) return <div style={{ padding: 40, textAlign: 'center' }}>User not found</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <img src={user.avatar_url} alt={user.username} className={styles.avatar} />
                <div className={styles.info}>
                    <h1 className={styles.username}>{user.username}</h1>
                    <p className={styles.bio}>Full Stack Developer | Go & React Enthusiast</p>
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>100k</span>
                            <span className={styles.statLabel}>Followers</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>52</span>
                            <span className={styles.statLabel}>Following</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>1.2M</span>
                            <span className={styles.statLabel}>Likes</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className={styles.sectionTitle}>Videos</h2>
                <div className={styles.grid}>
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={{ ...video, author_name: user.username }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
