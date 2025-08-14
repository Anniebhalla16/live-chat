import { configureStore } from '@reduxjs/toolkit';
import connection from "./features/connectionSlice";
import messages from "./features/messagesSlice";


export const store = configureStore({
  reducer: {
    messages, connection
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;