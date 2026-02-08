export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-accent-600 border-r-transparent" />
      <p className="mt-4 text-gray-500">Loading...</p>
    </div>
  );
}
