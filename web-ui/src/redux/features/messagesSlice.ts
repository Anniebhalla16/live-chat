import { createSlice, nanoid, type PayloadAction } from '@reduxjs/toolkit';

export type ChatMessage = {
  id: string;
  author: string;
  text: string;
  ts: number;
};

export type MessagesState = {
  items: ChatMessage[];
  sendCount: number; // drives the 3D burst animation
};

const initialState: MessagesState = {
  items: [
    { id: nanoid(), author: 'System', text: 'Welcome! Type a message below.', ts: Date.now() },
  ],
  sendCount: 0,
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: {
      reducer(state, action: PayloadAction<ChatMessage>) {
        state.items.push(action.payload);
        state.sendCount += 1;
      },
      prepare(text: string, author = 'You') {
        return {
          payload: {
            id: nanoid(),
            text: text.trim(),
            author,
            ts: Date.now(),
          } as ChatMessage,
        };
      },
    },
    clearMessages(state) {
      state.items = [];
    },
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
