import express from 'express';

// This is a mock endpoint for recording. In production, use cloud storage or streaming.
const router = express.Router();

// POST /api/record/upload
router.post('/upload', (req, res) => {
  // Simulate file upload (frontend will send a blob or file)
  // In a real app, save to cloud or disk
  res.status(200).json({ message: 'Recording received (mock endpoint)' });
});

export default router;
