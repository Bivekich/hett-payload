import React from 'react';
import Link from 'next/link';

export default function PagesNotFound() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-8 text-gray-600 max-w-md">
        We couldn&apos;t find the custom page you&apos;re looking for.
      </p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
} 