import { io, Socket } from "socket.io-client";
import type { ChatMessage } from "../redux/features/messagesSlice";
import { SOCKET_EVENTS } from "../types";

// Reference: https://www.jsonrpc.org/specification
export type RPCRequest = {
  jsonrpc: "2.0";
  id: number | string;
  method: string;
  params?: unknown;
};
export type RPCResponse = {
  jsonrpc: "2.0";
  id?: number | string | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
};

let _id = 1;

export class RPCClient {
  private socket!: Socket;

  async connect(url: string) {
    this.socket = io(url, { transports: ["websocket"] });
    await new Promise<void>((resolve, reject) => {
      this.socket.once("connect", () => resolve());
      this.socket.once("connect_error", (e) => reject(e));
    });
  }

  // all push messages from server to client
  // notification object is in note
  onNotify(cb: (note:{ type: string, payload: ChatMessage } ) => void) {
    this.socket.on(SOCKET_EVENTS.NOTIFY, cb);
  }
  offNotify(cb: (note: unknown) => void) {
    this.socket.off(SOCKET_EVENTS.NOTIFY, cb);
  }

  call<T = unknown>(method: string, params?: unknown): Promise<T> {
    // on every request call a unique id is generated
    const id = _id++;
    return new Promise<T>((resolve, reject) => {
      const onResp = (res: RPCResponse) => {
        // checking if response is for the same request id and accordingly accepts or rejects the call
        if (res?.id !== id) return;
        //  stops listening for event response
        this.socket.off(SOCKET_EVENTS.RESPONSE, onResp);
        if (res.error) return reject(res.error);
        resolve(res.result as T);
      };
      this.socket.on(SOCKET_EVENTS.RESPONSE, onResp);
      this.socket.emit(SOCKET_EVENTS.REQUEST, { jsonrpc: "2.0", id, method, params } as RPCRequest);
    });
  }

  disconnect() { this.socket?.disconnect(); }
  isConnected() { return this.socket?.connected ?? false; }
}

export const rpc = new RPCClient();
