'use client';

import { useState } from 'react';
import { PRIORITIES, priorityColors } from './PriorityChip';

export default function TaskForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim(), priority });
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          disabled={isLoading}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="px-6 py-3 bg-accent-600 text-white font-medium rounded-lg
            hover:bg-accent-700 disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Adding...
            </>
          ) : (
            'Add Task'
          )}
        </button>
      </div>
      <div className="flex gap-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          disabled={isLoading}
          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none
            disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="flex flex-col gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              disabled={isLoading}
              className={`
                px-3 py-1 rounded-full text-sm font-medium transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${priorityColors[p]}
                ${priority === p
                  ? 'ring-2 ring-offset-2 ring-gray-400 scale-105'
                  : 'opacity-60 hover:opacity-100'
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
