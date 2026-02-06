'use client';

import { useState, useEffect, useRef } from 'react';
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

function TaskForm({ onSubmit, isLoading }) {
  const [title, setTitle] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        disabled={isLoading}
        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!title.trim() || isLoading}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
          hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
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
    </form>
  );
}


function TaskItem({ task, onToggle, onEdit, onDelete, isDeleting, index, onDragStart, onDragEnter, onDragEnd }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  return (
    <li
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`
        p-4 border-2 rounded-lg transition-all
        ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}
        ${isDeleting ? 'opacity-50' : 'hover:shadow-md'}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Drag Handle */}
          <span className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 select-none"
            title="Drag to reorder"
          >
            ⠿
          </span>

          {/* Toggle Checkbox */}
          <button
            onClick={() => onToggle(task.id, !task.completed)}
            disabled={isDeleting}
            className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
              transition-all disabled:cursor-not-allowed
              ${task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-400'
              }
            `}
          >
            {task.completed && '✓'}
          </button>

          {/* Task Title */}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border-2 border-blue-400 rounded
                focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <span
              onDoubleClick={() => !isDeleting && setIsEditing(true)}
              className={`
                cursor-pointer truncate
                ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}
              `}
              title="Double-click to edit"
            >
              {task.title}
            </span>
          )}
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(task.id)}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
            rounded-lg transition-all disabled:cursor-not-allowed shrink-0"
        >
          {isDeleting ? '⏳' : '🗑️'}
        </button>
      </div>
    </li>
  );
}


export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [undoToast, setUndoToast] = useState(null);
  const undoRef = useRef(null);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const hasLoaded = useRef(false);

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
      setTasks(JSON.parse(cached));
      setLoading(false);
      hasLoaded.current = true;
      return;
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
  const handleCreate = async (title) => {
    setIsCreating(true);
    try {
      const newTask = await createTaskAPI(title);
      // JSONPlaceholder returns id: 201 for all new items
      // Use Date.now() for unique local ID
      setTasks([{ ...newTask, id: Date.now() }, ...tasks]);
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    } finally {
      setIsCreating(false);
    }
  };
  
  // UPDATE (Toggle)
  const handleToggle = async (id, completed) => {
    // Optimistic update
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed } : t
    ));
    
    try {
      await updateTaskAPI(id, { completed });
    } catch (err) {
      // Revert on error
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 px-4">
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Create */}
          <TaskForm onSubmit={handleCreate} isLoading={isCreating} />
          
          {/* Read */}
          <ul className="space-y-3">
            {tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                task={task}
                index={index}
                onToggle={handleToggle}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
              />
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
                onClick={handleBulkDelete}
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
