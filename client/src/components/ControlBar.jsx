import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Tooltip, Paper, Fade, Badge } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined';
import ChatIcon from '@mui/icons-material/Chat';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CallEndIcon from '@mui/icons-material/CallEnd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export default function ControlBar({ onToggleChat, localStream, socket, roomId, user, raisedHands = [], onHandChange, meetingLink }) {
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [screen, setScreen] = useState(false);
  const [hand, setHand] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // Sync hand state if raisedHands prop changes (for validation)
  useEffect(() => {
    if (raisedHands && user && raisedHands.includes(user.id)) {
      setHand(true);
    } else {
      setHand(false);
    }
  }, [raisedHands, user]);

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !mic));
      setMic(m => !m);
      socket.emit('mute-toggle', { roomId, userId: user.id, muted: !mic });
    }
  };
  const toggleCam = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => (track.enabled = !cam));
      setCam(c => !c);
      socket.emit('camera-toggle', { roomId, userId: user.id, enabled: !cam });
    }
  };
  const toggleScreen = async () => {
    if (!screen) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreen(true);
        socket.emit('screen-share', { roomId, userId: user.id, sharing: true });
      } catch { }
    } else {
      setScreen(false);
      socket.emit('screen-share', { roomId, userId: user.id, sharing: false });
    }
  };
  const toggleHand = () => {
    if (!hand) {
      setHand(true);
      socket.emit('raise-hand', { roomId, userId: user.id });
      if (onHandChange) onHandChange(true);
    } else {
      setHand(false);
      socket.emit('lower-hand', { roomId, userId: user.id });
      if (onHandChange) onHandChange(false);
    }
  };
  const startRecording = () => {
    if (localStream) {
      const mediaRecorder = new window.MediaRecorder(localStream, { mimeType: 'video/webm;codecs=vp9' });
      setRecorder(mediaRecorder);
      setRecordedChunks([]);
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]);
      };
      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `meeting-${roomId}.webm`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        const formData = new FormData();
        formData.append('file', blob);
        try {
          await axios.post('/api/record/upload', formData);
        } catch { }
      };
      mediaRecorder.start();
      setRecording(true);
    }
  };
  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }
  };
  const handleEndMeeting = () => {
    if (socket && socket.disconnect) {
      socket.disconnect();
    }
    navigate('/schedule');
  };
  const handleInvite = () => {
    setInviteOpen(true);
    setCopied(false);
  };
  const handleCloseInvite = () => setInviteOpen(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
  };

  return (
    <Fade in timeout={600}>
      <Paper elevation={10} sx={{
        width: '100%',
        background: 'background.paper',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 2,
        px: 2,
        borderRadius: 6,
        gap: 2,
        boxShadow: 8,
        border: '1px solid #23262f',
      }}>
        <Tooltip title={mic ? 'Mute Mic' : 'Unmute Mic'}>
          <IconButton onClick={toggleMic} color={mic ? 'primary' : 'error'} size="large" sx={{ bgcolor: mic ? 'primary.dark' : 'error.dark', color: '#fff', boxShadow: 1, '&:hover': { bgcolor: mic ? 'primary.main' : 'error.main' } }}>
            {mic ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={cam ? 'Turn Off Camera' : 'Turn On Camera'}>
          <IconButton onClick={toggleCam} color={cam ? 'primary' : 'error'} size="large" sx={{ bgcolor: cam ? 'primary.dark' : 'error.dark', color: '#fff', boxShadow: 1, '&:hover': { bgcolor: cam ? 'primary.main' : 'error.main' } }}>
            {cam ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title={screen ? 'Stop Sharing' : 'Share Screen'}>
          <IconButton onClick={toggleScreen} color={screen ? 'secondary' : 'default'} size="large" sx={{ bgcolor: screen ? 'secondary.dark' : 'background.paper', color: screen ? '#fff' : 'text.primary', boxShadow: 1, '&:hover': { bgcolor: screen ? 'secondary.main' : 'background.paper' } }}>
            {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
          </IconButton>
        </Tooltip>
        {/* Hand Raise Button with Badge */}
        <Tooltip title={hand ? 'Lower Hand' : 'Raise Hand'}>
          <span>
            <Badge
              color="warning"
              variant={hand ? 'dot' : undefined}
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <IconButton onClick={toggleHand} color={hand ? 'warning' : 'default'} size="large" sx={{ bgcolor: hand ? 'warning.dark' : 'background.paper', color: hand ? '#fff' : 'text.primary', boxShadow: 1, '&:hover': { bgcolor: hand ? 'warning.main' : 'background.paper' } }}>
                {hand ? <PanToolAltIcon /> : <PanToolOutlinedIcon />}
              </IconButton>
            </Badge>
          </span>
        </Tooltip>
        <Tooltip title="Open Chat">
          <IconButton onClick={onToggleChat} color="info" size="large" sx={{ bgcolor: 'info.dark', color: '#fff', boxShadow: 1, '&:hover': { bgcolor: 'info.main' } }}>
            <ChatIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Invite People">
          <IconButton onClick={handleInvite} color="success" size="large" sx={{ bgcolor: 'success.dark', color: '#fff', boxShadow: 1, '&:hover': { bgcolor: 'success.main' } }}>
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="End Meeting">
          <IconButton onClick={handleEndMeeting} color="error" size="large" sx={{ bgcolor: 'error.dark', color: '#fff', boxShadow: 1, '&:hover': { bgcolor: 'error.main' } }}>
            <CallEndIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={recording ? 'Stop Recording' : 'Start Recording'}>
          <IconButton onClick={recording ? stopRecording : startRecording} color={recording ? 'warning' : 'default'} size="large" sx={{ bgcolor: recording ? 'warning.dark' : 'background.paper', color: recording ? '#fff' : 'text.primary', boxShadow: 1, '&:hover': { bgcolor: recording ? 'warning.main' : 'background.paper' } }}>
            {recording ? <StopCircleIcon /> : <FiberManualRecordIcon />}
          </IconButton>
        </Tooltip>
        <Dialog open={inviteOpen} onClose={handleCloseInvite}>
          <DialogTitle>Invite People</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ wordBreak: 'break-all' }}>{meetingLink}</span>
              <IconButton onClick={handleCopy} color="primary" size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
            {copied && <span style={{ color: 'green', fontSize: 12 }}>Copied!</span>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseInvite}>Close</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Fade>
  );
}
