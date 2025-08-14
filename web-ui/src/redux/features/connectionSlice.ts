import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { rpc } from '../../rpc/rpcClient';
import { NOTIFY_EVENTS_CLIENT } from '../../types';
import type { RootState } from '../store';
import { burstNow, messageReceived, setHistory, type ChatMessage } from './messagesSlice';

const getErr = (e: unknown) => (e instanceof Error ? e.message : typeof e === 'string' ? e : JSON.stringify(e));

type ConnectionState = {
  status: 'idle' | 'connecting' | 'connected' | 'error';
  error?: string;
  name: string;
  serverUrl: string;
};

const initialState: ConnectionState = {
  status: 'idle',
  name: 'You',
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
};


export const connectSocket = createAsyncThunk<void, void, { state: RootState; rejectValue: string }>(
  'connection/connect',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { serverUrl } = getState().connection;
    try {
      await rpc.connect(serverUrl);

      rpc.onNotify((n) => {
        if (n?.type === NOTIFY_EVENTS_CLIENT.NEW_MESSAGE && n.payload) {
          dispatch(messageReceived(n.payload as ChatMessage));
        }
      });
    } catch (e) {
      return rejectWithValue(getErr(e) || 'connect error');
    }
  }
);

export const listRecent = createAsyncThunk<void, { limit?: number }, { rejectValue: string }>(
  'connection/listRecent',
  async ({ limit = 50 } = {}, { dispatch, rejectWithValue }) => {
    try {
      const msgs = await rpc.call<ChatMessage[]>('listRecent', { limit });
      dispatch(setHistory(msgs || []));
    } catch (e) {
      return rejectWithValue(getErr(e) || 'list recent failed');
    }
  }
);

export const sendMessageRPC = createAsyncThunk<void, { text: string }, { state: RootState; rejectValue: string }>(
  'connection/sendMessage',
  async ({ text }, { getState, rejectWithValue, dispatch }) => {
    try {
      const author = getState().connection.name;
      dispatch(burstNow()); 
      await rpc.call('sendMessage', { text, author });
    } catch (e) {
      return rejectWithValue(getErr(e) || 'send failed');
    }
  }
);

const slice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setIdentity(state, action: { payload: { name?: string } }) {
      if (action.payload?.name) state.name = action.payload.name;
    },
  },
  extraReducers: (b) => {
    b.addCase(connectSocket.pending, (s) => { s.status = 'connecting'; s.error = undefined; });
    b.addCase(connectSocket.fulfilled, (s) => { s.status = 'connected'; });
    b.addCase(connectSocket.rejected, (s, a) => { s.status = 'error'; s.error = (a.payload as string) ?? a.error.message ?? 'connection error'; });
    b.addCase(listRecent.rejected, (s, a) => { s.error = (a.payload as string) ?? a.error.message ?? 'list recent failed'; });
    b.addCase(sendMessageRPC.rejected, (s, a) => { s.error = (a.payload as string) ?? a.error.message ?? 'send failed'; });
  },
});

export const { setIdentity } = slice.actions;
export default slice.reducer;
