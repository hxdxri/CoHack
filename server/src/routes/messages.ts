import express from 'express';
import { MessageModel } from '../models/Message';
import { UserModel } from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = express.Router();

// Get all conversations for current user
router.get('/conversations', authenticateToken, (req: AuthRequest, res) => {
  try {
    const partnerIds = MessageModel.getConversationPartners(req.user!.id);
    
    const conversations = partnerIds.map(partnerId => {
      const partner = UserModel.findById(partnerId);
      const messages = MessageModel.getConversation(req.user!.id, partnerId);
      const lastMessage = messages[messages.length - 1];
      const unreadCount = MessageModel.getUnreadMessages(req.user!.id)
        .filter(m => m.fromUserId === partnerId).length;

      // Get farmer profile if partner is a farmer
      let farmerProfile = null;
      if (partner?.role === 'farmer') {
        farmerProfile = UserModel.getFarmerProfileByUserId(partnerId);
      }

      return {
        partnerId,
        partnerName: partner?.name || 'Unknown User',
        partnerRole: partner?.role || 'unknown',
        farmerProfile: farmerProfile ? {
          farmName: farmerProfile.farmName,
          location: farmerProfile.location,
        } : null,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          fromMe: lastMessage.fromUserId === req.user!.id,
        } : null,
        unreadCount,
        messageCount: messages.length,
      };
    });

    // Sort by last message time
    conversations.sort((a, b) => {
      if (!a.lastMessage && !b.lastMessage) return 0;
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
    });

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get conversation with specific user
router.get('/conversation/:userId', authenticateToken, (req: AuthRequest, res) => {
  try {
    const messages = MessageModel.getConversation(req.user!.id, req.params.userId);
    
    // Mark messages from the other user as read
    MessageModel.markConversationAsRead(req.params.userId, req.user!.id);

    // Add sender names to messages
    const messagesWithSenderNames = messages.map(message => {
      const sender = UserModel.findById(message.fromUserId);
      return {
        ...message,
        senderName: sender?.name || 'Unknown User',
        fromMe: message.fromUserId === req.user!.id,
      };
    });

    res.json(messagesWithSenderNames);
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Send message
router.post('/send', authenticateToken, (req: AuthRequest, res) => {
  try {
    const { toUserId, content } = req.body;

    if (!toUserId || !content) {
      return res.status(400).json({ error: 'Recipient and message content are required' });
    }

    // Check if recipient exists
    const recipient = UserModel.findById(toUserId);
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const message = MessageModel.create({
      fromUserId: req.user!.id,
      toUserId,
      content: content.trim(),
    });

    // Add sender info to response
    const messageWithSender = {
      ...message,
      senderName: req.user!.name,
      fromMe: true,
    };

    res.status(201).json(messageWithSender);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get unread messages count
router.get('/unread/count', authenticateToken, (req: AuthRequest, res) => {
  try {
    const unreadMessages = MessageModel.getUnreadMessages(req.user!.id);
    res.json({ count: unreadMessages.length });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
});

// Mark message as read
router.put('/:messageId/read', authenticateToken, (req: AuthRequest, res) => {
  try {
    const message = MessageModel.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.toUserId !== req.user!.id) {
      return res.status(403).json({ error: 'You can only mark your own messages as read' });
    }

    const updatedMessage = MessageModel.markAsRead(req.params.messageId);
    res.json(updatedMessage);
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ error: 'Failed to mark message as read' });
  }
});

export default router;
