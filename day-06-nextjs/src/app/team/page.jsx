'use client';

import { useState, useEffect } from 'react';

function TeamListBasic() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Team Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
}

function ProgressItem({ task }) {
  return (
    <li className={`
      p-4 border rounded-lg transition-all
      ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}
    `}>
      <div className="flex items-center gap-3">
        <span className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}
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

const CACHE_PREFIX = 'cached_team_progress';

function getCacheKey(memberId) {
  return memberId ? `${CACHE_PREFIX}_member_${memberId}` : CACHE_PREFIX;
}

function getCachedProgress(memberId) {
  try {
    const cached = sessionStorage.getItem(getCacheKey(memberId));
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

function setCachedProgress(tasks, memberId) {
  sessionStorage.setItem(getCacheKey(memberId), JSON.stringify(tasks));
}

const PAGE_SIZE = 10;

function TeamProgressList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [memberId, setMemberId] = useState('');

  const fetchPage = async (start, mid) => {
    let url = `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=${PAGE_SIZE}`;
    if (mid) url += `&userId=${mid}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const fetchProgress = async (mid = memberId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchPage(0, mid);
      setTasks(data);
      setHasMore(data.length === PAGE_SIZE);
      setCachedProgress(data, mid);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await fetchPage(tasks.length, memberId);
      const combined = [...tasks, ...data];
      setTasks(combined);
      setHasMore(data.length === PAGE_SIZE);
      setCachedProgress(combined, memberId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const cached = getCachedProgress(memberId);
    if (cached) {
      setTasks(cached);
      setHasMore(cached.length % PAGE_SIZE === 0);
      setLoading(false);
    } else {
      fetchProgress(memberId);
    }
  }, [memberId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => fetchProgress()} />;
  }

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Team Tasks</h2>
        <div className="flex items-center gap-3">
          <select
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
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
          <ProgressItem key={task.id} task={task} />
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
          onClick={() => fetchProgress()}
          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

export default function TeamProgressPage() {
  return (
    <div>
      <TeamProgressList />
    </div>
  );
}
