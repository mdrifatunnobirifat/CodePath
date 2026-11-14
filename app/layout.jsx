import './globals.css';

export const metadata = {
  metadataBase: new URL('https://codepath-zeta.vercel.app'),
  title: {
    default: 'CodePath – Coding Practice & Job-Readiness Platform',
    template: '%s | CodePath',
  },
  description: 'Master core programming fundamentals and prepare for developer interviews with structured learning roadmaps, 600+ practice questions, in-browser code execution, and Top 5 format Tech CV Builder.',
  keywords: [
    'CodePath',
    'CodePath platform',
    'CodePath coding practice',
    'CodePath job readiness',
    'CodePath interview prep',
    '60-day coding plan',
    'tech cv builder',
    'react interactive sandbox',
    'in-browser coding practice',
    'learn javascript',
    'learn python',
    'learn sql',
    'coding challenges with hints',
  ],
  authors: [{ name: 'Md Rifat' }],
  creator: 'Md Rifat',
  publisher: 'CodePath',
  alternates: {
    canonical: 'https://codepath-zeta.vercel.app',
  },
  openGraph: {
    title: 'CodePath – Coding Practice & Job-Readiness Platform',
    description: 'Master core programming fundamentals and prepare for developer interviews with structured learning roadmaps, 600+ practice questions, in-browser code execution, and Top 5 format Tech CV Builder.',
    url: 'https://codepath-zeta.vercel.app',
    siteName: 'CodePath Platform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodePath – Coding Practice & Job-Readiness Platform',
    description: 'Master core programming fundamentals and prepare for developer interviews with structured learning roadmaps and 600+ practice questions.',
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
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'CodePath',
  alternateName: ['CodePath Platform', 'CodePath Coding Practice', 'CodePath App'],
  url: 'https://codepath-zeta.vercel.app',
  description: 'Accelerated coding practice and interview readiness platform designed for learners preparing for developer roles within 60 days.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Person',
    name: 'Md Rifat',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
