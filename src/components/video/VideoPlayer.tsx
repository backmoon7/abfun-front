'use client';

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js/dist/hls.js';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    src: string;
    poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // video.play().catch(() => {}); // Auto-play if needed, usually blocked by browsers
            });
            return () => {
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = src;
        }
    }, [src]);

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                className={styles.video}
                controls
                poster={poster}
                playsInline
            />
        </div>
    );
}
