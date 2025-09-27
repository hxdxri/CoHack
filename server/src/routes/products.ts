import express from 'express';
import { ProductModel } from '../models/Product';
import { UserModel } from '../models/User';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get all active products
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query;
    let products = ProductModel.getActive();

    if (category && typeof category === 'string') {
      products = ProductModel.findByCategory(category as any);
    }

    if (search && typeof search === 'string') {
      products = ProductModel.search(search);
    }

    // Add farmer info to each product
    const productsWithFarmer = products.map(product => {
      const farmerProfile = UserModel.getFarmerProfileByUserId(product.farmerId);
      const farmer = UserModel.findById(product.farmerId);
      
      return {
        ...product,
        farmer: farmerProfile ? {
          farmName: farmerProfile.farmName,
          location: farmerProfile.location,
          averageRating: farmerProfile.averageRating,
          totalReviews: farmerProfile.totalReviews,
        } : null,
        farmerName: farmer?.name || 'Unknown Farmer',
      };
    });

    res.json(productsWithFarmer);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', (req, res) => {
  try {
    const product = ProductModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add farmer info
    const farmerProfile = UserModel.getFarmerProfileByUserId(product.farmerId);
    const farmer = UserModel.findById(product.farmerId);

    const productWithFarmer = {
      ...product,
      farmer: farmerProfile ? {
        farmName: farmerProfile.farmName,
        location: farmerProfile.location,
        averageRating: farmerProfile.averageRating,
        totalReviews: farmerProfile.totalReviews,
        description: farmerProfile.description,
      } : null,
      farmerName: farmer?.name || 'Unknown Farmer',
    };

    res.json(productWithFarmer);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get farmer's products
router.get('/farmer/:farmerId', (req, res) => {
  try {
    const products = ProductModel.findByFarmerId(req.params.farmerId);
    res.json(products);
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({ error: 'Failed to fetch farmer products' });
  }
});

// Create product (farmers only)
router.post('/', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const { name, category, price, quantity, unit, description, imageUrl } = req.body;

    // Validation
    if (!name || !category || !price || !quantity || !unit || !description) {
      return res.status(400).json({ error: 'All product fields are required' });
    }

    const product = ProductModel.create({
      farmerId: req.user!.id,
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      unit,
      description,
      imageUrl: imageUrl || undefined,
      isActive: true,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (farmers only, own products)
router.put('/:id', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const product = ProductModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmerId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only update your own products' });
    }

    const { name, category, price, quantity, unit, description, imageUrl, isActive } = req.body;

    const updatedProduct = ProductModel.update(req.params.id, {
      ...(name && { name }),
      ...(category && { category }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(quantity !== undefined && { quantity: parseInt(quantity) }),
      ...(unit && { unit }),
      ...(description && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive }),
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (farmers only, own products)
router.delete('/:id', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const product = ProductModel.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.farmerId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only delete your own products' });
    }

    const deleted = ProductModel.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Get my products (farmers only)
router.get('/my/products', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const products = ProductModel.findByFarmerId(req.user!.id);
    res.json(products);
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ error: 'Failed to fetch your products' });
  }
});

export default router;
