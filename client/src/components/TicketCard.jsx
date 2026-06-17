export default function TicketCard({
  ticket,
  isLocked,
  lockedBy,
  currentSocketId,
  onLock,
  onUnlock,
}) {
  const isMine = lockedBy === currentSocketId;

  const priorityColors = {
    High: "bg-red-100 text-red-600",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-800">
          {ticket.title}
        </h3>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            priorityColors[ticket.priority]
          }`}
        >
          {ticket.priority}
        </span>
      </div>

      {/* Customer */}
      <p className="text-gray-500 text-sm">
        Customer
      </p>

      <p className="font-medium text-gray-700 mb-4">
        {ticket.customer}
      </p>

      {/* Status */}
      <div className="mb-5">
        {isLocked ? (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
            Locked
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-sm font-medium">
            Available
          </span>
        )}
      </div>

      {/* Actions */}
      {!isLocked && (
        <button
          onClick={() => onLock(ticket.id)}
          className="w-full bg-gray-900 text-white py-2.5 rounded-xl hover:bg-black transition"
        >
          Lock Ticket
        </button>
      )}

      {isMine && (
        <button
          onClick={() => onUnlock(ticket.id)}
          className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-xl hover:bg-gray-300 transition"
        >
          Unlock Ticket
        </button>
      )}

      {isLocked && !isMine && (
        <button
          disabled
          className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl cursor-not-allowed"
        >
          Locked By Another Agent
        </button>
      )}
    </div>
  );
}