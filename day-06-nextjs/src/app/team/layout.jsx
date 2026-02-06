import Link from 'next/link';

export default function TeamLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/" className="hover:text-blue-600">Home</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900">Team List</li>
          </ol>
        </nav>
        
        <h1 className="text-3xl font-bold text-gray-900">Team Progress</h1>
        <p className="text-gray-600">Track your team&apos;s task completion</p>
      </div>
      <div className="bg-white rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}
