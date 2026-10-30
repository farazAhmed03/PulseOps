import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a prompt title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description'],
      trim: true,
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    prompt: {
      type: String,
      required: [true, 'Please provide the prompt content'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'DevOps & Cloud',
        'Software Development',
        'System Architecture',
        'AI Art & Midjourney',
        'Writing & Copywriting',
        'Data & Analytics',
        'General Productivity',
      ],
      default: 'Software Development',
    },
    targetModel: {
      type: String,
      required: true,
      enum: ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'General / Any LLM'],
      default: 'General / Any LLM',
    },
    tags: {
      type: [String],
      default: [],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    author: {
      type: String,
      default: 'Anonymous Engineer',
    },
    copies: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing
promptSchema.index({ title: 'text', description: 'text', prompt: 'text', tags: 'text' });

export default mongoose.model('Prompt', promptSchema);
