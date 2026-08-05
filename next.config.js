/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // Moderne formaten eerst; de browser krijgt via content-negotiation wat hij aankan.
    // AVIF is ~40% kleiner dan WebP, WebP ~30% kleiner dan JPEG.
    formats: ['image/avif', 'image/webp'],

    // Zonder deze regel zet Next `max-age=60` op geoptimaliseerde afbeeldingen.
    // Elke bezoeker haalde daardoor na een minuut alles opnieuw op, en Cloudflare
    // cachete het evenmin. De URL bevat al breedte en kwaliteit, dus lang cachen
    // is veilig: verandert het bronbestand, dan verandert de URL mee.
    minimumCacheTTL: 31536000, // 1 jaar

    // LET OP: '**' betekent dat je server afbeeldingen van élk https-domein
    // verkleint. Daarmee kan een willekeurige buitenstaander jouw VPS gebruiken
    // als gratis image-resizer. Zet hier de domeinen neer die je echt nodig hebt.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
