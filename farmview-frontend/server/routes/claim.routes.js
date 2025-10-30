/**
 * Insurance Claim Routes
 * Automated GeoAI-powered claim processing
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const insuranceClaimService = require('../services/insuranceClaimService');

/**
 * @route   GET /api/claims/test
 * @desc    Test endpoint to verify claims route is working
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Claims API is working! Use POST /api/claims/file to submit a claim.',
    endpoints: {
      fileClaim: 'POST /api/claims/file',
      checkEligibility: 'GET /api/claims/eligibility/:propertyId',
      getStatus: 'GET /api/claims/status/:claimId'
    }
  });
});

/**
 * @route   POST /api/claims/file
 * @desc    File insurance claim with GeoAI evidence
 * @access  Private (Farmer only)
 */
router.post('/file', protect, async (req, res) => {
  try {
    const { propertyId, claimedDamagePercent, reason, description } = req.body;
    
    if (!propertyId || !claimedDamagePercent || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Property ID, damage percentage, and reason are required'
      });
    }
    
    console.log(`📋 Filing claim for property: ${propertyId}`);
    
    const claimDetails = {
      farmerId: req.farmer._id,
      claimedDamagePercent: parseInt(claimedDamagePercent),
      reason: reason,
      description: description || ''
    };
    
    // Initiate automated claim process
    const result = await insuranceClaimService.initiateClaim(
      propertyId,
      req.farmer._id,
      claimDetails
    );
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(200).json({
      success: true,
      message: 'Claim processed successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error filing claim:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to file claim',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/claims/status/:claimId
 * @desc    Get claim status
 * @access  Private
 */
router.get('/status/:claimId', protect, async (req, res) => {
  try {
    const { claimId } = req.params;
    
    const status = await insuranceClaimService.getClaimStatus(claimId);
    
    res.status(200).json({
      success: true,
      data: status
    });
    
  } catch (error) {
    console.error('Error fetching claim status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch claim status',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/claims/eligibility/:propertyId
 * @desc    Check if property is eligible for claim
 * @access  Private
 */
router.get('/eligibility/:propertyId', protect, async (req, res) => {
  try {
    const { propertyId } = req.params;
    const Property = require('../models/Property.model');
    const Insurance = require('../models/Insurance.model');
    
    const property = await Property.findById(propertyId);
    if (!property || property.farmer.toString() !== req.farmer._id.toString()) {
      return res.status(404).json({
        success: false,
        eligible: false,
        message: 'Property not found or unauthorized'
      });
    }
    
    const insurance = await Insurance.findOne({
      property: propertyId,
      status: 'Active',
      endDate: { $gte: new Date() }
    });
    
    if (!insurance) {
      return res.status(200).json({
        success: true,
        eligible: false,
        message: 'कोई सक्रिय बीमा पॉलिसी नहीं है। (No active insurance policy)',
        recommendation: 'कृपया पहले बीमा खरीदें। (Please purchase insurance first)'
      });
    }
    
    res.status(200).json({
      success: true,
      eligible: true,
      message: 'आप दावा करने के लिए पात्र हैं। (You are eligible to file a claim)',
      policyDetails: {
        policyNumber: insurance.policyNumber,
        coverageAmount: insurance.sumInsured,
        validUntil: insurance.endDate
      }
    });
    
  } catch (error) {
    console.error('Error checking eligibility:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility',
      error: error.message
    });
  }
});

module.exports = router;
