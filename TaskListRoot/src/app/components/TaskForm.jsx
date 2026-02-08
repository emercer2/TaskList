'use client';

import { useState } from 'react';
import { PRIORITIES, priorityColors } from './PriorityChip';
import Input from './Input';
import Button from './Button';

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
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          disabled={isLoading}
          className="flex-1 px-4 py-3"
        />
        <Button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="hidden sm:flex w-36 px-6 py-3 font-medium items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Adding...
            </>
          ) : (
            'Add Task'
          )}
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          as="textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          disabled={isLoading}
          className="flex-1 px-4 py-2 resize-none"
        />
        <div className="flex flex-row sm:flex-col gap-2 sm:w-36 px-2 justify-center">
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
                  ? 'ring-2 ring-offset-2 ring-accent-400 scale-105'
                  : 'opacity-60 hover:opacity-100'
                }
              `}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <Button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="flex sm:hidden w-full px-6 py-3 font-medium items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span>
            Adding...
          </>
        ) : (
          'Add Task'
        )}
      </Button>
    </form>
  );
}
