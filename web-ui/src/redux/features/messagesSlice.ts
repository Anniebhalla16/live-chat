import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type ChatMessage = { id: string; author: string; text: string; ts: number };
export type MessagesState = { items: ChatMessage[]; sendCount: number };

const initialState: MessagesState = {
  items: [{ id: nanoid(), author: 'System', text: 'Welcome! Type a message below.', ts: Date.now() }],
  sendCount: 0,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    messageReceived(state, action: PayloadAction<ChatMessage>) {
      const msg = action.payload;
      if (!state.items.some((m) => m.id === msg.id)) {
        state.items.push(msg);
        if (state.items.length > 200) state.items.shift();
        state.sendCount += 1; 
      }
    },
    setHistory(state, action: PayloadAction<ChatMessage[]>) {
      state.items = action.payload.slice(-200);
    },
  },
});

export const { messageReceived, setHistory } = messagesSlice.actions;
export default messagesSlice.reducer;
