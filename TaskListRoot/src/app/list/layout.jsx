'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ListLayout({ children }) {
  const pathname = usePathname();
  const isDetail = pathname !== '/list';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <ol className="flex items-center gap-1">
            <li>
              <Link href="/" className="hover:text-accent-600">Home</Link>
            </li>
            <li>/</li>
            {isDetail ? (
              <>
                <li>
                  <Link href="/list" className="hover:text-accent-600">My List</Link>
                </li>
                <li>/</li>
                <li className="text-gray-900">Task Details</li>
              </>
            ) : (
              <li className="text-gray-900">My List</li>
            )}
          </ol>
        </nav>

        {!isDetail && (
          <>
            <h1 className="text-3xl font-bold text-gray-900">My List</h1>
            <p className="text-gray-600">Manage your personal tasks</p>
          </>
        )}
      </div>
      <div className="bg-white rounded-xl p-6">
        {children}
      </div>
    </div>
  );
}
