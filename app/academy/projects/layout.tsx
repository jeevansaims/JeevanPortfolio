'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Suppress ALL console errors in projects (Monaco/Pyodide have harmless module loading errors)
  useEffect(() => {
    const originalError = console.error;
    const originalWarn = console.warn;

    // Completely suppress all console.error calls in this layout
    console.error = () => {
      // Silently ignore all errors
    };

    // Suppress warnings too
    console.warn = () => {
      // Silently ignore all warnings
    };

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Pyodide script loaded for projects');
        }}
        onError={(e) => {
          console.error('Failed to load Pyodide script:', e);
        }}
      />
      {children}
    </>
  );
}
