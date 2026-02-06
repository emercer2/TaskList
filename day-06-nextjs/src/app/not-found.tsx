import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700"
      >
        Go Home
      </Link>
    </div>
  );
}
