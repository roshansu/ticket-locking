# Real-Time Ticket Locking Dashboard

A real-time ticket management system built with **React, Vite, Tailwind CSS, Node.js, Express, and Socket.io**. The application allows multiple support agents to view tickets and lock/unlock them in real time while preventing concurrent editing.

## Features

### Real-Time Ticket Locking

* Lock tickets instantly using Socket.io.
* Prevents multiple agents from working on the same ticket simultaneously.
* Live synchronization across all connected clients.

### In-Memory Lock Management

* Uses JavaScript `Map()` for O(1) lock lookup.
* No database latency for lock operations.
* Server acts as the source of truth for ticket locks.

### Ghost Disconnect Handling

* Automatically releases locks when a client disconnects unexpectedly.
* Prevents tickets from remaining locked forever.
* Handles browser crashes, network failures, and abrupt tab closures.

### Dashboard Features

* Modern responsive UI.
* White and Gray professional theme.
* KPI cards displaying:

  * Total Tickets
  * Locked Tickets
  * Available Tickets
* Real-time ticket status updates.
* Toast notifications for lock conflicts.

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io

## Project Structure

```bash
ticket-locking-system/
│
├── backend/
│   ├── server.js
│   ├── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── TicketCard.jsx
    │   │   └── StatCard.jsx
    │   │
    │   ├── socket.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── vite.config.js
    └── package.json
```

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ticket-locking-system
```

## Backend Setup

```bash
cd backend

npm install

npm run dev
```

Server runs on:

```bash
http://localhost:5000
```

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

## Socket Events

### join_dashboard

Loads tickets and current lock state.

```javascript
socket.emit("join_dashboard");
```

### lock_ticket

Locks a ticket if available.

```javascript
socket.emit("lock_ticket", {
  ticketId: 1,
});
```

### unlock_ticket

Unlocks a ticket owned by the current socket.

```javascript
socket.emit("unlock_ticket", {
  ticketId: 1,
});
```

### ticket_locked

Broadcasted to all connected clients.

```javascript
{
  ticketId: 1,
  lockedBy: "socket-id"
}
```

### ticket_unlocked

Broadcasted when a lock is released.

```javascript
{
  ticketId: 1
}
```

## In-Memory Lock Architecture

### Ticket Locks

```javascript
const ticketLocks = new Map();
```

Structure:

```javascript
ticketId => socketId
```

Example:

```javascript
1 => "socket123"
2 => "socket456"
```

### Socket Locks

```javascript
const socketLocks = new Map();
```

Structure:

```javascript
socketId => Set(ticketIds)
```

Example:

```javascript
"socket123" => Set([1, 5, 9])
```

This allows efficient cleanup during disconnect events.

## Ghost Disconnect Solution

When a client disconnects unexpectedly:

```javascript
socket.on("disconnect", () => {
  const ownedTickets =
    socketLocks.get(socket.id);

  for (const ticketId of ownedTickets) {
    ticketLocks.delete(ticketId);

    io.emit("ticket_unlocked", {
      ticketId,
    });
  }
});
```

Benefits:

* No stale locks.
* No manual cleanup required.
* Automatic recovery from crashes and network failures.

## Performance

### Lock Lookup

```javascript
Map.has(ticketId)
```

Time Complexity:

```text
O(1)
```

### Lock Creation

```text
O(1)
```

### Lock Release

```text
O(1)
```

### Disconnect Cleanup

```text
O(number of tickets owned by disconnected socket)
```

## Future Improvements

* MongoDB integration
* User authentication (JWT)
* Ticket assignment
* Ticket comments
* Ticket priorities and filters
* Redis for distributed locking
* Horizontal scaling with Socket.io adapter
* Activity logs
* Admin dashboard

## Interview Discussion Points

### Why use Map instead of MongoDB?

Locking is a high-frequency operation requiring immediate consistency and low latency. Using an in-memory `Map` provides constant-time lookup and avoids unnecessary database reads and writes.

### How are race conditions prevented?

The server validates every lock request before updating the lock store. Since all lock operations are processed centrally by the Node.js server, only one socket can acquire a lock at a time.

### How are ghost locks handled?

The disconnect listener automatically releases any tickets owned by the disconnected socket and broadcasts the update to all connected clients.

## Author

Roshan Kumar

Built as a Full Stack Engineering assessment project demonstrating:

* Real-Time Communication
* Socket.io
* State Synchronization
* Concurrency Control
* Ghost Disconnect Recovery
* Modern React UI Development
