export default function ListLayout({ children }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My List</h1>
        <p className="text-gray-600">Manage your personal tasks</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}
