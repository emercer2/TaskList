'use client';

/**
 * DAY 5 EXERCISE: Complete Task List Application
 * ==============================================
 * 
 * GOAL: Build a fully functional task list app combining all Week 1 skills.
 *       This is your Week 1 capstone project!
 * 
 * REQUIREMENTS:
 * ✅ Add new tasks via form
 * ✅ Delete tasks
 * ✅ Mark tasks as complete (with strikethrough)
 * ✅ Filter tasks (All / Active / Completed)
 * ✅ Responsive layout with Tailwind
 * ✅ Polished UI with hover/focus states
 * 
 * LEARNING OBJECTIVES:
 * - Combine components, props, state, and Tailwind
 * - Manage complex state with multiple pieces
 * - Implement filtering logic
 * - Build a cohesive, styled application
 * 
 * COMPONENT STRUCTURE:
 * App
 * ├── TaskForm (input + add button)
 * ├── FilterButtons (All / Active / Completed)
 * ├── TaskList
 * │   └── TaskItem (individual task with checkbox + delete)
 * └── TaskStats (count of remaining tasks)
 */

import { useState, useEffect } from 'react';
import Button from './Components/FormFields/Button.jsx';

// ============================================================================
// COLOR PALETTE - Available colors for categories
// ============================================================================
const COLOR_PALETTE = {
  red:    { border: 'border-l-red-500',    bg: 'bg-red-50',    badge: 'bg-red-400 text-white' },
  blue:   { border: 'border-l-blue-500',   bg: 'bg-blue-50',   badge: 'bg-blue-400 text-white' },
  green:  { border: 'border-l-green-500',  bg: 'bg-green-50',  badge: 'bg-green-400 text-white' },
  yellow: { border: 'border-l-yellow-500', bg: 'bg-yellow-50', badge: 'bg-yellow-500 text-white' },
  purple: { border: 'border-l-purple-500', bg: 'bg-purple-50', badge: 'bg-purple-400 text-white' },
  orange: { border: 'border-l-orange-500', bg: 'bg-orange-50', badge: 'bg-orange-400 text-white' },
};

// ============================================================================
// SAMPLE DATA - Start with some tasks
// ============================================================================
const initialTasks = [
  { id: 1, title: 'Complete React fundamentals', completed: true, dueDate: null, categoryId: null },
  { id: 2, title: 'Learn useState hook', completed: true, dueDate: '2025-01-15', categoryId: null },
  { id: 3, title: 'Style with Tailwind CSS', completed: false, dueDate: '2025-01-20', categoryId: null },
  { id: 4, title: 'Build task list app', completed: false, dueDate: null, categoryId: null },
];

const initialCategories = [];

// ============================================================================
// TASK 1: TaskForm Component
// ============================================================================
// Props: onAddTask (function to call with new task title)
// 
// Requirements:
// - Input field for task title
// - Add button (disabled when empty)
// - Clear input after adding
// - Nice styling with Tailwind
// ============================================================================

function TaskForm({ onAddTask, categories }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim(), dueDate || null, categoryId ? Number(categoryId) : null);

      //reset form
      setTitle('');
      setDueDate('');
      setCategoryId('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='gap-2'>
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className='border border-gray-300 rounded px-3 py-2 w-full'
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className='border border-gray-300 rounded px-3 py-2'
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className='border border-gray-300 rounded px-2 py-2 text-sm'
        >
          <option value="">No category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <Button
          style="primary"
          text="Add"
          type="submit"
          size='md'
          disabled={!title.trim()}
        >
          Add
        </Button>
      </div>
    </form>
  );
}

// ============================================================================
// TASK 2: FilterButtons Component
// ============================================================================
// Props: currentFilter, onFilterChange
// 
// Filters: 'all' | 'active' | 'completed'
// 
// Requirements:
// - Three buttons for each filter
// - Highlight active filter
// - Nice styling with hover states
// ============================================================================

