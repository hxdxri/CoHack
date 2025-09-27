import { create } from 'zustand';
import { Message, Conversation, MessageFormData } from '@/types';
import { useAuthStore } from './auth';

interface MessagesState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // partnerId -> messages
  isLoading: boolean;
  activeConversation: string | null;
  
  // Actions
  loadConversations: () => Promise<void>;
  loadMessages: (partnerId: string) => Promise<void>;
  sendMessage: (partnerId: string, data: MessageFormData) => Promise<void>;
  setActiveConversation: (partnerId: string | null) => void;
  markAsRead: (partnerId: string) => void;
}

// Mock data - in a real app this would come from an API
const mockUsers = [
  {
    id: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    name: "Sarah Johnson",
    role: "farmer" as const,
    farmName: "Green Valley Farm",
    location: "Sonoma County, CA"
  },
  {
    id: "f4771795-d367-49b5-a82f-b7d6acc63171",
    name: "Mike Chen",
    role: "customer" as const
  },
  {
    id: "farmer-2",
    name: "David Martinez",
    role: "farmer" as const,
    farmName: "Sunrise Organic Farm",
    location: "Napa Valley, CA"
  },
  {
    id: "customer-2",
    name: "Emily Rodriguez",
    role: "customer" as const
  },
  {
    id: "farmer-3",
    name: "Lisa Thompson",
    role: "farmer" as const,
    farmName: "Mountain View Ranch",
    location: "Mendocino County, CA"
  }
];

