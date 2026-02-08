'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PriorityChip from './PriorityChip';
import Input from './Input';
import Button from './Button';

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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0 overflow-visible">
        {/* Row 1: Drag handle + checkbox + title */}
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
            <Input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 px-2 py-1"
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

        {/* Row 2 on mobile: Priority chip (left) + buttons (right) */}
        <div className="flex items-center gap-2 pl-7 sm:pl-0 shrink-0">
          <PriorityChip priority={task.priority} />

          <div className="flex items-center gap-1 ml-auto">
            {/* Delete Button */}
            <Button
              variant="ghost"
              onClick={() => onDelete(task.id)}
              disabled={isDeleting}
              className="px-3 py-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>

            {/* Detail Link */}
            {href && (
              <Button
                as={Link}
                variant="ghost"
                href={href}
                className="px-3 py-1 hover:text-accent-600 hover:bg-accent-50"
              >
                Details
              </Button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
