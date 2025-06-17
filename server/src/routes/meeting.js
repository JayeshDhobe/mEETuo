import express from 'express';
import { createMeeting, joinMeeting, admitParticipant, removeParticipant, assignCohost } from '../controllers/meetingController.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticateJWT, createMeeting);
router.post('/join', joinMeeting);
router.post('/admit', authenticateJWT, admitParticipant);
router.post('/remove', authenticateJWT, removeParticipant);
router.post('/assign-cohost', authenticateJWT, assignCohost);

export default router;
