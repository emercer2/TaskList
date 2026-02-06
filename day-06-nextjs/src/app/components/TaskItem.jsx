'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PriorityChip from './PriorityChip';

export default function TaskItem({ task, onToggle, onEdit, onDelete, isDeleting, href, index, onDragStart, onDragEnter, onDragEnd }) {
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

  const canEdit = !!onEdit;

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
          {canEdit && isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border-2 border-accent-400 rounded
                focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
          ) : canEdit ? (
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
          ) : href ? (
            <Link
              href={href}
              className={`
                truncate hover:text-accent-600
                ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}
              `}
            >
              {task.title}
            </Link>
          ) : (
            <span
              className={`
                truncate
                ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}
              `}
            >
              {task.title}
            </span>
          )}
        </div>

        <PriorityChip priority={task.priority} />

        <div className="flex items-center gap-1 shrink-0">
          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50
              rounded-lg transition-all disabled:cursor-not-allowed"
          >
            {isDeleting ? '⏳' : '🗑️'}
          </button>

          {/* Detail Link */}
          {href && (
            <Link
              href={href}
              className="p-2 text-gray-400 hover:text-accent-500 hover:bg-accent-50
                rounded-lg transition-all"
            >
              &rarr;
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
