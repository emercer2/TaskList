'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';


function TaskListBasic() {
  // TODO: Set up state for tasks, loading, and error
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Fetch data on mount with useEffect
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos?_limit=10')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array = run once on mount

  // TODO: Return loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // TODO: Return error state
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Team Tasks</h2>
      {/* TODO: Map over tasks and display */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

function TaskItem({ task, onToggle }) {
  return (
    <li
      onClick={() => onToggle(task.id)}
      className={`
        p-4 border rounded-lg transition-all cursor-pointer
        ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:shadow-md'}
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-400'}
        `}>
          {task.completed && '✓'}
        </span>
        <span className={task.completed ? 'line-through text-gray-400' : 'text-gray-800'}>
          {task.title}
        </span>
      </div>
    </li>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading team progress...</span>
    </div>
  );
}

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

const CACHE_PREFIX = 'cached_api_tasks';

function getCacheKey(userId) {
  return userId ? `${CACHE_PREFIX}_user_${userId}` : CACHE_PREFIX;
}

function getCachedTasks(userId) {
  try {
    const cached = sessionStorage.getItem(getCacheKey(userId));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedTasks(tasks, userId) {
  sessionStorage.setItem(getCacheKey(userId), JSON.stringify(tasks));
}

const PAGE_SIZE = 10;

function TaskListComplete() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [userId, setUserId] = useState('');

  // Fetch a page of tasks starting at a given offset
  const fetchPage = async (start, uid) => {
    let url = `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${PAGE_SIZE}`;
    if (uid) url += `&userId=${uid}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  // Initial fetch (also used by retry/refresh)
  const fetchTasks = async (uid = userId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPage(0, uid);
      setTasks(data);
      setHasMore(data.length === PAGE_SIZE);
      setCachedTasks(data, uid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load next page and append
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await fetchPage(tasks.length, userId);
      const combined = [...tasks, ...data];
      setTasks(combined);
      setHasMore(data.length === PAGE_SIZE);
      setCachedTasks(combined, userId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  // On mount, use cache if available, otherwise fetch
  useEffect(() => {
    const cached = getCachedTasks(userId);
    if (cached) {
      setTasks(cached);
      setHasMore(cached.length % PAGE_SIZE === 0);
      setLoading(false);
    } else {
      fetchTasks(userId);
    }
  }, [userId]);

  // Optimistic toggle: update UI immediately, PATCH in background, rollback on failure
  const toggleTask = async (id) => {
    const previousTasks = tasks;
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    setCachedTasks(updated, userId);

    try {
      const task = updated.find(t => t.id === id);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: task.completed }),
        }
      );
      if (!response.ok) throw new Error('Update failed');
    } catch {
      // Rollback on failure
      setTasks(previousTasks);
      setCachedTasks(previousTasks, userId);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchTasks} />;
  }

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Team Tasks</h2>
        <div className="flex items-center gap-3">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-3 py-1 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Members</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(id => (
              <option key={id} value={id}>Member {id}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            {completedCount}/{tasks.length} completed
          </span>
        </div>
      </div>

      <ul className="space-y-3">
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} onToggle={toggleTask} />
        ))}
      </ul>

      <div className="flex items-center gap-3 mt-6">
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        )}
        <button
          onClick={fetchTasks}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Team Progress
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Switch between TaskListBasic and TaskListComplete to test */}
        <TaskListComplete />
      </div>
    </div>
  );
}

// ============================================================================
// EXERCISE CHECKLIST
// ============================================================================
/*
[ ] Loading spinner shows while fetching
[ ] Tasks display after successful fetch
[ ] Error message shows if fetch fails
[ ] Retry button works
[ ] Refresh button refetches data
[ ] Completed tasks show with strikethrough

STRETCH GOALS:
1. Add a user filter (JSONPlaceholder has userId)
2. Add pagination (fetch more on scroll or button)
3. Cache data to avoid refetching
4. Add optimistic UI updates
*/
