import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Inter is the closest open-source match to SF Pro — same proportions,
// optical sizing, and weight distribution. Used globally as the OS font.
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://yamin-portfolio-os.vercel.app'),
    title: 'Yamin Hossain — Portfolio OS',
    description: 'An interactive macOS-inspired portfolio featuring production AI agents, distributed systems architecture, and interactive apps by Yamin Hossain.',
    authors: [{ name: 'Yamin Hossain' }],
    keywords: ['Yamin Hossain', 'Portfolio OS', 'Full Stack Engineer', 'AI Systems Engineer', 'Next.js', 'macOS Portfolio'],
    icons: {
        icon: '/finder.png',
        apple: '/finder.png',
    },
    openGraph: {
        title: 'Yamin Hossain — Portfolio OS',
        description: 'An interactive macOS-inspired portfolio featuring production AI agents, distributed systems architecture, and interactive apps by Yamin Hossain.',
        images: ['/macos.jpg'],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Yamin Hossain — Portfolio OS',
        description: 'An interactive macOS-inspired portfolio featuring production AI agents and engineering projects.',
        images: ['/macos.jpg'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`h-full w-full ${inter.variable}`} suppressHydrationWarning>
            <body
                className="h-full w-full overflow-hidden"
                style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
                suppressHydrationWarning
            >
                {children}
            </body>
        </html>
    )
}