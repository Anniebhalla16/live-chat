import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import { Fragment, useEffect, useRef } from 'react';
import type { ChatMessage } from '../redux/features/messagesSlice';
import { useAppSelector } from '../redux/hooks';

export default function MessageList() {
  const messages = useAppSelector<ChatMessage[]>((s) => s.messages.items);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <Box
      ref={listRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        p: 1,
        bgcolor: 'background.paper',
      }}
    >
      {messages.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No messages yet. Say hi!
        </Typography>
      ) : (
        <List dense disablePadding>
          {messages.map((m, idx) => {
            return (
              <Fragment key={m.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2">
                        {m.author} •{' '}
                        {new Date(m.ts).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body1">{m.text}</Typography>
                    }
                  />
                </ListItem>
                {idx < messages.length - 1 && <Divider component="li" />}
              </Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
}
