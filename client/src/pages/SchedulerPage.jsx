import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  TextField,
  Stack,
  Divider,
  IconButton,
  Fade,
  Avatar,
  Tooltip
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LinkIcon from '@mui/icons-material/Link';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';

const API = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default function SchedulerPage() {
  const { token, user } = useContext(AuthContext);
  const [meetingLink, setMeetingLink] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [joinInput, setJoinInput] = useState('');
  const navigate = useNavigate();

  const handleCreateLater = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/meeting/create`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMeetingLink(window.location.origin + '/meeting/' + res.data.roomId);
      setShowLink(true);
      setModalOpen(false);
    } catch {
      setMeetingLink('Error creating meeting');
      setShowLink(true);
    }
    setLoading(false);
  };

  const handleInstant = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API}/api/meeting/create`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalOpen(false);
      navigate(`/meeting/${res.data.roomId}`);
    } catch {
      alert('Failed to start meeting');
    }
    setLoading(false);
  };

  const handleCalendar = () => {
    window.open('https://calendar.google.com/calendar/u/0/r/eventedit', '_blank');
    setModalOpen(false);
  };

  const handleJoin = () => {
    const trimmed = joinInput.trim();
    if (!trimmed) return;
    try {
      let code = trimmed;
      if (trimmed.startsWith('http')) {
        const url = new URL(trimmed);
        const parts = url.pathname.split('/');
        const idx = parts.findIndex(p => p === 'meeting');
        if (idx !== -1 && parts[idx + 1]) {
          code = parts[idx + 1];
        } else {
          alert('Invalid meeting link');
          return;
        }
      }
      navigate(`/meeting/${code}`);
    } catch {
      alert('Invalid code or link');
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Card elevation={16} sx={{
        maxWidth: 540,
        width: '100%',
        borderRadius: 6,
        p: 0,
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.65)',
        bgcolor: 'background.paper',
        overflow: 'visible',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 }, width: '100%' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, boxShadow: 2 }}>
              <VideocamIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                mEETuo Scheduler
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Video calls and meetings for everyone
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Connect, collaborate, and celebrate from anywhere with mEETuo
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => setModalOpen(true)}
              sx={{ borderRadius: 4, minWidth: 180, fontWeight: 600, boxShadow: 2 }}
              disabled={loading}
            >
              New meeting
            </Button>
            <TextField
              variant="outlined"
              size="large"
              placeholder="Enter a code or link"
              value={joinInput}
              onChange={e => setJoinInput(e.target.value)}
              sx={{ flex: 1, minWidth: 180, bgcolor: 'background.paper', borderRadius: 2 }}
              InputProps={{
                endAdornment: (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleJoin}
                    disabled={!joinInput.trim()}
                    sx={{ borderRadius: 2, ml: 1 }}
                  >
                    Join
                  </Button>
                )
              }}
            />
          </Stack>
        </CardContent>
      </Card>
      {/* Modal for meeting options */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} closeAfterTransition>
        <Fade in={modalOpen}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', borderRadius: 6, boxShadow: 24, p: 4, minWidth: 340, minHeight: 240 }}>
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700} color="primary.main">Start or schedule a meeting</Typography>
              <Divider />
              <Button
                startIcon={<LinkIcon />}
                onClick={handleCreateLater}
                disabled={loading}
                variant="outlined"
                sx={{ borderRadius: 3, fontWeight: 600 }}
              >
                Create a meeting for later
              </Button>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleInstant}
                disabled={loading}
                variant="outlined"
                sx={{ borderRadius: 3, fontWeight: 600 }}
              >
                Start an instant meeting
              </Button>
              <Button
                startIcon={<CalendarMonthIcon />}
                onClick={handleCalendar}
                variant="outlined"
                sx={{ borderRadius: 3, fontWeight: 600 }}
              >
                Schedule in Google Calendar
              </Button>
              <IconButton onClick={() => setModalOpen(false)} sx={{ position: 'absolute', top: 8, right: 8 }}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      {/* Modal for meeting link */}
      <Modal open={showLink} onClose={() => setShowLink(false)} closeAfterTransition>
        <Fade in={showLink}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', borderRadius: 6, boxShadow: 24, p: 4, minWidth: 340 }}>
            <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 2 }}>Meeting link</Typography>
            <Typography variant="body1" color="secondary" sx={{ mb: 3, wordBreak: 'break-all' }}>{meetingLink}</Typography>
            <Button variant="contained" color="primary" onClick={() => setShowLink(false)} sx={{ borderRadius: 3 }}>
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
