import express from 'express';
import mongoose from 'mongoose';
import Meal from '../models/Meal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/meals
// @desc    Create a meal entry
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { mealType, foodName, calories, protein, carbs, fat } = req.body;

    // Validation
    if (!mealType || !foodName || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create meal
    const meal = await Meal.create({
      userId: req.user.id,
      date: new Date(),
      mealType,
      foodName,
      calories,
      protein,
      carbs,
      fat,
    });

    res.status(201).json({
      success: true,
      meal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   GET /api/meals/today
// @desc    Get today's meals
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const meals = await Meal.find({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow },
    }).sort({ createdAt: 1 });

    // Calculate totals
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    res.status(200).json({
      success: true,
      meals,
      totals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   DELETE /api/meals/:id
// @desc    Delete a meal entry
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal not found',
      });
    }

    // Check if user owns the meal
    if (meal.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this meal',
      });
    }

    await Meal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Meal deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   GET /api/meals/history
// @desc    Get meal history (last 7-10 days)
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    tenDaysAgo.setHours(0, 0, 0, 0);

    const meals = await Meal.aggregate([
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
          date: { $first: '$date' },
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' },
          mealCount: { $sum: 1 },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]);

    // Add compliance status and target info
    const userTarget = req.user.calorieTarget || 2000;
    const historyWithStatus = meals.map(day => {
      const difference = Math.abs(day.totalCalories - userTarget);
      const percentageDiff = (difference / userTarget) * 100;
      
      let status;
      if (percentageDiff <= 10) {
        status = 'on-track';
      } else if (day.totalCalories > userTarget) {
        status = 'over';
      } else {
        status = 'under';
      }

      return {
        ...day,
        date: day._id,
        target: userTarget,
        status,
        difference: day.totalCalories - userTarget,
      };
    });

    res.status(200).json({
      success: true,
      history: historyWithStatus,
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

export default router;
