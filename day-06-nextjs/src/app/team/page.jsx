'use client';

import { useState, useEffect, useRef } from 'react';
import TaskList from '../components/TaskList';

//API Calls
const API_URL = 'https://jsonplaceholder.typicode.com/todos';
async function createTaskAPI(title) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      completed: false,
      userId: 1,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
}

async function updateTaskAPI(id, updates) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
}

async function deleteTaskAPI(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return true;
}


export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [undoToast, setUndoToast] = useState(null);
  const undoRef = useRef(null);
  const hasLoaded = useRef(false);

  const showUndo = (message, prevTasks, pendingAction) => {
    if (undoRef.current) {
      clearTimeout(undoRef.current.timerId);
      undoRef.current.pendingAction?.();
    }
    const timerId = setTimeout(() => {
      pendingAction?.();
      setUndoToast(null);
      undoRef.current = null;
    }, 5000);
    undoRef.current = { timerId, prevTasks, pendingAction };
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
    undoRef.current.pendingAction?.();
    undoRef.current = null;
    setUndoToast(null);
  };

  // READ - Load from cache or fetch from API
  useEffect(() => {
    const cached = localStorage.getItem('team_tasks');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed.length > 0) {
        setTasks(parsed);
        setLoading(false);
        hasLoaded.current = true;
        return;
      }
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}?_limit=10`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        hasLoaded.current = true;
      }
    };

    fetchTasks();
  }, []);

  // Sync tasks to localStorage after every change
  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem('team_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // CREATE
  const handleCreate = async ({ title, description, priority }) => {
    setIsCreating(true);
    try {
      const newTask = await createTaskAPI(title);
      setTasks([{ ...newTask, id: Date.now(), description: description || '', priority }, ...tasks]);
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // UPDATE (Toggle)
  const handleToggle = async (id, completed) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed } : t
    ));

    try {
      await updateTaskAPI(id, { completed });
    } catch (err) {
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, completed: !completed } : t
      ));
      alert('Failed to update task');
    }
  };

  // UPDATE (Edit Title)
  const handleEdit = async (id, title) => {
    const oldTitle = tasks.find(t => t.id === id)?.title;
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, title } : t
    ));

    try {
      await updateTaskAPI(id, { title });
    } catch (err) {
      setTasks(tasks.map(t =>
        t.id === id ? { ...t, title: oldTitle } : t
      ));
      alert('Failed to update task title');
    }
  };

  // BULK DELETE completed tasks
  const handleBulkDelete = () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) return;

    const prev = [...tasks];
    setTasks(tasks.filter(t => !t.completed));
    showUndo(`Cleared ${completedTasks.length} completed task(s)`, prev, () => {
      Promise.all(completedTasks.map(t => deleteTaskAPI(t.id))).catch(() => {});
    });
  };

  // DELETE
  const handleDelete = (id) => {
    const prev = [...tasks];
    setTasks(tasks.filter(t => t.id !== id));
    showUndo('Task deleted', prev, () => {
      deleteTaskAPI(id).catch(() => {});
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <TaskList
      tasks={tasks}
      onAdd={handleCreate}
      onToggle={handleToggle}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onBulkDelete={handleBulkDelete}
      onReorder={setTasks}
      isCreating={isCreating}
      hrefPrefix="/team/"
      undoToast={undoToast}
      onUndo={handleUndo}
      onDismiss={dismissUndo}
    />
  );
}
