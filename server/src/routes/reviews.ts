import express from 'express';
import { ReviewModel } from '../models/Review';
import { UserModel } from '../models/User';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Create review (customers only)
router.post('/', authenticateToken, requireRole('customer'), (req: AuthRequest, res) => {
  try {
    const { farmerId, rating, comment } = req.body;

    // Validation
    if (!farmerId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Farmer ID and rating (1-5) are required' });
    }

    // Check if farmer exists
    const farmer = UserModel.findById(farmerId);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ error: 'Farmer not found' });
    }

    const review = ReviewModel.create({
      customerId: req.user!.id,
      farmerId,
      rating: parseInt(rating),
      comment: comment || '',
    });

    // Add customer name to response
    const reviewWithCustomer = {
      ...review,
      customerName: req.user!.name,
    };

    res.status(201).json(reviewWithCustomer);
  } catch (error) {
    console.error('Create review error:', error);
    if (error instanceof Error && error.message.includes('already reviewed')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Failed to create review' });
    }
  }
});

// Get reviews for a farmer
router.get('/farmer/:farmerId', (req, res) => {
  try {
    const reviews = ReviewModel.findByFarmerId(req.params.farmerId);
    
    // Add customer names to reviews
    const reviewsWithCustomerNames = reviews.map(review => {
      const customer = UserModel.findById(review.customerId);
      return {
        ...review,
        customerName: customer?.name || 'Anonymous',
      };
    });

    res.json(reviewsWithCustomerNames);
  } catch (error) {
    console.error('Get farmer reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get reviews by current customer
router.get('/my/reviews', authenticateToken, requireRole('customer'), (req: AuthRequest, res) => {
  try {
    const reviews = ReviewModel.findByCustomerId(req.user!.id);
    
    // Add farmer names to reviews
    const reviewsWithFarmerNames = reviews.map(review => {
      const farmer = UserModel.findById(review.farmerId);
      const farmerProfile = UserModel.getFarmerProfileByUserId(review.farmerId);
      return {
        ...review,
        farmerName: farmer?.name || 'Unknown Farmer',
        farmName: farmerProfile?.farmName || 'Unknown Farm',
      };
    });

    res.json(reviewsWithFarmerNames);
  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch your reviews' });
  }
});

// Update review (customers only, own reviews)
router.put('/:reviewId', authenticateToken, requireRole('customer'), (req: AuthRequest, res) => {
  try {
    const review = ReviewModel.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.customerId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only update your own reviews' });
    }

    const { rating, comment } = req.body;

    const updatedReview = ReviewModel.update(req.params.reviewId, {
      ...(rating && { rating: parseInt(rating) }),
      ...(comment !== undefined && { comment }),
    });

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Add customer name to response
    const reviewWithCustomer = {
      ...updatedReview,
      customerName: req.user!.name,
    };

    res.json(reviewWithCustomer);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// Delete review (customers only, own reviews)
router.delete('/:reviewId', authenticateToken, requireRole('customer'), (req: AuthRequest, res) => {
  try {
    const review = ReviewModel.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.customerId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    const deleted = ReviewModel.delete(req.params.reviewId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

// Get farmer rating stats
router.get('/farmer/:farmerId/stats', (req, res) => {
  try {
    const stats = ReviewModel.getFarmerStats(req.params.farmerId);
    res.json(stats);
  } catch (error) {
    console.error('Get farmer stats error:', error);
    res.status(500).json({ error: 'Failed to fetch farmer stats' });
  }
});

export default router;
