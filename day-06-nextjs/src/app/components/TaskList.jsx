'use client';

import { useRef } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import UndoToast from './UndoToast';

export default function TaskList({ tasks, onAdd, onToggle, onEdit, onDelete, onBulkDelete, onReorder, isCreating, hrefPrefix, undoToast, onUndo, onDismiss }) {
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
    onReorder(reordered);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <>
      <TaskForm onSubmit={onAdd} isLoading={isCreating} />

      <div className="border-t border-gray-200 my-6" />

      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            index={index}
            href={hrefPrefix + task.id}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
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

      <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
        <span>{tasks.filter(t => !t.completed).length} remaining</span>
        {tasks.some(t => t.completed) && (
          <button
            onClick={onBulkDelete}
            className="px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear completed
          </button>
        )}
        <span>{tasks.filter(t => t.completed).length} completed</span>
      </div>

      {undoToast && (
        <UndoToast
          message={undoToast.message}
          onUndo={onUndo}
          onDismiss={onDismiss}
        />
      )}
    </>
  );
}
