import mongoose from 'mongoose';

// Check if model is already defined to prevent overwrite
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  image: {
    type: String,
  },
  bio: {
    type: String,
    default: '',
  },
  supabaseId: {
    type: String,
    required: true,
    unique: true,
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema); 