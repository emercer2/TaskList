'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

const initialTasks = [
  { id: 1, title: 'Learn Next.js routing', completed: true, priority: 'high',
    description: 'Understand file-based routing, dynamic routes, and layouts.' },
  { id: 2, title: 'Build dynamic routes', completed: false, priority: 'high',
    description: 'Create [id] routes for individual task pages.' },
  { id: 3, title: 'Add loading states', completed: false, priority: 'medium',
    description: 'Implement loading.js for better UX.' },
  { id: 4, title: 'Deploy to Vercel', completed: false, priority: 'low',
    description: 'Push to GitHub and deploy.' },
];

function loadTasks() {
  if (typeof window === 'undefined') return initialTasks;
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : initialTasks;
}

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function TaskDetailPage() {
  const { id } = useParams();
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(id));

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
        <Link href="/tasks" className="text-blue-600 hover:underline">
          ← Back to Tasks
        </Link>
      </div>
    );
  }

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center gap-1">
          <li>
            <Link href="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/tasks" className="hover:text-blue-600">Tasks</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">{task.title}</li>
        </ol>
      </nav>

      <div className="mt-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          <span className={'px-3 py-1 rounded-full text-sm ' + (priorityColors[task.priority] || '')}>
            {task.priority}
          </span>
        </div>

        {task.description && (
          <p className="text-gray-600 mb-6">{task.description}</p>
        )}

        <div className="flex items-center gap-2">
          <span className={'px-3 py-1 rounded-full text-sm ' + (task.completed
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800')}>
            {task.completed ? '✓ Completed' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
}
