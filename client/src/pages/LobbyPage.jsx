import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, Card, CardContent, Typography, CircularProgress, Fade, Avatar } from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const API = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default function LobbyPage() {
  const { roomId } = useParams();
  const { user, token } = useContext(AuthContext);
  const [status, setStatus] = useState('Waiting for host to admit you...');
  const navigate = useNavigate();

  useEffect(() => {
    const join = async () => {
      // If user is host, skip waiting room and go to meeting
      if (user?.role === 'host') {
        navigate(`/meeting/${roomId}`);
        return;
      }
      await axios.post(`${API}/api/meeting/join`, { roomId, userId: user?.id }, { headers: { Authorization: `Bearer ${token}` } });
    };
    join();
    // Simulate polling or use socket for real-time admit
    const interval = setInterval(async () => {
      // In production, use socket.io for real-time admit
      // Here, poll for demo
      const res = await axios.get(`${API}/api/meeting/${roomId}`);
      if (res.data?.participants?.includes(user?.id)) {
        clearInterval(interval);
        navigate(`/meeting/${roomId}`);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [roomId, user, token, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Fade in timeout={800}>
        <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.65)', p: 3, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CardContent sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72, mb: 2, boxShadow: 3 }}>
              <MeetingRoomIcon color="inherit" sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={700} gutterBottom sx={{ color: 'text.primary', mb: 1 }}>
              Lobby
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>{status}</Typography>
            <CircularProgress color="primary" />
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
}
