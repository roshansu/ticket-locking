import { useEffect, useState } from "react";
import socket from "./utils/socket";
import Navbar from "./components/Navbar";
import TicketCard from "./components/TicketCard";
import StatCard from "./components/StatCard";

function App() {
  const [tickets, setTickets] = useState([]);
  const [locks, setLocks] = useState({});
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);

      socket.emit("join_dashboard");
    });

    socket.on("dashboard_data", (data) => {
      setTickets(data.tickets);
      setLocks(data.locks);
    });

    socket.on("ticket_locked", ({ ticketId, lockedBy }) => {
      setLocks((prev) => ({
        ...prev,
        [ticketId]: lockedBy,
      }));
    });

    socket.on("ticket_unlocked", ({ ticketId }) => {
      setLocks((prev) => {
        const updated = { ...prev };
        delete updated[ticketId];
        return updated;
      });
    });

    socket.on("lock_failed", ({ message }) => {
      showMessage(message);
    });

    socket.on("unlock_failed", ({ message }) => {
      showMessage(message);
    });

    return () => {
      socket.off("connect");
      socket.off("dashboard_data");
      socket.off("ticket_locked");
      socket.off("ticket_unlocked");
      socket.off("lock_failed");
      socket.off("unlock_failed");
    };
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const lockTicket = (ticketId) => {
    socket.emit("lock_ticket", {
      ticketId,
    });
  };

  const unlockTicket = (ticketId) => {
    socket.emit("unlock_ticket", {
      ticketId,
    });
  };

  const totalTickets = tickets.length;
  const lockedTickets = Object.keys(locks).length;
  const availableTickets =
    totalTickets - lockedTickets;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Notification */}

      {message && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-5 py-3">
          <p className="text-gray-700">
            {message}
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Support Ticket Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Real-Time Ticket Locking System
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Socket ID: {socketId}
          </p>
        </div>

        {/* KPI */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <StatCard
            title="Total Tickets"
            value={totalTickets}
          />

          <StatCard
            title="Locked Tickets"
            value={lockedTickets}
          />

          <StatCard
            title="Available Tickets"
            value={availableTickets}
          />
        </div>

        {/* Ticket Grid */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              currentSocketId={socketId}
              lockedBy={locks[ticket.id]}
              isLocked={!!locks[ticket.id]}
              onLock={lockTicket}
              onUnlock={unlockTicket}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;