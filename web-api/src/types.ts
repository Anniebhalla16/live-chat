export type JSONRPCId = string | number | null;

export const METHOD  = {
  SEND_MESSAGE:'sendMessage',
  LIST_RECENT:'listRecent',
} as const;


export interface JSONRPCRequest {
  jsonrpc: '2.0';
  method: typeof METHOD[keyof typeof METHOD];
  params?: unknown;
  id?: JSONRPCId;
}

export interface JSONRPCSuccess<T = unknown>  {
  jsonrpc: '2.0';
  id: JSONRPCId;
  result: T;
}

export interface JSONRPCError {
  jsonrpc: '2.0';
  id: JSONRPCId;
  error: { code: number; message: string; data?: unknown };
}

export type JSONRPCResponse = JSONRPCSuccess | JSONRPCError;

export type ChatMessage = {
  id: string;
  author: string;
  text: string;
  ts: number;   
};

export interface SendMessageParams {
  text: string;
  author: string;
}

export const CODES = {
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603
} as const;

export const SOCKET_EVENTS = {
    REQUEST : "rpc/request",
    RESPONSE: 'rpc/response',
    NOTIFY : 'rpc/notify'
}