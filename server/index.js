// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const { Server } = require("socket.io");
import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io';

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});


const tickets = [
  {
    id: 1,
    title: "Payment Failed",
    customer: "John Smith",
    priority: "High",
  },
  {
    id: 2,
    title: "Login Issue",
    customer: "Emma Wilson",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Refund Request",
    customer: "David Miller",
    priority: "Low",
  },
  {
    id: 4,
    title: "Account Locked",
    customer: "Sophia Brown",
    priority: "High",
  },
  {
    id: 5,
    title: "Email Not Received",
    customer: "Michael Lee",
    priority: "Medium",
  },
  {
    id: 6,
    title: "Subscription Cancel",
    customer: "Olivia Taylor",
    priority: "Low",
  },
  {
    id: 7,
    title: "Password Reset",
    customer: "William Garcia",
    priority: "High",
  },
  {
    id: 8,
    title: "Duplicate Charge",
    customer: "James Anderson",
    priority: "High",
  },
  {
    id: 9,
    title: "Order Tracking",
    customer: "Ava Martinez",
    priority: "Low",
  },
  {
    id: 10,
    title: "Invoice Missing",
    customer: "Noah Harris",
    priority: "Medium",
  },
  {
    id: 11,
    title: "App Crash",
    customer: "Lucas Clark",
    priority: "High",
  },
  {
    id: 12,
    title: "Bug Report",
    customer: "Charlotte Lewis",
    priority: "Medium",
  },
  {
    id: 13,
    title: "Feature Request",
    customer: "Benjamin Walker",
    priority: "Low",
  },
  {
    id: 14,
    title: "Profile Update",
    customer: "Mia Hall",
    priority: "Low",
  },
  {
    id: 15,
    title: "Unable To Upload File",
    customer: "Henry Allen",
    priority: "High",
  },
  {
    id: 16,
    title: "Wrong Billing",
    customer: "Evelyn Young",
    priority: "High",
  },
  {
    id: 17,
    title: "API Error",
    customer: "Daniel King",
    priority: "Medium",
  },
  {
    id: 18,
    title: "OTP Not Received",
    customer: "Harper Wright",
    priority: "High",
  },
  {
    id: 19,
    title: "Slow Performance",
    customer: "Matthew Scott",
    priority: "Medium",
  },
  {
    id: 20,
    title: "Data Sync Failed",
    customer: "Ella Green",
    priority: "High",
  },
];


const ticketLocks = new Map();


const socketLocks = new Map();


app.get("/api/tickets", (req, res) => {
  res.status(200).json({
    success: true,
    tickets,
    locks: Object.fromEntries(ticketLocks),
  });
});


io.on("connection", (socket) => {
  console.log("Connected:", socket.id);


  socket.on("join_dashboard", () => {
    console.log(`${socket.id} joined dashboard`);

    socket.emit("dashboard_data", {
      tickets,
      locks: Object.fromEntries(ticketLocks),
    });
  });


  socket.on("lock_ticket", ({ ticketId }) => {
    if (ticketLocks.has(ticketId)) {
      socket.emit("lock_failed", {
        ticketId,
        message: "Ticket already locked by another agent",
      });

      return;
    }

    ticketLocks.set(ticketId, socket.id);

    if (!socketLocks.has(socket.id)) {
      socketLocks.set(socket.id, new Set());
    }

    socketLocks.get(socket.id).add(ticketId);

    io.emit("ticket_locked", {
      ticketId,
      lockedBy: socket.id,
    });

    console.log(
      `Ticket ${ticketId} locked by ${socket.id}`
    );
  });

  socket.on("unlock_ticket", ({ ticketId }) => {
    const owner = ticketLocks.get(ticketId);

    if (!owner) {
      return;
    }

    if (owner !== socket.id) {
      socket.emit("unlock_failed", {
        ticketId,
        message: "You do not own this ticket lock",
      });

      return;
    }

    ticketLocks.delete(ticketId);

    const ownedTickets = socketLocks.get(socket.id);

    if (ownedTickets) {
      ownedTickets.delete(ticketId);

      if (ownedTickets.size === 0) {
        socketLocks.delete(socket.id);
      }
    }

    io.emit("ticket_unlocked", {
      ticketId,
    });

    console.log(
      `Ticket ${ticketId} unlocked by ${socket.id}`
    );
  });

  socket.on("disconnect", () => {
    console.log(
      `Socket disconnected: ${socket.id}`
    );

    const ownedTickets =
      socketLocks.get(socket.id);

    if (!ownedTickets) {
      return;
    }

    for (const ticketId of ownedTickets) {
      ticketLocks.delete(ticketId);

      io.emit("ticket_unlocked", {
        ticketId,
      });

      console.log(
        `Auto released Ticket ${ticketId}`
      );
    }

    socketLocks.delete(socket.id);
  });
});

const PORT = 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});