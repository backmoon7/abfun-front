'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Danmaku.module.css';

interface Danmaku {
    id: number;
    content: string;
    color: string;
    time: number;
    type: number; // 1: scroll, 2: top, 3: bottom
}

interface DanmakuLayerProps {
    videoId: number;
    currentTime: number;
    isPlaying: boolean;
    socketUrl?: string; // Optional for now, will use env
}

export default function DanmakuLayer({ videoId, currentTime, isPlaying }: DanmakuLayerProps) {
    const [danmakuList, setDanmakuList] = useState<Danmaku[]>([]);
    const [visibleDanmaku, setVisibleDanmaku] = useState<Danmaku[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const wsRef = useRef<WebSocket | null>(null);

    // Connect to WebSocket
    useEffect(() => {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'wss://abfun.me';
        const ws = new WebSocket(`${wsUrl}/api/v1/danmaku/ws/${videoId}`);

        ws.onopen = () => {
            console.log('Danmaku WS Connected');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // If it's a new message, add it to the list
                // Note: In a real app, we might receive a list or single item
                // For now assuming single item push
                const newDanmaku = {
                    ...data,
                    id: Date.now() + Math.random() // Temp ID if not provided
                };
                setDanmakuList(prev => [...prev, newDanmaku]);
            } catch (e) {
                console.error('Failed to parse danmaku', e);
            }
        };

        ws.onclose = () => {
            console.log('Danmaku WS Disconnected');
        };

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, [videoId]);

    // Render loop logic (Simplified)
    // In a production app, we would use requestAnimationFrame and a more complex track management system
    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            // Find danmaku that should appear at current time (within 100ms window)
            const nowShowing = danmakuList.filter(
                d => d.time >= currentTime && d.time < currentTime + 0.5
            );

            if (nowShowing.length > 0) {
                setVisibleDanmaku(prev => {
                    // Filter out old ones to keep DOM light (simple cleanup)
                    const clean = prev.filter(d => d.time > currentTime - 10);
                    // Deduplicate based on ID to avoid re-adding
                    const newItems = nowShowing.filter(n => !clean.find(c => c.id === n.id));
                    return [...clean, ...newItems];
                });
            }
        }, 500);

        return () => clearInterval(interval);
    }, [currentTime, isPlaying, danmakuList]);

    return (
        <div className={styles.container} ref={containerRef}>
            {visibleDanmaku.map((d) => (
                <div
                    key={d.id}
                    className={styles.danmakuItem}
                    style={{
                        color: d.color,
                        top: `${(d.id % 10) * 10}%`, // Simple track distribution
                        left: '100%',
                        animation: `moveLeft 8s linear forwards`, // We need to define keyframes globally or inline
                        // For simplicity in this demo, we'll use a transform transition approach or CSS animation
                    }}
                >
                    <style jsx>{`
                @keyframes moveLeft {
                    from { transform: translateX(0); }
                    to { transform: translateX(-120vw); }
                }
            `}</style>
                    {d.content}
                </div>
            ))}
        </div>
    );
}
