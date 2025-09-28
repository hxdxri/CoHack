import express from 'express';
import { OrderModel } from '../models/Order';
import { authenticateToken, requireRole } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get my orders (customers and farmers)
router.get('/my/orders', authenticateToken, (req: AuthRequest, res) => {
  try {
    const user = req.user!;
    let orders;

    if (user.role === 'customer') {
      orders = OrderModel.findByCustomerId(user.id);
    } else if (user.role === 'farmer') {
      orders = OrderModel.findByFarmerId(user.id);
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get order by ID
router.get('/:id', authenticateToken, (req: AuthRequest, res) => {
  try {
    const order = OrderModel.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user has access to this order
    const user = req.user!;
    if (order.customerId !== user.id && order.farmerId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Update order status (farmers only)
router.put('/:id/status', authenticateToken, requireRole('farmer'), (req: AuthRequest, res) => {
  try {
    const { status } = req.body;
    const order = OrderModel.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if farmer owns this order
    if (order.farmerId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only update your own orders' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedOrder = OrderModel.updateStatus(req.params.id, status);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Verify delivery pin
router.post('/:id/verify-pin', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { pin } = req.body;
    const order = OrderModel.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if user has access to this order
    const user = req.user!;
    if (order.customerId !== user.id && order.farmerId !== user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (!pin) {
      return res.status(400).json({ error: 'Pin is required' });
    }

    const isValid = OrderModel.verifyDeliveryPin(req.params.id, pin);
    res.json({ isValid });
  } catch (error) {
    console.error('Verify delivery pin error:', error);
    res.status(500).json({ error: 'Failed to verify pin' });
  }
});

// Add rating and review (customers only)
router.post('/:id/rate', authenticateToken, requireRole('customer'), (req: AuthRequest, res) => {
  try {
    const { rating, review } = req.body;
    const order = OrderModel.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Check if customer owns this order
    if (order.customerId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only rate your own orders' });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'You can only rate delivered orders' });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const updatedOrder = OrderModel.addRating(req.params.id, rating, review || '');
    res.json(updatedOrder);
  } catch (error) {
    console.error('Rate order error:', error);
    res.status(500).json({ error: 'Failed to rate order' });
  }
});

// Create order (customers only)
router.post('/', authenticateToken, requireRole('customer'), (req: AuthRequest, res) => {
  try {
    const { farmerId, items, deliveryAddress, notes } = req.body;

    if (!farmerId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Farmer ID and items are required' });
    }

    if (!deliveryAddress) {
      return res.status(400).json({ error: 'Delivery address is required' });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Generate delivery pin
    const deliveryPin = Math.random().toString(36).substring(2, 8).toUpperCase();

    const order = OrderModel.create({
      farmerId,
      customerId: req.user!.id,
      customerName: req.user!.name,
      customerEmail: req.user!.email,
      customerPhone: req.user!.phone,
      items,
      totalAmount,
      status: 'pending',
      deliveryAddress,
      deliveryPin,
      notes,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

export default router;
