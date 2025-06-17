import Meeting from '../models/Meeting.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';

export const createMeeting = async (req, res) => {
  try {
    const { scheduledFor } = req.body;
    const hostId = req.user.id;
    const roomId = uuidv4();
    const meeting = await Meeting.create({
      roomId,
      host: hostId,
      cohosts: [],
      participants: [hostId],
      waitingRoom: [],
      scheduledFor
    });
    res.status(201).json({ roomId: meeting.roomId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const joinMeeting = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    // Add to waiting room by default
    if (!meeting.waitingRoom.includes(userId)) meeting.waitingRoom.push(userId);
    await meeting.save();
    res.json({ message: 'Added to waiting room' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const admitParticipant = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    // Remove from waiting room, add to participants
    meeting.waitingRoom = meeting.waitingRoom.filter(id => id.toString() !== userId);
    if (!meeting.participants.includes(userId)) meeting.participants.push(userId);
    await meeting.save();
    res.json({ message: 'Participant admitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeParticipant = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    meeting.participants = meeting.participants.filter(id => id.toString() !== userId);
    meeting.cohosts = meeting.cohosts.filter(id => id.toString() !== userId);
    await meeting.save();
    res.json({ message: 'Participant removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignCohost = async (req, res) => {
  try {
    const { roomId, userId } = req.body;
    const meeting = await Meeting.findOne({ roomId });
    if (!meeting) return res.status(404).json({ message: 'Meeting not found' });
    if (!meeting.cohosts.includes(userId)) meeting.cohosts.push(userId);
    await meeting.save();
    res.json({ message: 'Cohost assigned' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
