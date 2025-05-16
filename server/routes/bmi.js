import express from 'express';

const router = express.Router();

// Diet plans based on BMI
const dietPlans = {
  underweight: {
    morning: '3 whole eggs, 4 brown bread slices with peanut butter',
    morningSnack: '50g peanuts or sprouts + 1 fruit (e.g. orange, watermelon)',
    afternoon: 'Rice + curd/dal + Chicken/Fish/Soya/Paneer',
    eveningSnack: '2 boiled eggs + dry fruit milkshake',
    dinner: '1 egg, rice or chapati + protein foods + vegetables'
  },
  normal: {
    morning: '2 whole eggs, 2 brown bread slices, 1 fruit',
    morningSnack: '25g nuts or 1 fruit',
    afternoon: 'Rice/chapati + curd/dal + protein + vegetables',
    eveningSnack: '1 protein shake or greek yogurt',
    dinner: 'Lean protein + vegetables + small portion of whole grains'
  },
  overweight: {
    morning: '2 egg whites, 1 whole egg, 1 slice whole grain bread',
    morningSnack: '1 fruit or vegetable sticks',
    afternoon: 'Grilled protein + large salad + small portion of brown rice',
    eveningSnack: 'Greek yogurt or vegetable soup',
    dinner: 'Lean protein + steamed vegetables'
  },
  obese: {
    morning: '1 whole egg + 2 egg whites, vegetable omelet',
    morningSnack: 'Cucumber/carrot sticks or small fruit',
    afternoon: 'Grilled lean protein + large salad (no rice)',
    eveningSnack: 'Protein shake with water or vegetable soup',
    dinner: 'Lean protein + steamed vegetables (no carbs)'
  }
};

// Exercise plans
const exercisePlans = {
  upperBody: [
    'Push-Ups – 3 sets x 15-20 reps',
    'Pike Push-Ups – 3 sets x 12 reps',
    'Dips (with chair) – 3 sets x 12 reps',
    'Bicep Curls – 3 sets x 12 reps',
    'Plank-to-Push-Up – 3 sets x 10 reps'
  ],
  lowerBody: [
    'Squats – 3 sets x 15 reps',
    'Lunges – 3 sets x 10 reps each leg',
    'Step-Ups – 3 sets x 12 reps',
    'Calf Raises – 3 sets x 20 reps',
    'Wall Sit – 3 rounds x 30-45 sec'
  ]
};

// Calculate BMI and get recommendations
router.post('/', async (req, res) => {
  try {
    const { height, weight } = req.body;
    
    // Validation
    if (!height || !weight) {
      return res.status(400).json({ message: 'Height and weight are required' });
    }
    
    if (height < 50 || height > 250) {
      return res.status(400).json({ message: 'Height must be between 50 and 250 cm' });
    }
    
    if (weight < 20 || weight > 300) {
      return res.status(400).json({ message: 'Weight must be between 20 and 300 kg' });
    }
    
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let category;
    let dietPlan;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      dietPlan = dietPlans.underweight;
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Normal';
      dietPlan = dietPlans.normal;
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      dietPlan = dietPlans.overweight;
    } else {
      category = 'Obese';
      dietPlan = dietPlans.obese;
    }
    
    // Create response object
    const result = {
      bmi,
      category,
      recommendations: {
        diet: dietPlan,
        exercise: exercisePlans
      }
    };
    
    res.json(result);
  } catch (error) {
    console.error('BMI calculation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;