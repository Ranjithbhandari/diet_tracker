import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    age: {
      type: Number,
      min: 1,
      max: 150,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
    },
    height: {
      type: Number,
      min: 50,
      max: 300,
    },
    weight: {
      type: Number,
      min: 20,
      max: 500,
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    },
    goal: {
      type: String,
      enum: ['lose', 'maintain', 'gain'],
    },
    dietType: {
      type: String,
      enum: ['balanced', 'low_carb', 'high_protein', 'keto'],
    },
    calorieTarget: {
      type: Number,
      min: 500,
      max: 10000,
    },
    customCalorieTarget: {
      type: Number,
      min: 500,
      max: 10000,
    },
    useCustomTarget: {
      type: Boolean,
      default: false,
    },
    bmr: {
      type: Number,
      min: 500,
      max: 5000,
    },
    tdee: {
      type: Number,
      min: 500,
      max: 10000,
    },
    macros: {
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
