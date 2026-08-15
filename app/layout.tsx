import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PersonJsonLd, WebsiteJsonLd, LocalBusinessJsonLd } from "@/components/JsonLd"

const inter = Inter({ subsets: ["latin"] })

const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

export const metadata: Metadata = {
  title: {
    default: "Tom van Eijk - Websites en vormgeving uit Baarn",
    template: "%s | Tom van Eijk"
  },
  description: "Ik bouw websites voor kleine bedrijven in Baarn en omgeving. Snel, goed leesbaar op de telefoon, en zonder gedoe. Daarnaast logo's en huisstijlen.",
  keywords: ["website laten maken", "webdesign Baarn", "website kleine ondernemer", "grafisch ontwerp", "logo design", "huisstijl", "Tom van Eijk", "tomveijk", "portfolio"],
  authors: [{ name: "Tom van Eijk" }],
  creator: "Tom van Eijk",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: siteUrl,
    siteName: 'tomveijk',
    title: 'Tom van Eijk - Websites en vormgeving uit Baarn',
    description: "Ik bouw websites voor kleine bedrijven in Baarn en omgeving. Snel, goed leesbaar op de telefoon, en zonder gedoe.",
    images: [
      {
        url: '/images/tom-profile.jpg',
        width: 1200,
        height: 630,
        alt: 'Tom van Eijk, websites en vormgeving uit Baarn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tom van Eijk - Websites en vormgeving uit Baarn',
    description: "Ik bouw websites voor kleine bedrijven in Baarn en omgeving.",
    images: ['/images/tom-profile.jpg'],
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
