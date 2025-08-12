import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Tooltip,
} from '@mui/material';
import { clearMessages } from '../redux/features/messagesSlice';
import { useAppDispatch } from '../redux/hooks';
import MessageInput from './MessageInput';
import MessageList from './MessageList';

export default function ChatBox() {
  const dispatch = useAppDispatch();
  // const sendCount = useAppSelector<number>((s) => s.messages.sendCount);

  return (
    <Card
      elevation={3}
      sx={{
        position: 'relative',
        overflow: 'hidden',
      }}
      className="bg-orange-50"
    >
      <CardHeader
        title="Live Chat"
        action={
          <Tooltip title="Clear messages">
            <IconButton
              onClick={() => dispatch(clearMessages())}
              className="!bg-red-50"
            >
              <DeleteOutlineIcon color="error" />
            </IconButton>
          </Tooltip>
        }
      />
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
          {/* 3D burst overlay (top area) */}
          {/* <ThreeBurst trigger={sendCount} /> */}

          {/* messages grow + scroll */}
          <MessageList />

          {/* input pinned at bottom */}
          <MessageInput />
        </Box>
      </CardContent>
    </Card>
  );
}
