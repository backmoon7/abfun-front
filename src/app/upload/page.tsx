'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import { api } from '@/lib/api';
import styles from './Upload.module.css';

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('video', file);
        formData.append('title', title);
        formData.append('description', description);
        // Mock tags for now
        formData.append('tag_ids[]', '1');

        try {
            await api.post('/videos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push('/');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Upload Video</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.uploadArea} onClick={() => document.getElementById('fileInput')?.click()}>
                    <input
                        id="fileInput"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <UploadCloud className={styles.uploadIcon} />
                    <div className={styles.uploadText}>
                        {file ? file.name : 'Click to upload video'}
                    </div>
                    <div className={styles.uploadSubtext}>
                        Support MP4, WebM, Ogg
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Title</label>
                    <input
                        type="text"
                        required
                        className={styles.input}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your video a catchy title"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tell viewers about your video"
                    />
                </div>

                <button type="submit" className={styles.submitBtn} disabled={loading || !file}>
                    {loading ? 'Uploading...' : 'Publish Video'}
                </button>
            </form>
        </div>
    );
}
