'use client';

export const PRIORITIES = ['high', 'medium', 'low'];

export const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function PriorityChip({ priority }) {
  if (!priority) return null;

  return (
    <span className={'px-3 py-1 rounded-full text-sm font-medium shrink-0 ' + (priorityColors[priority] || '')}>
      {priority}
    </span>
  );
}
