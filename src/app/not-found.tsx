import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center bg-[#181818] p-6 text-center text-white">
      <h1 className="text-8xl font-extrabold text-[#38AE34] mb-4 roboto-condensed-bold">
        404
      </h1>
      <h2 className="text-3xl md:text-4xl font-bold mb-4 roboto-condensed-bold">
        Страница не найдена
      </h2>
      <p className="mb-8 text-gray-400 max-w-md roboto-condensed-regular">
        К сожалению, страница, которую вы ищете, не существует или была перемещена.
      </p>
      <Link 
        href="/" 
        className="inline-flex items-center border border-transparent hover:bg-transparent hover:border-[#38AE34] justify-center px-6 py-3 bg-[#38AE34] text-white font-bold hover:bg-[#2d8a2b] transition-colors roboto-condensed-bold uppercase"
      >
        Вернуться на главную
      </Link>
    </div>
  );
} 