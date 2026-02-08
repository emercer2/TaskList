'use client';

import Button from '../components/Button';

export default function Error({ error, reset }) {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">{error.message}</p>
      <Button onClick={() => reset()} className="px-6 py-2">
        Try again
      </Button>
    </div>
  );
}
