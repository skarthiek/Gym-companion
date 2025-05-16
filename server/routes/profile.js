import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Get current user profile
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Profile retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/', async (req, res) => {
  try {
    const { username, email, age, gender, height, weight } = req.body;
    
    // Find user to update
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if username or email already exists if being changed
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      user.username = username;
    }
    
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email;
    }
    
    // Update other fields
    if (age !== undefined) user.age = age;
    if (gender) user.gender = gender;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    
    await user.save();
    
    res.json({ 
      message: 'Profile updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user profile
router.delete('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await User.findByIdAndDelete(req.user.id);
    
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Profile deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;