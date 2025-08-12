import SendIcon from '@mui/icons-material/Send';
import { IconButton, Paper, TextField } from '@mui/material';
import { useState, type KeyboardEvent } from 'react';
import { addMessage } from '../redux/features/messagesSlice';
import { useAppDispatch } from '../redux/hooks';

export default function MessageInput() {
  const dispatch = useAppDispatch();
  const [value, setValue] = useState('');

  const send = () => {
    const t = value.trim();
    if (!t) return;
    dispatch(addMessage(t));
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder="Type a message"
        multiline
        maxRows={4}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        sx={{ '& fieldset': { border: 'none' } }}
      />
      <IconButton
        color="primary"
        onClick={send}
        aria-label="send message"
        className="!bg-inherit !rounded-none"
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