function FilterButtons({ currentFilter, onFilterChange }) {
  const filters = ['all', 'active', 'completed'];
  
  return (
    <div className="flex gap-1">
      {filters.map(filter => (
        <Button
            key={filter}
            size='sm'
            onClick={() => onFilterChange(filter)}
            text={filter.charAt(0).toUpperCase() + filter.slice(1)}
            style={currentFilter === filter ? 'primary' : 'secondary'}
        />
      ))}
    </div>
  );
}

// ============================================================================
// CategoryManager Component
// ============================================================================
// Props: categories, onAdd, onDelete
// ============================================================================

function CategoryManager({ categories, onAdd, onDelete }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), color);
      setName('');
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing categories */}
      <div className="flex flex-wrap gap-1">
        {categories.map(cat => (
          <span
            key={cat.id}
            className={`${COLOR_PALETTE[cat.color].badge} text-xs px-2 py-1 rounded-full inline-flex items-center gap-1`}
          >
            {cat.name}
            <button onClick={() => onDelete(cat.id)} className="hover:opacity-70">x</button>
          </span>
        ))}
      </div>

      {/* Add new category */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New category..."
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        />
        <select
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {Object.keys(COLOR_PALETTE).map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <Button style="primary" size="sm" text="Add" onClick={handleAdd} disabled={!name.trim()} />
      </div>
    </div>
  );
}

// ============================================================================
// TASK 3: TaskItem Component
// ============================================================================
// Props: task, onToggle, onDelete
// 
// Requirements:
// - Checkbox to toggle completion
// - Task title (strikethrough when completed)
// - Delete button
// - Hover effects
// ============================================================================

function TaskItem({ task, index, category, onToggle, onDelete, onEdit, onReorder, justMoved }) {
  const catColors = category ? COLOR_PALETTE[category.color] : null;
  const [dragOver, setDragOver] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const handleDoubleClick = () => {
    setEditing(true);
    setEditText(task.title);
  };

  const handleEditSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.title) {
      onEdit(task.id, trimmed);
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditing(false);
    }
  };

  // dragging items
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const fromIndex = Number(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== index) {
      onReorder(fromIndex, index);
    }
  };

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`${catColors ? `${catColors.bg} border-l-4 ${catColors.border}` : 'bg-white'} flex items-center justify-between p-1 shadow rounded hover:shadow-md transition cursor-grab active:cursor-grabbing ${
        dragOver ? 'border-t-2 border-blue-500' : ''
      } ${justMoved ? 'animate-task-drop' : ''}`}
    >
      
      <div className="flex items-center gap-3 pl-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className='focus:ring-blue-500 h-4 w-4 rounded'
        />
        
        <div>
          {editing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={handleEditKeyDown}
              autoFocus
              className="border border-blue-400 rounded px-2 py-0.5 text-gray-800 outline-none focus:ring-2 focus:ring-blue-300"
            />
          ) : (
            <span
              onDoubleClick={handleDoubleClick}
              className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-800'} cursor-text`}
            >
              {task.title}
            </span>
          )}
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <span className={`text-xs ${
                !task.completed && new Date(task.dueDate) < new Date()
                  ? 'text-red-500 font-semibold'
                  : 'text-gray-400'
              }`}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {category && (
              <span className={`${catColors.badge} text-xs px-1.5 py-0.5 rounded-full`}>
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete button */}
      <Button
        onClick={() => onDelete(task.id)}
        style='danger'
        text="Delete"
        size='sm'
      />
    </li>
  );
}

// ============================================================================
// TASK 4: TaskList Component
// ============================================================================
// Props: tasks, onToggle, onDelete
// 
// Requirements:
// - Render list of TaskItem components
// - Handle empty state
// ============================================================================

function TaskList({ tasks, categories, onToggle, onDelete, onEdit, onReorder, justMovedId }) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        No tasks to display
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task, index) =>
            <TaskItem
                key={task.id}
                task={task}
                index={index}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
                category={categories.find(c => c.id === task.categoryId) || null}
                onReorder={onReorder}
                justMoved={task.id === justMovedId}
            />
      )}
    </ul>
  );
}

