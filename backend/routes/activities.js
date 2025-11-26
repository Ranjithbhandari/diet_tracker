import express from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// MET values for different activities (calories per kg per hour)
const MET_VALUES = {
  walking: { low: 2.5, moderate: 3.5, high: 4.5 },
  running: { low: 6.0, moderate: 8.0, high: 11.0 },
  cycling: { low: 4.0, moderate: 6.8, high: 10.0 },
  gym: { low: 3.0, moderate: 5.0, high: 8.0 },
  yoga: { low: 2.5, moderate: 3.0, high: 4.0 },
  swimming: { low: 4.0, moderate: 6.0, high: 10.0 },
  sports: { low: 4.0, moderate: 6.0, high: 8.0 },
  dancing: { low: 3.0, moderate: 4.5, high: 6.0 },
  hiking: { low: 4.0, moderate: 6.0, high: 8.0 },
  other: { low: 3.0, moderate: 4.0, high: 6.0 },
};

// Calculate calories burned using MET formula
const calculateCaloriesBurned = (activityType, intensity, duration, weight = 70) => {
  const met = MET_VALUES[activityType]?.[intensity] || 3.0;
  // Formula: MET × weight (kg) × time (hours)
  return Math.round(met * weight * (duration / 60));
};

// @route   POST /api/activities
// @desc    Create an activity entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { activityType, duration, intensity, notes } = req.body;

    // Validation
    if (!activityType || !duration || !intensity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide activity type, duration, and intensity',
      });
    }

    // Calculate calories burned (use user's weight if available, otherwise default to 70kg)
    const userWeight = req.user.weight || 70;
    const caloriesBurned = calculateCaloriesBurned(activityType, intensity, duration, userWeight);

    // Create activity
    const activity = await Activity.create({
      userId: req.user.id,
      date: new Date(),
      activityType,
      duration,
      intensity,
      caloriesBurned,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   GET /api/activities/today
// @desc    Get today's activities
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activities = await Activity.find({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: -1 });

    // Calculate total calories burned today
    const totalCaloriesBurned = activities.reduce((sum, activity) => sum + activity.caloriesBurned, 0);

    res.status(200).json({
      success: true,
      activities,
      totalCaloriesBurned,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete an activity entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check if user owns the activity
    if (activity.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this activity',
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Activity deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   GET /api/activities/history
// @desc    Get activity history (last 7-10 days)
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const activities = await Activity.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: tenDaysAgo, $lte: today },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalCaloriesBurned: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          activityCount: { $sum: 1 },
          activities: { $push: '$$ROOT' },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      history: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

export default router;