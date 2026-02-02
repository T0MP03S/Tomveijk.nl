import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

  // Basic static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  // Try to get portfolio items, but don't fail if database is unavailable
  try {
    const { prisma } = await import('@/lib/prisma')
    const portfolioItems = await prisma.portfolioItem.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    })

    const portfolioUrls: MetadataRoute.Sitemap = portfolioItems.map((item) => ({
      url: `${baseUrl}/portfolio/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))

    return [...staticPages, ...portfolioUrls]
  } catch {
    // Return only static pages if database is unavailable
    return staticPages
  }
}
