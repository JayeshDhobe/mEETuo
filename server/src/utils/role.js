// Role-based access control helpers
export function isHost(user) {
  return user.role === 'host';
}
export function isCohost(user) {
  return user.role === 'cohost';
}
export function isParticipant(user) {
  return user.role === 'participant';
}
export function isGuest(user) {
  return user.role === 'guest';
}
