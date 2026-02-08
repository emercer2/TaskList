'use client';

export default function UndoToast({ message, onUndo, onDismiss }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white
      px-4 py-3 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <span className="text-sm">{message}</span>
      <button
        onClick={onUndo}
        className="px-3 py-1 bg-accent-500 hover:bg-accent-400 text-white text-sm font-medium rounded transition-colors"
      >
        Undo
      </button>
      <button onClick={onDismiss} className="text-gray-400 hover:text-white text-sm">
        ✕
      </button>
    </div>
  );
}
