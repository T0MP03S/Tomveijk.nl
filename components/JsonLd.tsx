const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tom van Eijk',
    alternateName: 'tomveijk',
    url: siteUrl,
    image: `${siteUrl}/images/tom-profile.jpg`,
    jobTitle: 'Creative Designer',
    description: 'Grafisch vormgever met passie voor innovatie. Gespecialiseerd in logo design, huisstijlen en creatieve designs.',
    knowsAbout: [
      'Grafisch ontwerp',
      'Logo design',
      'Huisstijl',
      'Branding',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe After Effects',
      'Adobe InDesign'
    ],
    sameAs: [
      'https://www.linkedin.com/in/tomveijknl/',
      'https://www.instagram.com/tompoeso',
      'https://www.tiktok.com/@tompoeso',
      'https://www.twitch.tv/t0mp03s',
      'https://www.youtube.com/@Tompoeso'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'tomveijk',
      url: siteUrl
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'tomveijk',
    alternateName: 'Tom van Eijk Portfolio',
    url: siteUrl,
    description: 'Portfolio website van Tom van Eijk - Creative Designer',
    author: {
      '@type': 'Person',
      name: 'Tom van Eijk'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'tomveijk - Tom van Eijk',
    description: 'Grafisch ontwerp en creatieve diensten door Tom van Eijk',
    url: siteUrl,
    image: `${siteUrl}/images/tom-profile.jpg`,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL'
    },
    founder: {
      '@type': 'Person',
      name: 'Tom van Eijk'
    },
    serviceType: [
      'Grafisch ontwerp',
      'Logo design',
      'Huisstijl ontwerp',
      'Branding'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
