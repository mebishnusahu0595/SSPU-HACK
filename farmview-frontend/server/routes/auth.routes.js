const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Farmer = require('../models/Farmer.model');
const { generateToken } = require('../middleware/auth.middleware');

// @route   POST /api/auth/signup
// @desc    Register a new farmer
// @access  Public
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('mobile').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit mobile number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, mobile, password, preferredLanguage } = req.body;

    // Check if farmer already exists
    const existingFarmer = await Farmer.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingFarmer) {
      if (existingFarmer.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered. Please login or use different email.'
        });
      }
      if (existingFarmer.mobile === mobile) {
        return res.status(400).json({
          success: false,
          message: 'Mobile number already registered. Please login or use different number.'
        });
      }
    }

    // Create new farmer
    const farmer = await Farmer.create({
      name,
      email,
      mobile,
      password,
      preferredLanguage: preferredLanguage || 'en'
    });

    // Generate JWT token
    const token = generateToken(farmer._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FarmView AI.',
      data: {
        farmerId: farmer.farmerId,
        name: farmer.name,
        email: farmer.email,
        mobile: farmer.mobile,
        preferredLanguage: farmer.preferredLanguage,
        token
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login farmer
// @access  Public
router.post('/login', [
  body('identifier').notEmpty().withMessage('Email or mobile number is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { identifier, password } = req.body;

    // Find farmer by email or mobile
    const farmer = await Farmer.findOne({
      $or: [
        { email: identifier },
        { mobile: identifier }
      ]
    }).select('+password');

    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/mobile and password.'
      });
    }

    // Check if account is active
    if (!farmer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordMatch = await farmer.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your email/mobile and password.'
      });
    }

    // Update last login
    await farmer.updateLastLogin();

    // Generate JWT token
    const token = generateToken(farmer._id);

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      data: {
        farmerId: farmer.farmerId,
        name: farmer.name,
        email: farmer.email,
        mobile: farmer.mobile,
        preferredLanguage: farmer.preferredLanguage,
        profilePicture: farmer.profilePicture,
        token
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: error.message
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const farmer = await Farmer.findById(decoded.id).select('-password');

    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        farmerId: farmer.farmerId,
        name: farmer.name,
        email: farmer.email,
        mobile: farmer.mobile,
        preferredLanguage: farmer.preferredLanguage
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

module.exports = router;
