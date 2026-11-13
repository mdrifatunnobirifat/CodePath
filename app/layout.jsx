import './globals.css';

export const metadata = {
  title: 'CodePath – Coding Practice & Job-Readiness Platform',
  description: 'Master core programming fundamentals and prepare for developer interviews with structured learning roadmaps, 600+ practice questions, and Top 5 format Tech CV Builder.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

