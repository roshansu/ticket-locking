export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              TicketFlow
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />

            <span className="text-sm text-gray-600">
              Live Sync
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}