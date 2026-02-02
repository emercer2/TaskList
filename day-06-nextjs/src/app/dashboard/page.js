'use client';

import { useState } from 'react';

const initialTasks = [
  { id: 1, title: 'Learn Next.js routing', completed: true },
  { id: 2, title: 'Build dashboard page', completed: false },
  { id: 3, title: 'Add task functionality', completed: false },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5"
              />
              <span className={task.completed ? 'line-through text-gray-400' : ''}>
                {task.title}
              </span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-gray-500 text-sm">
        {tasks.filter(t => !t.completed).length} tasks remaining
      </p>
    </div>
  );
}

// ============================================================================
// EXERCISE CHECKLIST
// ============================================================================
/*
After creating the files above, verify:

[ ] Navigation works between all pages
[ ] URL changes when clicking links (/, /about, /dashboard)
[ ] Page doesn't full-reload (client-side navigation)
[ ] Layout (navbar, footer) appears on all pages
[ ] Dashboard task functionality works (add, toggle, delete)

STRETCH GOALS:
1. Add active link highlighting in navbar
2. Add a 404 page (app/not-found.js)
3. Add loading states (app/loading.js)
4. Add page transitions
*/
