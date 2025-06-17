// Real-time chat handlers
export function handleChat(io, socket) {
  socket.on('chat-message', ({ roomId, message, user }) => {
    io.to(roomId).emit('chat-message', { message, user, timestamp: new Date() });
  });
}
