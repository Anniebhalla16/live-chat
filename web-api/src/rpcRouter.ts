import type { Server, Socket } from 'socket.io';
import { addMessage, getRecent } from './store';
import { ChatMessage, CODES, JSONRPCSuccess, METHOD, NOTIFY_EVENTS, SendMessageParams, SOCKET_EVENTS, type JSONRPCError, type JSONRPCRequest, type JSONRPCResponse } from './types';


function error(id: JSONRPCRequest['id'], code: number, message: string, data?: unknown): JSONRPCError {
  return { jsonrpc: '2.0', id: id ?? null, error: { code, message, data } };
}
function result(id: JSONRPCRequest['id'], res: unknown): JSONRPCResponse {
  return { jsonrpc: '2.0', id: id ?? null, result: res };
}

const messages: ChatMessage[] = [];

// handles the RPC requests from rpcClient
export async function handleRPC(io: Server, socket: Socket, req: JSONRPCRequest) {
  try {
    if (req?.jsonrpc !== '2.0') {
      return socket.emit(SOCKET_EVENTS.RESPONSE, error(req?.id, CODES.INVALID_REQUEST, 'Invalid JSON-RPC envelope'));
    }
    switch (req.method) {
      case METHOD.SEND_MESSAGE: {
        const { text } = req.params as SendMessageParams;
        const msg = addMessage(socket.id, text);   
        io.emit(SOCKET_EVENTS.NOTIFY, { type: NOTIFY_EVENTS.NEW_MESSAGE, payload: msg });
        return socket.emit(SOCKET_EVENTS.RESPONSE, result(req.id, msg));
      }

      case METHOD.LIST_RECENT: {
        const res: JSONRPCSuccess<ChatMessage[]> = { jsonrpc: '2.0', result: getRecent(), id: req.id! };
        return socket.emit(SOCKET_EVENTS.RESPONSE, res);
      }
      default:
        return socket.emit(SOCKET_EVENTS.RESPONSE, error(req.id, CODES.METHOD_NOT_FOUND, 'Method not found'));
    }
  } catch (e: any) {
    return socket.emit(SOCKET_EVENTS.RESPONSE, error(req?.id, CODES.INTERNAL_ERROR, 'Internal error', e?.message));
  }
}
