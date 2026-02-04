'use client';

import { useState } from 'react';
import Link from 'next/link';

const initialTasks = [
  { id: 1, title: 'Learn Next.js routing', completed: true, priority: 'high' },
  { id: 2, title: 'Build dynamic routes', completed: false, priority: 'high' },
  { id: 3, title: 'Add loading states', completed: false, priority: 'medium' },
  { id: 4, title: 'Deploy to Vercel', completed: false, priority: 'low' },
];

function loadTasks() {
  if (typeof window === 'undefined') return initialTasks;
  const saved = localStorage.getItem('tasks');
  return saved ? JSON.parse(saved) : initialTasks;
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export default function TasksPage() {
  const [tasks, setTasksRaw] = useState(loadTasks);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  const setTasks = (next) => {
    const updated = typeof next === 'function' ? next(tasks) : next;
    setTasksRaw(updated);
    saveTasks(updated);
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks([...tasks, {
      id: Date.now(),
      title: newTitle,
      description: newDescription || '',
      completed: false,
      priority: newPriority,
    }]);
    setNewTitle('');
    setNewDescription('');
    setNewPriority('medium');
  };

  const deleteTask = (e, id) => {
    e.preventDefault();
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleTask = (e, id) => {
    e.preventDefault();
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center gap-1">
          <li>
            <Link href="/" className="hover:text-blue-600">Home</Link>
          </li>
          <li>/</li>
          <li className="text-gray-900">Tasks</li>
        </ol>
      </nav>

      <form onSubmit={addTask} className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task title..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        />
        <div className="flex items-center gap-3">
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </div>
      </form>

      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">{tasks.length} tasks</span>
        <span className="text-gray-500 text-sm">
          {tasks.filter(t => !t.completed).length} remaining
        </span>
      </div>

      <ul className="space-y-3">
        {tasks.map(task => (
          <li key={task.id}>
            <Link
              href={'/tasks/' + task.id}
              className="block p-4 border rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => toggleTask(e, task.id)}
                    className={'w-3 h-3 rounded-full ' + (task.completed ? 'bg-green-500' : 'bg-gray-300')}
                    aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  />
                  <span className={task.completed ? 'line-through text-gray-400' : ''}>
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => deleteTask(e, task.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                  <span className="text-gray-400">&rarr;</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