// ============================================================================
// TASK 5: TaskStats Component
// ============================================================================
// Props: tasks
// 
// Requirements:
// - Show count of remaining (active) tasks
// - Show count of completed tasks
// ============================================================================

function TaskStats({ tasks, onClearCompleted }) {
  const activeCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className='flex justify-between text-sm'>
      <span>{activeCount} tasks remaining</span>
      <div className='flex items-center gap-2'>
        <Button 
            style="secondary" 
            size="sm" 
            text={`Clear Completed`} 
            onClick={onClearCompleted}
        />
        <span>{completedCount} Completed</span>
      </div>
    </div>
  );
}

// ============================================================================
// TASK 6: App Component - Bring it all together
// ============================================================================
// State needed:
// - tasks (array)
// - filter ('all' | 'active' | 'completed')
// 
// Handlers needed:
// - addTask(title)
// - toggleTask(id)
// - deleteTask(id)
// - setFilter(filter)
// 
// Filtering logic:
// - 'all': show all tasks
// - 'active': show tasks where completed === false
// - 'completed': show tasks where completed === true
// ============================================================================

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [filter, setFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [justMovedId, setJustMovedId] = useState(null);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Category handlers
  const handleAddCategory = (name, color) => {
    setCategories(prev => [...prev, { id: Date.now(), name, color }]);
  };

  const handleDeleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    setTasks(prev => prev.map(t => t.categoryId === id ? { ...t, categoryId: null } : t));
  };

  const handleAddTask = (title, dueDate, categoryId) => {
    // Create new task with unique id
    setTasks(prevTasks => [...prevTasks, { id: Date.now(), title, completed: false, dueDate, categoryId }]);
  };

  const handleToggleTask = (id) => {
    // Toggle completed status
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleEditTask = (id, newTitle) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  };

  const handleClearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const handleReorderTasks = (fromIndex, toIndex) => {
    setTasks(prevTasks => {
      const updated = [...prevTasks];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setJustMovedId(moved.id);
      return updated;
    });
  };

  useEffect(() => {
    if (justMovedId === null) return;
    const timer = setTimeout(() => setJustMovedId(null), 300);
    return () => clearTimeout(timer);
  }, [justMovedId]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (categoryFilter !== null && task.categoryId !== categoryFilter) return false;
    return true;
  });
  
  return (
    <div className="min-h-screen bg-blue-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          Task List
        </h1>
        
        {/* Main Card */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6">
          {/* Task Form */}
          <TaskForm onAddTask={handleAddTask} categories={categories} />

          {/* Categories */}
          <div className="my-4">
            <CategoryManager
              categories={categories}
              onAdd={handleAddCategory}
              onDelete={handleDeleteCategory}
            />
          </div>

          {/* Filter Buttons */}
          <div className="my-4 space-y-2">
            <FilterButtons
              currentFilter={filter}
              onFilterChange={setFilter}
            />
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setCategoryFilter(null)}
                  className={`text-xs px-2 py-1 rounded-full ${categoryFilter === null ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`text-xs px-2 py-1 rounded-full ${categoryFilter === cat.id ? COLOR_PALETTE[cat.color].badge : 'bg-gray-200 text-gray-600'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            categories={categories}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onReorder={handleReorderTasks}
            justMovedId={justMovedId}
          />
          
          {/* Stats */}
          <div className="mt-4 pt-4 border-t">
            <TaskStats tasks={tasks} onClearCompleted={handleClearCompleted} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// STRETCH GOALS (if you finish early)
// ============================================================================
//// 1. Add "Clear Completed" button to remove all completed tasks
//// 2. Add task editing (double-click to edit)
//// 3. Add drag-and-drop reordering
//// 4. Add due dates with overdue highlighting
// 5. Add categories/tags with color coding
//// 6. Persist tasks to localStorage

export default App;
