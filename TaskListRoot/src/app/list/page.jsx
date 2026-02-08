'use client';

import { useState, useRef } from 'react';
import TaskList from '../components/TaskList';

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
  const [undoToast, setUndoToast] = useState(null);
  const undoRef = useRef(null);

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

  const addTask = ({ title, description, priority }) => {
    setTasks([...tasks, {
      id: Date.now(),
      title,
      description: description || '',
      completed: false,
      priority,
    }]);
  };

  const deleteTask = (id) => {
    const prev = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    showUndo('Task deleted', prev);
  };

  const toggleTask = (id, completed) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));
  };

  const editTask = (id, title) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, title } : t));
  };

  const clearCompleted = () => {
    const count = tasks.filter(t => t.completed).length;
    if (count === 0) return;
    const prev = [...tasks];
    setTasks(tasks.filter(t => !t.completed));
    showUndo(`Cleared ${count} completed task(s)`, prev);
  };

  return (
    <TaskList
      tasks={tasks}
      onAdd={addTask}
      onToggle={toggleTask}
      onEdit={editTask}
      onDelete={deleteTask}
      onBulkDelete={clearCompleted}
      onReorder={setTasks}
      hrefPrefix="/list/"
      undoToast={undoToast}
      onUndo={handleUndo}
      onDismiss={dismissUndo}
    />
  );
}
