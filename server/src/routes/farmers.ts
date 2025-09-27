import express from 'express';
import { UserModel } from '../models/User';
import { ReviewModel } from '../models/Review';
import { ProductModel } from '../models/Product';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get all farmer profiles
router.get('/', (req, res) => {
  try {
    const farmerProfiles = UserModel.getAllFarmerProfiles();
    
    // Add user info to each profile
    const profilesWithUserInfo = farmerProfiles.map(profile => {
      const user = UserModel.findById(profile.userId);
      return {
        ...profile,
        name: user?.name || 'Unknown',
        email: user?.email || '',
      };
    });

    res.json(profilesWithUserInfo);
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({ error: 'Failed to fetch farmers' });
  }
});

// Get farmer profile by ID
router.get('/:id', (req, res) => {
  try {
    const farmerProfile = UserModel.getFarmerProfileByUserId(req.params.id);
    
    if (!farmerProfile) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }

    const user = UserModel.findById(req.params.id);
    const reviews = ReviewModel.findByFarmerId(req.params.id);
    const products = ProductModel.findByFarmerId(req.params.id).filter(p => p.isActive);

    // Add customer names to reviews
    const reviewsWithCustomerNames = reviews.map(review => {
      const customer = UserModel.findById(review.customerId);
      return {
        ...review,
        customerName: customer?.name || 'Anonymous',
      };
    });

    const profileWithDetails = {
      ...farmerProfile,
      name: user?.name || 'Unknown',
      email: user?.email || '',
      reviews: reviewsWithCustomerNames,
      products,
      productCount: products.length,
    };

    res.json(profileWithDetails);
  } catch (error) {
    console.error('Get farmer profile error:', error);
    res.status(500).json({ error: 'Failed to fetch farmer profile' });
  }
});

// Get my farmer profile (farmers only)
router.get('/my/profile', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const farmerProfile = UserModel.getFarmerProfileByUserId(req.user!.id);
    
    if (!farmerProfile) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }

    const reviews = ReviewModel.findByFarmerId(req.user!.id);
    const products = ProductModel.findByFarmerId(req.user!.id);

    // Add customer names to reviews
    const reviewsWithCustomerNames = reviews.map(review => {
      const customer = UserModel.findById(review.customerId);
      return {
        ...review,
        customerName: customer?.name || 'Anonymous',
      };
    });

    const profileWithDetails = {
      ...farmerProfile,
      name: req.user!.name,
      email: req.user!.email,
      reviews: reviewsWithCustomerNames,
      products,
      productCount: products.length,
    };

    res.json(profileWithDetails);
  } catch (error) {
    console.error('Get my farmer profile error:', error);
    res.status(500).json({ error: 'Failed to fetch your farmer profile' });
  }
});

// Update farmer profile (farmers only)
router.put('/my/profile', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const { farmName, description, location, farmHistory } = req.body;

    const updatedProfile = UserModel.updateFarmerProfile(req.user!.id, {
      ...(farmName && { farmName }),
      ...(description && { description }),
      ...(location && { location }),
      ...(farmHistory && { farmHistory }),
    });

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }

    res.json(updatedProfile);
  } catch (error) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({ error: 'Failed to update farmer profile' });
  }
});

// Get farmer reviews
router.get('/:id/reviews', (req, res) => {
  try {
    const reviews = ReviewModel.findByFarmerId(req.params.id);
    
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
    res.status(500).json({ error: 'Failed to fetch farmer reviews' });
  }
});

export default router;
