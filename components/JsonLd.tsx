const siteUrl = process.env.NEXTAUTH_URL || 'https://tomveijk.nl'

export function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tom van Eijk',
    alternateName: 'tomveijk',
    url: siteUrl,
    image: `${siteUrl}/images/tom-profile.jpg`,
    jobTitle: 'Grafisch vormgever',
    description: "Grafisch vormgever uit Baarn. Ontwerpt logo's, huisstijlen, posters, thumbnails en motion design, en bouwt ook websites.",
    homeLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: 'Baarn', addressCountry: 'NL' }
    },
    alumniOf: { '@type': 'EducationalOrganization', name: 'Grafisch Lyceum Utrecht' },
    hasOccupation: { '@type': 'Occupation', name: 'AV vormgever', description: 'AV vormgever bij NOS Paintbox' },
    affiliation: { '@type': 'CollegeOrUniversity', name: 'Hogeschool van Amsterdam', url: 'https://www.hva.nl' },
    knowsAbout: [
      'Grafisch ontwerp',
      'Logo ontwerp',
      'Huisstijl',
      'Branding',
      'Motion design',
      'Creative Business',
      'Webdevelopment',
      'Adobe Photoshop',
      'Adobe Illustrator',
      'Adobe After Effects',
      'Adobe InDesign'
    ],
    sameAs: [
      'https://www.linkedin.com/in/tomveijknl/',
      'https://www.instagram.com/tompoeso'
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
    description: 'Portfolio van Tom van Eijk, grafisch vormgever uit Baarn',
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
    description: 'Grafisch ontwerp door Tom van Eijk uit Baarn: logo, huisstijl, print en motion design',
    url: siteUrl,
    image: `${siteUrl}/images/tom-profile.jpg`,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Baarn',
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
      'Branding',
      'Motion design',
      'Webdevelopment'
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
