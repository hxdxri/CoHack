import { v4 as uuidv4 } from 'uuid';
import { localStorage } from '../storage/localStorage';
import { Message } from '../types';

export class MessageModel {
  private static MESSAGES_KEY = 'messages';

  static create(messageData: Omit<Message, 'id' | 'createdAt' | 'isRead'>): Message {
    const messages = this.getAll();

    const message: Message = {
      id: uuidv4(),
      ...messageData,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(message);
    localStorage.setItem(this.MESSAGES_KEY, messages);

    return message;
  }

  static getAll(): Message[] {
    return localStorage.getItem<Message[]>(this.MESSAGES_KEY) || [];
  }

  static findById(id: string): Message | null {
    const messages = this.getAll();
    return messages.find(m => m.id === id) || null;
  }

  static getConversation(userId1: string, userId2: string): Message[] {
    const messages = this.getAll();
    return messages
      .filter(m => 
        (m.fromUserId === userId1 && m.toUserId === userId2) ||
        (m.fromUserId === userId2 && m.toUserId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  static getUserMessages(userId: string): Message[] {
    const messages = this.getAll();
    return messages
      .filter(m => m.fromUserId === userId || m.toUserId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  static getUnreadMessages(userId: string): Message[] {
    const messages = this.getAll();
    return messages.filter(m => m.toUserId === userId && !m.isRead);
  }

  static markAsRead(id: string): Message | null {
    const messages = this.getAll();
    const messageIndex = messages.findIndex(m => m.id === id);
    
    if (messageIndex === -1) {
      return null;
    }

    messages[messageIndex] = {
      ...messages[messageIndex],
      isRead: true,
    };

    localStorage.setItem(this.MESSAGES_KEY, messages);
    return messages[messageIndex];
  }

  static markConversationAsRead(fromUserId: string, toUserId: string): void {
    const messages = this.getAll();
    let updated = false;

    messages.forEach(message => {
      if (message.fromUserId === fromUserId && message.toUserId === toUserId && !message.isRead) {
        message.isRead = true;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem(this.MESSAGES_KEY, messages);
    }
  }

  static delete(id: string): boolean {
    const messages = this.getAll();
    const filteredMessages = messages.filter(m => m.id !== id);
    
    if (filteredMessages.length === messages.length) {
      return false;
    }

    localStorage.setItem(this.MESSAGES_KEY, filteredMessages);
    return true;
  }

  // Get unique conversation partners for a user
  static getConversationPartners(userId: string): string[] {
    const messages = this.getUserMessages(userId);
    const partners = new Set<string>();

    messages.forEach(message => {
      if (message.fromUserId === userId) {
        partners.add(message.toUserId);
      } else {
        partners.add(message.fromUserId);
      }
    });

    return Array.from(partners);
  }
}
