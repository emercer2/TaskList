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
// SAMPLE DATA - Start with some tasks
// ============================================================================
const initialTasks = [
  { id: 1, title: 'Complete React fundamentals', completed: true, dueDate: null },
  { id: 2, title: 'Learn useState hook', completed: true, dueDate: '2025-01-15' },
  { id: 3, title: 'Style with Tailwind CSS', completed: false, dueDate: '2025-01-20' },
  { id: 4, title: 'Build task list app', completed: false, dueDate: null },
];

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

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Validate and call onAddTask
    if (title.trim()) {
      onAddTask(title.trim(), dueDate || null);
      //reset form
      setTitle('');
      setDueDate('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='gap-2'>
      {/* TODO: Add styled input and button */}
      {/* Use: flex gap-2, input styling, button styling */}
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

function TaskItem({ task, index, onToggle, onDelete, onEdit, onReorder, justMoved }) {
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
      className={`bg-white flex items-center justify-between p-1 shadow rounded hover:shadow-md transition cursor-grab active:cursor-grabbing ${
        dragOver ? 'border-t-2 border-blue-500' : ''
      } ${justMoved ? 'animate-task-drop' : ''}`}
    >
      {/* TODO: Style the task item container */}
      
      <div className="flex items-center gap-3 pl-2">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          // TODO: Style the checkbox
          className=''
        />
        
        {/* Task title and due date */}
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
          {task.dueDate && (
            <span className={`block text-xs ${
              !task.completed && new Date(task.dueDate) < new Date()
                ? 'text-red-500 font-semibold'
                : 'text-gray-400'
            }`}>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
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

function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder, justMovedId }) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8">
        No tasks to display
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {/* TODO: Map tasks to TaskItem components */}
      {/* Don't forget key prop! */}
      {tasks.map((task, index) =>
            <TaskItem
                key={task.id}
                task={task}
                index={index}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
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
      {/* TODO: Style with Tailwind - flex justify-between, small text */}
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
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('all');
  const [justMovedId, setJustMovedId] = useState(null);

  // Load tasks from localStorage after hydration
  useEffect(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Save tasks to localStorage on every change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // TODO: Implement handlers
  const handleAddTask = (title, dueDate) => {
    // Create new task with unique id
    setTasks(prevTasks => [...prevTasks, { id: Date.now(), title, completed: false, dueDate }]);
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
    // Remove task from array
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

  // TODO: Implement filtering
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; // 'all'
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
          <TaskForm onAddTask={handleAddTask} />
          
          {/* Filter Buttons */}
          <div className="my-4">
            <FilterButtons 
              currentFilter={filter} 
              onFilterChange={setFilter} 
            />
          </div>
          
          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
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
