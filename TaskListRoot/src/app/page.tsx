import Link from 'next/link';
import ThemePicker from './components/ThemePicker';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Manage Your Tasks <span className="text-accent-600">Effortlessly</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Stay organized and boost your productivity.
      </p>
      <Link
        href="/list"
        className="inline-block px-8 py-4 bg-accent-600 text-white font-semibold rounded-lg hover:bg-accent-700"
      >
        Get Started →
      </Link>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <ThemePicker />
      </div>
    </div>
  );
}
