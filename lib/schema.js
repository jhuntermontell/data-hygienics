export function articleSchema({ title, description, slug, lastReviewed, datePublished }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `https://datahygienics.com${slug}`,
    datePublished,
    dateModified: lastReviewed,
    author: {
      '@type': 'Person',
      name: 'Hunter Montell',
      url: 'https://datahygienics.com/about',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'certification',
        name: 'CompTIA Security+',
        url: 'https://www.credly.com/badges/f70e05cc-50bd-4ce5-b60c-639e4386ea0e/public_url',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Data Hygienics',
      url: 'https://datahygienics.com',
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.tldr-block', 'h1', 'h2'],
    },
  }
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  }
}

export function howToSchema({ name, description, steps }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Data Hygienics',
    url: 'https://datahygienics.com',
    description: 'Cybersecurity guidance and tools for small business owners, grounded in NIST and CIS 18 frameworks.',
    founder: {
      '@type': 'Person',
      name: 'Hunter Montell',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'CompTIA Security+',
        url: 'https://www.credly.com/badges/f70e05cc-50bd-4ce5-b60c-639e4386ea0e/public_url',
      },
    },
  }
}
