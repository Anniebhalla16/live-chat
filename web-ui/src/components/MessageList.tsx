import { Box, List, Typography } from '@mui/material';
import { Fragment, useEffect, useMemo, useRef } from 'react';
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

  const grouped = useMemo(() => {
    const out: Array<{ msg: ChatMessage; showMeta: boolean }> = [];
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      const prev = messages[i - 1];
      const showMeta =
        !prev || prev.author !== m.author || m.ts - prev.ts > 2 * 60 * 1000;
      out.push({ msg: m, showMeta });
    }
    return out;
  }, [messages]);

  return (
    <Box
      ref={listRef}
      sx={{
        flex: 1,
        overflowY: 'auto',
        borderRadius: 1,
        border: '1px solid',
        borderColor: 'divider',
        p: 1.5,
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        gap: 0.75,
      }}
    >
      {messages.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ p: 2, textAlign: 'center' }}
        >
          No messages yet. Say hi!
        </Typography>
      ) : (
        <List
          disablePadding
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.75,
          }}
        >
          {grouped.map(({ msg, showMeta }) => {
            const time = new Date(msg.ts).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            const bubbleSx = {
              display: 'inline-block',
              px: 1.5,
              py: 1,
              maxWidth: '80%',
              borderRadius: '18px',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              wordBreak: 'break-word' as const,
              whiteSpace: 'pre-wrap' as const,
              // notch effect by sharpening one corner
              borderTopRightRadius: '18px',
              borderTopLeftRadius: '6px',
              boxShadow: 1,
            };

            return (
              <Fragment key={msg.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    px: 0.5,
                  }}
                >
                  <Box sx={{ textAlign: 'right' }}>
                    {showMeta && (
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 0.25,
                          color: 'text.secondary',
                          display: 'block',
                        }}
                      >
                        {msg.author}
                      </Typography>
                    )}
                    <Box sx={bubbleSx}>
                      <Typography variant="body1" component="div">
                        {msg.text}
                      </Typography>
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.25,
                        color: 'text.disabled',
                        display: 'block',
                      }}
                    >
                      {time}
                    </Typography>
                  </Box>
                </Box>
              </Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
}
