import React, { useEffect, useRef, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';
import VideoGrid from '../components/VideoGrid';
import Chat from '../components/Chat';
import ControlBar from '../components/ControlBar';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const API = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export default function MeetingPage() {
  const { roomId } = useParams();
  const { user } = useContext(AuthContext);
  const [participants, setParticipants] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [raisedHands, setRaisedHands] = useState([]);
  const socketRef = useRef();
  const peersRef = useRef({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    socketRef.current = io(API);
    socketRef.current.emit('join-room', { roomId, userId: user.id });
    socketRef.current.on('user-joined', ({ userId, socketId }) => {
      // WebRTC offer/answer logic here
    });
    socketRef.current.on('user-left', ({ userId }) => {
      setParticipants(prev => prev.filter(p => p.id !== userId));
    });
    socketRef.current.on('chat-message', msg => setMessages(msgs => [...msgs, msg]));
    socketRef.current.on('raise-hand', ({ userId }) => {
      setRaisedHands(prev => prev.includes(userId) ? prev : [...prev, userId]);
    });
    socketRef.current.on('lower-hand', ({ userId }) => {
      setRaisedHands(prev => prev.filter(id => id !== userId));
    });
    // ...other socket events
    return () => {
      socketRef.current.emit('leave-room', { roomId, userId: user.id });
      socketRef.current.disconnect();
    };
  }, [roomId, user.id]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (err) {
        alert('Could not access camera/mic');
      }
    };
    getMedia();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', bgcolor: 'background.default' }}>
        <VideoGrid
          localStream={localStream}
          remoteStreams={remoteStreams}
          participants={participants}
          raisedHands={raisedHands}
        />
        <Drawer
          anchor={isMobile ? 'bottom' : 'right'}
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          PaperProps={{ sx: { width: isMobile ? '100%' : 400, height: isMobile ? 350 : '100%', borderRadius: isMobile ? '6px 6px 0 0' : '6px 0 0 6px', bgcolor: 'background.paper', boxShadow: 10 } }}
        >
          <Chat
            messages={messages}
            onSend={msg =>
              socketRef.current.emit('chat-message', {
                roomId,
                message: msg,
                user
              })
            }
          />
        </Drawer>
      </Box>
      <ControlBar
        onToggleChat={() => setChatOpen(c => !c)}
        localStream={localStream}
        socket={socketRef.current}
        roomId={roomId}
        user={user}
        raisedHands={raisedHands}
        onHandChange={isRaised => {
          if (isRaised) setRaisedHands(prev => prev.includes(user.id) ? prev : [...prev, user.id]);
          else setRaisedHands(prev => prev.filter(id => id !== user.id));
        }}
        meetingLink={window.location.href}
      />
    </Box>
  );
}
