import express from 'express';
import { signup, login, guest } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/guest', guest);

export default router;
