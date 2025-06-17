// Participant events: mute, raise hand, etc.
export function handleParticipantEvents(io, socket) {
  socket.on('mute-toggle', ({ roomId, userId, muted }) => {
    io.to(roomId).emit('mute-toggle', { userId, muted });
  });
  socket.on('camera-toggle', ({ roomId, userId, enabled }) => {
    io.to(roomId).emit('camera-toggle', { userId, enabled });
  });
  socket.on('raise-hand', ({ roomId, userId }) => {
    io.to(roomId).emit('raise-hand', { userId });
  });
  socket.on('lower-hand', ({ roomId, userId }) => {
    io.to(roomId).emit('lower-hand', { userId });
  });
  socket.on('screen-share', ({ roomId, userId, sharing }) => {
    io.to(roomId).emit('screen-share', { userId, sharing });
  });
}
