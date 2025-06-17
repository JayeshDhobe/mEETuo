import React from 'react';
import { Box, Typography, Avatar, Paper } from '@mui/material';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';

export default function VideoGrid({ localStream, remoteStreams, participants, raisedHands = [] }) {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
      gap: 3,
      width: '100%',
      height: '100%',
      p: 4,
      background: '#181A20', // true dark background
      alignItems: 'center',
      justifyItems: 'center',
      minHeight: '100vh',
      transition: 'background 0.3s',
    }}>
      {localStream && (
        <VideoTile stream={localStream} name="You" color="#2563eb" handRaised={raisedHands.includes('local') || raisedHands.includes(participants[0]?.id)} isLocal={true} />
      )}
      {remoteStreams.map((stream, i) => (
        <VideoTile
          key={i}
          stream={stream}
          name={participants[i]?.name || 'Participant'}
          color="#6366f1"
          handRaised={raisedHands.includes(participants[i]?.id)}
          isLocal={false}
        />
      ))}
    </Box>
  );
}

function VideoTile({ stream, name, color, handRaised, isLocal }) {
  const videoRef = React.useRef();
  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <Paper elevation={8} sx={{
      position: 'relative',
      borderRadius: 6,
      overflow: 'hidden',
      width: 340,
      height: 240,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#23272F',
      border: '1.5px solid #23272F',
      boxShadow: '0 6px 32px 0 rgba(0,0,0,0.55)',
      transition: 'box-shadow 0.2s, border 0.2s',
      '&:hover': {
        boxShadow: '0 8px 40px 0 rgba(0,0,0,0.75)',
        border: `1.5px solid ${color}`,
      },
    }}>
      <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, background: '#111', transform: isLocal ? 'none' : undefined }} />
      {/* Hand raise icon overlay */}
      {handRaised && (
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2, bgcolor: '#23272F', borderRadius: '50%', p: 0.7, boxShadow: 3, border: '2px solid #facc15' }}>
          <PanToolAltIcon sx={{ color: '#facc15' }} fontSize="medium" />
        </Box>
      )}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        bgcolor: 'rgba(24,26,32,0.92)',
        color: '#fff',
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        borderRadius: '0 0 12px 12px',
        opacity: 0.98,
        boxShadow: '0 -2px 8px 0 rgba(0,0,0,0.25)',
        borderTop: '1px solid #23272F',
      }}>
        <Avatar sx={{ width: 28, height: 28, bgcolor: color, fontSize: 15, mr: 1, color: '#fff', fontWeight: 700 }}>{name[0]}</Avatar>
        <Typography variant="body2" fontWeight={600} sx={{ letterSpacing: 0.2 }}>{name}</Typography>
      </Box>
    </Paper>
  );
}
