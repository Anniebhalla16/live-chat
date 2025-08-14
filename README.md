# Realtime Chat App (Socket.IO + Redux + Three.js)

A minimal real‑time chat application:

* **Frontend:** React, Redux Toolkit, MUI/Tailwind-ready styling
* **Backend:** Node.js, Express, Socket.IO
* **RPC:** JSON‑RPC 2.0 over a single Socket.IO event
* **3D Icon:** Lightweight Three.js “bubble burst” animation on **send**
* **Cross‑browser:** Chrome, Firefox, Edge 

---

## Features

* Global chat: all connected clients see new messages
* JSON‑RPC methods: `sendMessage`, `listRecent`
* Socket.IO channels: `rpc/request`, `rpc/response`, `rpc/notify`
* **Three.js** overlay that spawns a brief bubble burst when **I** send a message
* Smooth auto‑scroll, history hydration

---

## Prerequisites

* **Node.js 18+** 
* **npm** or **yarn**

---

## Backend — Setup & Run

From `server/`:

```bash
# install
npm i

# env (example)
# PORT defaults to 3001
# CORS_ORIGIN defaults to http://localhost:5173
cp .env.example .env   # edit if needed

# run dev
npm run dev            # e.g., ts-node-dev / nodemon

# or build & start
npm run build
npm start
```

### Backend Highlights

* **Events**

  * `rpc/request` — client → server (JSON‑RPC request)
  * `rpc/response` — server → requesting client (JSON‑RPC response)
  * `rpc/notify` — server → **all** clients (notifications, e.g., new message)
* **Methods**

  * `sendMessage(params: { text: string; author: string }) → ChatMessage`
  * `listRecent(params?: { limit?: number }) → ChatMessage[]`
* **Notify payload**

  ```ts
  io.emit('rpc/notify', { type: 'message/new', payload: ChatMessage });
  ```

---

## Frontend — Setup & Run

From `client/`:

```bash
# install
npm i
# or: yarn

# env (Vite)
# The backend URL you want the client to connect to
# e.g., http://localhost:3001
VITE_SERVER_URL=http://localhost:3001

# run dev
npm run dev            # Vite (default http://localhost:5173)

# build
npm run build
npm run preview        # optional
```
---

## How to Use (Dev Flow)

1. **Start backend** at `http://localhost:3001`.
2. **Start frontend** at `http://localhost:5173`.
3. Open in two browsers (Chrome/Firefox/Edge) and send messages.
4. Watch: new messages appear on both ends; on *send*, a **3D bubble burst** briefly animates inside the chat panel.

---

## Configuration

* `PORT` *(server)* — default **3001**
* `CORS_ORIGIN` *(server)* — default **[http://localhost:5173](http://localhost:5173)**
* `VITE_SERVER_URL` *(client)* — Socket.IO endpoint, default **[http://localhost:3001](http://localhost:3001)**

---

## Cross‑Browser Notes

* Client **does not force** `transports: ['websocket']` to allow fallbacks behind proxies.
* Tested on recent Chrome/Firefox/Edge.

---

## Troubleshooting

* **CORS error** — set `CORS_ORIGIN` on server to the exact frontend origin.
* **Cannot connect to Socket.IO** — verify `VITE_SERVER_URL`, ports, and that the server is running.
* **Duplicate messages** — ensure you don’t optimistically add on send; rely on `rpc/notify`.
* **Animation covers input** — make sure the `MessageList` container has `position: relative` and `overflow: hidden`, and the overlay is mounted **inside** that box.

---

## Optional: Only animate on *local send*

* Add `burstNow()` in `messagesSlice` that increments `sendCount`.
* Dispatch `burstNow()` inside `sendMessageRPC` **before** or **after** the RPC call.
* Do **not** increment `sendCount` in `messageReceived` to avoid remote bursts.

---

## License

MIT (or as appropriate for your project).

---

## Roadmap (nice‑to‑have)

* Rooms/DMs (`joinRoom`), message persistence, avatars
* Typing indicator, message delivery acks
* E2E tests and CI, Docker Compose for dev
