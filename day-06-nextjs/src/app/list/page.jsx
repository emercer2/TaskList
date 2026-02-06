'use client';

import { useState, useRef } from 'react';
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

function UndoToast({ message, onUndo, onDismiss }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white
      px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <span className="text-sm">{message}</span>
      <button
        onClick={onUndo}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded transition-colors"
      >
        Undo
      </button>
      <button onClick={onDismiss} className="text-gray-400 hover:text-white text-sm">
        ✕
      </button>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasksRaw] = useState(loadTasks);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  const [undoToast, setUndoToast] = useState(null);
  const undoRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const handleDragStart = (index) => { dragItem.current = index; };
  const handleDragEnter = (index) => { dragOverItem.current = index; };
  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null ||
        dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const reordered = [...tasks];
    const [removed] = reordered.splice(dragItem.current, 1);
    reordered.splice(dragOverItem.current, 0, removed);
    setTasks(reordered);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const setTasks = (next) => {
    const updated = typeof next === 'function' ? next(tasks) : next;
    setTasksRaw(updated);
    saveTasks(updated);
  };

  const showUndo = (message, prevTasks) => {
    if (undoRef.current) clearTimeout(undoRef.current.timerId);
    const timerId = setTimeout(() => {
      setUndoToast(null);
      undoRef.current = null;
    }, 5000);
    undoRef.current = { timerId, prevTasks };
    setUndoToast({ message });
  };

  const handleUndo = () => {
    if (!undoRef.current) return;
    clearTimeout(undoRef.current.timerId);
    setTasks(undoRef.current.prevTasks);
    undoRef.current = null;
    setUndoToast(null);
  };

  const dismissUndo = () => {
    if (!undoRef.current) return;
    clearTimeout(undoRef.current.timerId);
    undoRef.current = null;
    setUndoToast(null);
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
    const prev = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    showUndo('Task deleted', prev);
  };

  const toggleTask = (e, id) => {
    e.preventDefault();
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const clearCompleted = () => {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;
    const prev = [...tasks];
    setTasks(tasks.filter(t => !t.completed));
    showUndo(`Cleared ${count} completed task(s)`, prev);
  };

  return (
    <div className="min-h-screen py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Create */}
          <form onSubmit={addTask} className="mb-6 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                  hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Task
              </button>
            </div>
            <div className="flex gap-2">
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </form>

          {/* Read */}
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <li
                key={task.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`
                  p-4 border-2 rounded-lg transition-all
                  ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}
                  hover:shadow-md
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <span
                      className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 select-none"
                      title="Drag to reorder"
                    >
                      ⠿
                    </span>

                    {/* Toggle Checkbox */}
                    <button
                      onClick={(e) => toggleTask(e, task.id)}
                      className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                        transition-all
                        ${task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                        }
                      `}
                    >
                      {task.completed && '✓'}
                    </button>

                    {/* Task Title */}
                    <Link
                      href={'/list/' + task.id}
                      className={`
                        truncate hover:text-blue-600
                        ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}
                      `}
                    >
                      {task.title}
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Delete Button */}
                    <button
                      onClick={(e) => deleteTask(e, task.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
                        rounded-lg transition-all"
                    >
                      🗑️
                    </button>
                    {/* Detail Link */}
                    <Link
                      href={'/list/' + task.id}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50
                        rounded-lg transition-all"
                    >
                      &rarr;
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {tasks.length === 0 && (
            <p className="text-center text-gray-400 py-8">
              No tasks yet. Add one above!
            </p>
          )}

          {/* Stats */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
            <span>{tasks.filter(t => !t.completed).length} remaining</span>
            {tasks.some(t => t.completed) && (
              <button
                onClick={clearCompleted}
                className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear completed
              </button>
            )}
            <span>{tasks.filter(t => t.completed).length} completed</span>
          </div>
        </div>

        {undoToast && (
          <UndoToast
            message={undoToast.message}
            onUndo={handleUndo}
            onDismiss={dismissUndo}
          />
        )}
    </div>
  );
}
