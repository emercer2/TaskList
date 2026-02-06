'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import PriorityChip from '../../components/PriorityChip';

function loadTasks() {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('team_tasks');
  return saved ? JSON.parse(saved) : [];
}

export default function TeamTaskDetailPage() {
  const { id } = useParams();
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(id));

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
        <Link href="/team" className="text-accent-600 hover:underline">
          &larr; Back to Team List
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          <PriorityChip priority={task.priority} />
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
