'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import DanmakuLayer from './DanmakuLayer';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    src: string;
    videoId: number;
}

export default function VideoPlayer({ src, videoId }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [danmakuText, setDanmakuText] = useState('');

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (videoRef.current) {
            const progressBar = e.currentTarget;
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            const newTime = percentage * duration;
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const sendDanmaku = (e: React.FormEvent) => {
        e.preventDefault();
        if (!danmakuText.trim()) return;

        // In a real app, send via WebSocket here
        // const ws = ...
        // ws.send(JSON.stringify({ content: danmakuText, time: currentTime, ... }))

        console.log('Sending danmaku:', danmakuText);
        setDanmakuText('');
    };

    return (
        <div className={styles.playerContainer}>
            <video
                ref={videoRef}
                src={src}
                className={styles.video}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
            />

            <DanmakuLayer videoId={videoId} currentTime={currentTime} isPlaying={isPlaying} />

            {/* Danmaku Input Overlay */}
            <form className={styles.danmakuInputContainer} onSubmit={sendDanmaku}>
                <input
                    type="text"
                    className={styles.danmakuInput}
                    placeholder="Send a bullet comment..."
                    value={danmakuText}
                    onChange={(e) => setDanmakuText(e.target.value)}
                />
                <button type="submit" className={styles.sendBtn}>Send</button>
            </form>

            {/* Custom Controls */}
            <div className={styles.controls}>
                <div className={styles.progressBar} onClick={handleSeek}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                </div>

                <div className={styles.buttons}>
                    <div className={styles.leftControls}>
                        <button className={styles.iconBtn} onClick={togglePlay}>
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <span className={styles.time}>
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className={styles.rightControls}>
                        <button className={styles.iconBtn} onClick={() => setIsMuted(!isMuted)}>
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <button className={styles.iconBtn}>
                            <Settings size={20} />
                        </button>
                        <button className={styles.iconBtn}>
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
