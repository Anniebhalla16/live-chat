import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { useEffect } from 'react';
import { connectSocket, listRecent } from '../redux/features/connectionSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

// TODO: three js animation
export default function ChatBox() {
  const dispatch = useAppDispatch();
  const status = useAppSelector<string>((s) => s.connection.status);

  useEffect(() => {
    (async () => {
      if (status === 'idle') {
        await dispatch(connectSocket());
        await dispatch(listRecent({ limit: 50 }));
      }
    })();
  }, [status, dispatch]);

  return (
    <Card
      elevation={3}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
      className="bg-orange-50"
    >
      <CardHeader title="Live Chat" />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            height: 520,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            position: 'relative',
          }}
        >
          <MessageList />
          <MessageInput />
        </Box>
      </CardContent>
    </Card>
  );
}
