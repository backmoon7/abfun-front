'use client';

import Link from 'next/link';
import { PlayCircle } from 'lucide-react';
import styles from './VideoCard.module.css';

interface Video {
    id: number;
    title: string;
    description: string;
    url: string;
    user_id: number;
    view_count: number;
    like_count: number;
    created_at: string;
    // Mock data for UI that might be missing from API initially
    thumbnail?: string;
    author_name?: string;
}

export default function VideoCard({ video }: { video: Video }) {
    return (
        <Link href={`/video/${video.id}`}>
            <div className={styles.card}>
                <div className={styles.thumbnailContainer}>
                    {/* Use a placeholder if no thumbnail is provided */}
                    <img
                        src={video.thumbnail || `https://picsum.photos/seed/${video.id}/640/360`}
                        alt={video.title}
                        className={styles.thumbnail}
                    />
                </div>
                <div className={styles.info}>
                    <h3 className={styles.title}>{video.title}</h3>
                    <div className={styles.meta}>
                        <div className={styles.author}>
                            <span>UP {video.author_name || 'User ' + video.user_id}</span>
                        </div>
                        <div className={styles.stats}>
                            <span>{video.view_count} views</span>
                            <span>•</span>
                            <span>{new Date(video.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
