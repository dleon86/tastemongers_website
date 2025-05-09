import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navigation from './components/layout/Navigation'
import NewsletterPopup from './components/ui/NewsletterPopup'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TasteMongers',
  description: 'Discover the finest artisanal foods with expert ratings, detailed reviews, and curated recommendations.',
  icons: {
    icon: [
      { url: '/favicon.png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon-180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.png' }],
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-background">
          {children}
        </main>
        <footer className="footer py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
            <div className="mb-6">
              <Image 
                src="/images/tastemongers-emblem-circle-1x1-v1.png" 
                alt="TasteMongers Emblem"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">About TasteMongers</h3>
                <p className="text-footer-text-secondary">Your trusted guide to discovering and enjoying the finest artisanal foods.</p>
                <p className="text-footer-text-secondary mt-4">TasteMongers is part of Axiomatiq LLC</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/blog" className="footer-link">Blog</Link></li>
                  <li><Link href="/ratings" className="footer-link">Ratings</Link></li>
                  <li><Link href="/about" className="footer-link">About</Link></li>
                  <li><a href="https://axiomatiqai.com/privacy" className="footer-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
                  <li><a href="https://axiomatiqai.com/tc" className="footer-link" target="_blank" rel="noopener noreferrer">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
                <p className="text-footer-text-secondary">Subscribe to get the latest updates and recommendations.</p>
              </div>
            </div>
            <div className="text-center text-footer-text-secondary text-sm">
              <p>&copy; 2025 TasteMongers. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <NewsletterPopup />
      </body>
    </html>
  )
}
