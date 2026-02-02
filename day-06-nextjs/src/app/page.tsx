import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Manage Your Tasks <span className="text-blue-600">Effortlessly</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Stay organized and boost your productivity.
      </p>
      <Link
        href="/dashboard"
        className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
      >
        Get Started →
      </Link>
    </div>
  );
}
