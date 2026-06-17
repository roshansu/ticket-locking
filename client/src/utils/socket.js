import { io } from "socket.io-client";

const socket = io("https://ticket-locking-478c.vercel.app");

export default socket;