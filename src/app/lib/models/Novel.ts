import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
  },
  content: {
    type: String,
    required: [true, 'Chapter content is required'],
  },
  order: {
    type: Number,
    required: true,
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

const NovelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  synopsis: {
    type: String,
    required: [true, 'Synopsis is required'],
  },
  coverImage: {
    type: String,
    default: '/images/default-cover.jpg',
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    enum: ['Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror', 'Thriller', 'Adventure', 'Historical', 'Other'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  chapters: [ChapterSchema],
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'hiatus'],
    default: 'ongoing',
  },
  tags: [{
    type: String,
  }],
  views: {
    type: Number,
    default: 0,
  },
  likes: {
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

export default mongoose.models.Novel || mongoose.model('Novel', NovelSchema); 