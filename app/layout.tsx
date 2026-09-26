import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PersonJsonLd, WebsiteJsonLd, LocalBusinessJsonLd } from "@/components/JsonLd"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'
const description = "Tom van Eijk is grafisch vormgever en AV vormgever bij de NOS. Logo's, huisstijlen, posters, thumbnails, motion design en websites. Student Creative Business aan de HvA."

export const metadata: Metadata = {
  title: {
    default: "Tom van Eijk | Grafisch vormgever",
    template: "%s | Tom van Eijk"
  },
  description,
  keywords: ["grafisch vormgever", "grafisch ontwerp", "logo ontwerp", "huisstijl", "motion design", "thumbnails", "Creative Business HvA", "Tom van Eijk", "tomveijk", "portfolio"],
  authors: [{ name: "Tom van Eijk" }],
  creator: "Tom van Eijk",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: siteUrl,
    siteName: 'tomveijk',
    title: 'Tom van Eijk | Grafisch vormgever',
    description,
    images: [
      {
        url: '/images/tom-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Tom van Eijk, grafisch vormgever',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tom van Eijk | Grafisch vormgever',
    description,
    images: ['/images/tom-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <head>
        <PersonJsonLd />
        <WebsiteJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
