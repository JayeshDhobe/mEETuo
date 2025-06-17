import React, { useState, useRef, useEffect, useContext } from 'react';
import { Box, Paper, Typography, TextField, IconButton, InputAdornment, Divider, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { AuthContext } from '../context/AuthContext';

export default function Chat({ messages, onSend }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = e => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <Paper elevation={8} sx={{ width: 400, height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 6, background: 'background.paper', boxShadow: 6, p: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: '#fff', borderRadius: '6px 6px 0 0', boxShadow: 2 }}>
        <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight={700}>Chat</Typography>
      </Box>
      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, bgcolor: 'transparent' }}>
        {messages.map((msg, i) => {
          const isOwn = user && msg.user && msg.user.id === user.id;
          return (
            <Box key={i} sx={{
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              flexDirection: isOwn ? 'row-reverse' : 'row',
              justifyContent: isOwn ? 'flex-end' : 'flex-start',
            }}>
              <Avatar sx={{ bgcolor: isOwn ? 'primary.main' : 'secondary.main', width: 32, height: 32, ml: isOwn ? 1 : 0, mr: isOwn ? 0 : 1, boxShadow: 1 }}>
                {msg.user?.name ? msg.user.name[0] : 'U'}
              </Avatar>
              <Box sx={{
                bgcolor: isOwn ? 'primary.light' : 'grey.900',
                color: isOwn ? 'primary.contrastText' : 'text.primary',
                px: 2,
                py: 1,
                borderRadius: 3,
                maxWidth: '70%',
                boxShadow: 1,
                ml: isOwn ? 0 : 1,
                mr: isOwn ? 1 : 0,
              }}>
                <Typography variant="subtitle2" fontWeight={700} color={isOwn ? 'primary.main' : 'secondary.main'} sx={{ mb: 0.5 }}>
                  {msg.user?.name || 'User'}
                </Typography>
                <Typography variant="body2">{msg.message}</Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
      <Divider />
      <Box component="form" onSubmit={handleSend} sx={{ p: 2, display: 'flex', alignItems: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', borderRadius: '0 0 6px 6px' }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" color="primary" disabled={!input.trim()}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Paper>
  );
}
