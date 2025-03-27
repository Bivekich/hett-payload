export default function NotFound() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center p-6 text-center">
      <h2 className="text-3xl font-bold mb-4">404 - Page Not Found</h2>
      <p className="mb-8 text-gray-600 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a 
        href="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Return to Home
      </a>
    </div>
  );
} 