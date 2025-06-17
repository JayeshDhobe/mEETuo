import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Not required for guests
  role: { type: String, enum: ['host', 'cohost', 'participant', 'guest'], default: 'participant' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
