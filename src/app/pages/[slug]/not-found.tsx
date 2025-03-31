'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SlugNotFound() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug as string;

  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-2 text-gray-600 max-w-md">
        We couldn&apos;t find the page &quot;{slug}&quot;.
      </p>
      <p className="mb-8 text-gray-500 text-sm">
        The page may have been removed or the URL might be incorrect.
      </p>
      <div className="flex gap-4">
        <Link 
          href="/" 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </Link>
        <Link 
          href="/pages" 
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          View All Pages
        </Link>
      </div>
    </div>
  );
} 