// WebRTC signaling handlers
export function handleWebRTCSignaling(io, socket) {
  socket.on('join-room', ({ roomId, userId }) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
  });

  socket.on('signal', ({ roomId, signal, to }) => {
    io.to(roomId).emit('signal', { signal, from: socket.id, to });
  });

  socket.on('leave-room', ({ roomId, userId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', { userId, socketId: socket.id });
  });
}
