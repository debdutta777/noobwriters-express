import mongoose from 'mongoose';

const WritingPromptSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Prompt title is required'],
  },
  content: {
    type: String,
    required: [true, 'Prompt content is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Character Development', 'Plot Twist', 'Setting Description', 'Dialogue', 'World Building', 'Conflict', 'Theme', 'Other'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  uses: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.WritingPrompt || mongoose.model('WritingPrompt', WritingPromptSchema); 