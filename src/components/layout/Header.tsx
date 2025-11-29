'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Header.module.css';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    // Hydration fix for Zustand persist
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span>AnFun</span>
                </Link>

                {/* Search Bar */}
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search videos..."
                        className={styles.searchInput}
                    />
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    {isAuthenticated && user ? (
                        <div className={styles.avatarContainer}>
                            <img
                                src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                                alt={user.username}
                                className={styles.avatar}
                            />
                            <div className={styles.dropdown}>
                                <div className={styles.menuItem}>Signed in as <strong>{user.username}</strong></div>
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
