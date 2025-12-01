'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Header.module.css';

export default function Header() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Hydration fix for Zustand persist
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    if (!mounted) return null;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span>AnFun</span>
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className={styles.searchBar}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        className={styles.searchInput}
                    />
                </form>

                {/* Actions */}
                <div className={styles.actions}>
                    {isAuthenticated && user ? (
                        <div className={styles.avatarContainer}>
                            <img
                                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.nickname}`}
                                alt={user.nickname}
                                className={styles.avatar}
                            />
                            <div className={styles.dropdown}>
                                <div className={styles.menuItem}>Signed in as <strong>{user.nickname}</strong></div>
                                <Link href={`/user/${user.id}`} className={styles.menuItem}>Profile</Link>
                                <Link href="/upload" className={styles.menuItem}>Upload Video</Link>
                                <button onClick={logout} className={styles.menuItem}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className={styles.loginBtn}>Login / Register</button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
