'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import styles from './Profile.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { user, setUser } = useAuthStore();
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setNickname(user.nickname || '');
            setAvatar(user.avatar || '');
        } else {
            // Fetch latest user data
            authApi.getMe().then(res => {
                setUser(res.data);
                setNickname(res.data.nickname);
                setAvatar(res.data.avatar);
            }).catch(() => {
                router.push('/auth/login');
            });
        }
    }, [user, setUser, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authApi.updateProfile({ nickname, avatar });
            setUser(res.data);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Nickname</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label>Avatar URL</label>
                    <input
                        type="text"
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                    />
                    {avatar && <img src={avatar} alt="Avatar Preview" className={styles.avatarPreview} />}
                </div>
                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
}
