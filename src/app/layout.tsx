import type { Metadata } from 'next'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
    title: 'AnFun - Bilibili Clone',
    description: 'A premium video streaming platform',
}

import Header from '@/components/layout/Header';

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
