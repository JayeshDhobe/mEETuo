// Socket.io signaling and real-time handlers
import { handleWebRTCSignaling } from './webrtc.js';
import { handleChat } from './chat.js';
import { handleParticipantEvents } from './participant.js';

export function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    handleWebRTCSignaling(io, socket);
    handleChat(io, socket);
    handleParticipantEvents(io, socket);
  });
}
