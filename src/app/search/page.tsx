'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { videoApi } from '@/lib/api';
import VideoCard from '@/components/video/VideoCard';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await videoApi.search(query);
                setVideos(res.data || []);
            } catch (error) {
                console.error('Failed to search videos:', error);
                setVideos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div style={{ padding: '24px', maxWidth: 'var(--max-width)', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '20px', fontSize: '24px' }}>
                Search Results for: "{query}"
            </h1>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Searching...</div>
            ) : videos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    No videos found for "{query}"
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '24px'
                }}>
                    {videos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}
