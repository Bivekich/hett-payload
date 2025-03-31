'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SlugError({ error, reset }: ErrorProps) {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug as string;
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(`Error in slug route [${slug}]:`, error);
  }, [error, slug]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Error Loading Page</h2>
      <p className="mb-2 text-gray-600">
        We couldn't load the page "{slug}".
      </p>
      <p className="mb-6 text-gray-500 text-sm">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
} 