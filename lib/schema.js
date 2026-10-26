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
    description: 'Independent, researched guidance for households and small businesses living and working securely alongside AI, plus security tools for small business, grounded in NIST CSF 2.0 and CIS Controls v8.',
    knowsAbout: [
      'AI security',
      'AI-enabled fraud and scams',
      'Digital hygiene',
      'Digital sovereignty',
      'Small business cybersecurity',
      'Household cybersecurity',
    ],
    founder: {
      '@type': 'Person',
      name: 'Hunter Montell',
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'CompTIA Security+',
        url: 'https://www.credly.com/badges/f70e05cc-50bd-4ce5-b60c-639e4386ea0e/public_url',
      },
    },
    // M2 fills this with the LinkedIn and Facebook page URLs once they exist.
    sameAs: [],
  }
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `https://datahygienics.com${path}`,
    })),
  }
}

export function collectionPageSchema({ name, description, path, items = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: `https://datahygienics.com${path}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map(({ name: itemName, path: itemPath }, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: itemName,
        url: `https://datahygienics.com${itemPath}`,
      })),
    },
  }
}

export function definedTermSetSchema(entries) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Data Hygienics Glossary',
    url: 'https://datahygienics.com/glossary',
    hasDefinedTerm: entries.map((entry) => ({
      '@type': 'DefinedTerm',
      name: entry.term,
      description: entry.shortDef,
      url: `https://datahygienics.com/glossary#term-${entry.slug}`,
      inDefinedTermSet: 'https://datahygienics.com/glossary',
    })),
  }
}
