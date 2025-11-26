import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    activityType: {
      type: String,
      required: [true, 'Please provide an activity type'],
      enum: [
        'walking',
        'running',
        'cycling',
        'gym',
        'yoga',
        'swimming',
        'sports',
        'dancing',
        'hiking',
        'other'
      ],
    },
    duration: {
      type: Number,
      required: [true, 'Please provide duration in minutes'],
      min: 1,
      max: 1440, // 24 hours max
    },
    intensity: {
      type: String,
      required: [true, 'Please provide intensity level'],
      enum: ['low', 'moderate', 'high'],
    },
    caloriesBurned: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
activitySchema.index({ userId: 1, date: -1 });

export default mongoose.model('Activity', activitySchema);