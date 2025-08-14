import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { handleRPC } from './rpcRouter';
import { SOCKET_EVENTS } from './types';

const PORT = Number(process.env.PORT || 3001);
const ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

const app = express();
app.use(cors({ origin: ORIGIN }));
// to check if server is up and running
app.get('/health', (_req, res) => res.json({ ok: true }));

// wraps express in a NODE http so socket can share the same port 3001
const server = http.createServer(app);

// attaches socket to same http server
const io = new Server(server, {
  cors: { origin: ORIGIN }
});

io.on('connection', (socket) => {
  console.log('socket connected:', socket.id);
  // any rpc/request to server is handled by handleRPC
  socket.on(SOCKET_EVENTS.REQUEST, (req) => handleRPC(io, socket, req));
  socket.on('disconnect', (reason) => {
    console.log('socket disconnected:', socket.id, reason);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`CORS origin: ${ORIGIN}`);
});
