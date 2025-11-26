import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      index: true,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: [true, 'Meal type is required'],
    },
    foodName: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
      min: [0, 'Protein cannot be negative'],
    },
    carbs: {
      type: Number,
      required: [true, 'Carbs are required'],
      min: [0, 'Carbs cannot be negative'],
    },
    fat: {
      type: Number,
      required: [true, 'Fat is required'],
      min: [0, 'Fat cannot be negative'],
    },
    foods: [{
      foodName: String,
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
      quantity: Number,
      baseCalories: Number,
      baseProtein: Number,
      baseCarbs: Number,
      baseFat: Number,
    }],
  },
  { timestamps: true }
);

// Compound index for efficient queries
mealSchema.index({ userId: 1, date: 1 });

export default mongoose.model('Meal', mealSchema);
