import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.abfun.me';

export const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    timeout: 300000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Optional: Redirect to login or dispatch logout event
                window.dispatchEvent(new Event('auth:logout'));
            }
        }
        return Promise.reject(error);
    }
);

// --- API Endpoints ---

// Authentication
export const authApi = {
    login: (data: { email: string; password: string }) => api.post('/user/login', data),
    register: (data: { email: string; password: string; nickname?: string }) => api.post('/user/register', data),
    getMe: () => api.get('/user/me'),
    updateProfile: (data: { nickname?: string; avatar?: string }) => api.put('/user/update', data),
};

// Videos
export const videoApi = {
    getFeed: () => api.get('/videos/feed'),
    getDetail: (id: string) => api.get(`/videos/${id}`),
    upload: (formData: FormData) => api.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    search: (query: string) => api.get('/search', { params: { q: query } }),
};

// Comments
export const commentApi = {
    list: (videoId: string) => api.get('/interaction/comments', { params: { video_id: videoId } }),
    create: (videoId: string, content: string) => api.post('/interaction/comments', { video_id: parseInt(videoId), content }),
    delete: (commentId: number) => api.delete(`/interaction/comments/${commentId}`),
};

// Interaction
export const interactionApi = {
    likeVideo: (videoId: string) => api.post('/interaction/like', { video_id: parseInt(videoId) }),
    unlikeVideo: (videoId: string) => api.delete('/interaction/like', { data: { video_id: parseInt(videoId) } }),
};