const mockMessages: Message[] = [
  // Conversation between Mike Chen (customer) and Sarah Johnson (farmer)
  {
    id: "msg-1",
    fromUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    toUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    content: "Hi Sarah! I'm interested in your heirloom tomatoes. Do you have any available for pickup this weekend?",
    isRead: true,
    createdAt: "2025-09-26T10:30:00.000Z"
  },
  {
    id: "msg-2",
    fromUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    toUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    content: "Hi Mike! Yes, I have plenty of heirloom tomatoes available. You can come by Saturday morning between 9-11 AM. The farm is located at 123 Green Valley Road.",
    isRead: true,
    createdAt: "2025-09-26T11:15:00.000Z"
  },
  {
    id: "msg-3",
    fromUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    toUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    content: "Perfect! I'll be there around 10 AM. Should I bring cash or do you accept cards?",
    isRead: true,
    createdAt: "2025-09-26T11:45:00.000Z"
  },
  {
    id: "msg-4",
    fromUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    toUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    content: "Both cash and cards work fine! Looking forward to seeing you. Feel free to walk around the farm and see our other produce too.",
    isRead: false,
    createdAt: "2025-09-27T08:20:00.000Z"
  },
  
  // Conversation between Mike Chen (customer) and David Martinez (farmer)
  {
    id: "msg-5",
    fromUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    toUserId: "farmer-2",
    content: "Hello David! I saw your listing for organic strawberries. Are they still available?",
    isRead: true,
    createdAt: "2025-09-25T14:20:00.000Z"
  },
  {
    id: "msg-6",
    fromUserId: "farmer-2",
    toUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    content: "Hi Mike! Yes, we have fresh strawberries picked this morning. They're $8 per basket. Would you like to reserve some?",
    isRead: true,
    createdAt: "2025-09-25T15:30:00.000Z"
  },
  {
    id: "msg-7",
    fromUserId: "f4771795-d367-49b5-a82f-b7d6acc63171",
    toUserId: "farmer-2",
    content: "I'd like to reserve 3 baskets please. When would be a good time to pick them up?",
    isRead: false,
    createdAt: "2025-09-27T09:15:00.000Z"
  },

  // Conversation between Sarah Johnson (farmer) and Emily Rodriguez (customer)
  {
    id: "msg-8",
    fromUserId: "customer-2",
    toUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    content: "Hi Sarah! I'm planning a dinner party and would love to get some fresh vegetables from your farm. What do you have available?",
    isRead: true,
    createdAt: "2025-09-24T16:45:00.000Z"
  },
  {
    id: "msg-9",
    fromUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    toUserId: "customer-2",
    content: "Hi Emily! That sounds wonderful! We have fresh lettuce, carrots, bell peppers, zucchini, and herbs. I can put together a dinner party bundle for you. When is your party?",
    isRead: true,
    createdAt: "2025-09-24T17:20:00.000Z"
  },
  {
    id: "msg-10",
    fromUserId: "customer-2",
    toUserId: "664c120a-91aa-4fea-be8c-156b7c1a5305",
    content: "The party is this Saturday evening. A bundle sounds perfect! How much would that be?",
    isRead: false,
    createdAt: "2025-09-27T12:30:00.000Z"
  }
];

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  messages: {},
  isLoading: false,
  activeConversation: null,

  loadConversations: async () => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Group messages by conversation partner
    const conversationMap = new Map<string, Conversation>();
    
    mockMessages.forEach(message => {
      const isFromMe = message.fromUserId === user.id;
      const partnerId = isFromMe ? message.toUserId : message.fromUserId;
      
      if (!conversationMap.has(partnerId)) {
        const partner = mockUsers.find(u => u.id === partnerId);
        if (!partner) return;
        
        conversationMap.set(partnerId, {
          partnerId,
          partnerName: partner.name,
          partnerRole: partner.role,
          farmerProfile: partner.role === 'farmer' ? {
            farmName: partner.farmName!,
            location: partner.location!
          } : undefined,
          unreadCount: 0,
          messageCount: 0
        });
      }
      
      const conversation = conversationMap.get(partnerId)!;
      conversation.messageCount++;
      
      if (!message.isRead && !isFromMe) {
        conversation.unreadCount++;
      }
      
      // Update last message
      if (!conversation.lastMessage || new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
        conversation.lastMessage = {
          content: message.content,
          createdAt: message.createdAt,
          fromMe: isFromMe
        };
      }
    });

    const conversations = Array.from(conversationMap.values())
      .sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });

    set({ conversations, isLoading: false });
  },

  loadMessages: async (partnerId: string) => {
    set({ isLoading: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Filter messages for this conversation
    const conversationMessages = mockMessages
      .filter(message => 
        (message.fromUserId === user.id && message.toUserId === partnerId) ||
        (message.fromUserId === partnerId && message.toUserId === user.id)
      )
      .map(message => ({
        ...message,
        fromMe: message.fromUserId === user.id,
        senderName: message.fromUserId === user.id ? user.name : mockUsers.find(u => u.id === message.fromUserId)?.name
      }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    set(state => ({
      messages: {
        ...state.messages,
        [partnerId]: conversationMessages
      },
      isLoading: false
    }));
  },

  sendMessage: async (partnerId: string, data: MessageFormData) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      fromUserId: user.id,
      toUserId: partnerId,
      content: data.content,
      isRead: false,
      createdAt: new Date().toISOString(),
      fromMe: true,
      senderName: user.name
    };

    // Add to mock data for persistence during session
    mockMessages.push(newMessage);

    // Update local state
    set(state => ({
      messages: {
        ...state.messages,
        [partnerId]: [...(state.messages[partnerId] || []), newMessage]
      }
    }));

    // Update conversation last message
    set(state => ({
      conversations: state.conversations.map(conv => 
        conv.partnerId === partnerId 
          ? {
              ...conv,
              lastMessage: {
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                fromMe: true
              },
              messageCount: conv.messageCount + 1
            }
          : conv
      )
    }));
  },

  setActiveConversation: (partnerId: string | null) => {
    set({ activeConversation: partnerId });
  },

  markAsRead: (partnerId: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    // Mark messages as read in mock data
    mockMessages.forEach(message => {
      if (message.fromUserId === partnerId && message.toUserId === user.id) {
        message.isRead = true;
      }
    });

    // Update local state
    set(state => ({
      messages: {
        ...state.messages,
        [partnerId]: state.messages[partnerId]?.map(msg => 
          !msg.fromMe ? { ...msg, isRead: true } : msg
        ) || []
      },
      conversations: state.conversations.map(conv => 
        conv.partnerId === partnerId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    }));
  }
}));
