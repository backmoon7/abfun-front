import type { Metadata } from 'next'
import '@/styles/globals.css'
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
    title: 'AbFun - Bilibili Clone',
    description: 'A premium video streaming platform',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="zh-CN">
            <body>
                <Header />
                <main style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
                    {children}
                </main>
            </body>
        </html>
    )
}
