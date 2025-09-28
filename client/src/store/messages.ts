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
    id: "39333f70-4760-45d1-bc00-d72263be6d59",
    name: "Klark Kent",
    role: "farmer" as const,
    farmName: "Green Valley Organic Farm",
    location: "Saskatoon, Saskatchewan"
  },
  {
    id: "7f8e9d2a-3c4b-5e6f-7a8b-9c0d1e2f3a4b",
    name: "Michael Thompson",
    role: "farmer" as const,
    farmName: "Sunrise Meadows Dairy",
    location: "Regina, Saskatchewan"
  },
  {
    id: "8a9b0c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    name: "David Rodriguez",
    role: "farmer" as const,
    farmName: "Mountain View Orchard",
    location: "Prince Albert, Saskatchewan"
  },
  {
    id: "9b0c1d2e-5f6a-7b8c-9d0e-1f2a3b4c5d6e",
    name: "Linda Chen",
    role: "farmer" as const,
    farmName: "Heritage Berry Farm",
    location: "Moose Jaw, Saskatchewan"
  },
  {
    id: "0c1d2e3f-6a7b-8c9d-0e1f-2a3b4c5d6e7f",
    name: "Robert Wilson",
    role: "farmer" as const,
    farmName: "Golden Fields Wheat Farm",
    location: "North Battleford, Saskatchewan"
  },
  {
    id: "1d2e3f4a-7b8c-9d0e-1f2a-3b4c5d6e7f8a",
    name: "Maria Garcia",
    role: "farmer" as const,
    farmName: "Coastal Greenhouse",
    location: "Swift Current, Saskatchewan"
  },
  {
    id: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    name: "Lois Lane",
    role: "customer" as const
  }
];

const mockMessages: Message[] = [
  // Conversation between Lois Lane (customer) and Klark Kent (farmer)
  {
    id: "msg-1",
    fromUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    toUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
    content: "Hi Sarah! I'm interested in your heirloom tomatoes. Do you have any available for pickup this weekend?",
    isRead: true,
    createdAt: "2025-09-26T10:30:00.000Z"
  },
  {
    id: "msg-2",
    fromUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
    toUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    content: "Hi Mike! Yes, I have plenty of heirloom tomatoes available. You can come by Saturday morning between 9-11 AM. The farm is located at 123 Green Valley Road.",
    isRead: true,
    createdAt: "2025-09-26T11:15:00.000Z"
  },
  {
    id: "msg-3",
    fromUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    toUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
    content: "Perfect! I'll be there around 10 AM. Should I bring cash or do you accept cards?",
    isRead: true,
    createdAt: "2025-09-26T11:45:00.000Z"
  },
  {
    id: "msg-4",
    fromUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
    toUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    content: "Both cash and cards work fine! Looking forward to seeing you. Feel free to walk around the farm and see our other produce too.",
    isRead: false,
    createdAt: "2025-09-27T08:20:00.000Z"
  },
  
  // Conversation between Lois Lane (customer) and David Rodriguez (farmer)
  {
    id: "msg-5",
    fromUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    toUserId: "8a9b0c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    content: "Hello David! I saw your listing for organic strawberries. Are they still available?",
    isRead: true,
    createdAt: "2025-09-25T14:20:00.000Z"
  },
  {
    id: "msg-6",
    fromUserId: "8a9b0c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    toUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    content: "Hi Mike! Yes, we have fresh strawberries picked this morning. They're $8 per basket. Would you like to reserve some?",
    isRead: true,
    createdAt: "2025-09-25T15:30:00.000Z"
  },
  {
    id: "msg-7",
    fromUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    toUserId: "8a9b0c1d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
    content: "I'd like to reserve 3 baskets please. When would be a good time to pick them up?",
    isRead: false,
    createdAt: "2025-09-27T09:15:00.000Z"
  },

  // Conversation between Klark Kent (farmer) and another customer
  {
    id: "msg-8",
    fromUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    toUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
    content: "Hi Sarah! I'm planning a dinner party and would love to get some fresh vegetables from your farm. What do you have available?",
    isRead: true,
    createdAt: "2025-09-24T16:45:00.000Z"
  },
  {
    id: "msg-9",
    fromUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
    toUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    content: "Hi! That sounds wonderful! We have fresh lettuce, carrots, bell peppers, zucchini, and herbs. I can put together a dinner party bundle for you. When is your party?",
    isRead: true,
    createdAt: "2025-09-24T17:20:00.000Z"
  },
  {
    id: "msg-10",
    fromUserId: "96d1a1a0-fdbf-47a8-a72f-5df362b50152",
    toUserId: "39333f70-4760-45d1-bc00-d72263be6d59",
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

    // Check if conversation exists, if not create a new one
    set(state => {
      const existingConversation = state.conversations.find(conv => conv.partnerId === partnerId);
      
      if (existingConversation) {
        // Update existing conversation
        return {
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
        };
      } else {
        // Create new conversation
        const partner = mockUsers.find(u => u.id === partnerId);
        if (!partner) return state;

        const newConversation: Conversation = {
          partnerId,
          partnerName: partner.name,
          partnerRole: partner.role,
          farmerProfile: partner.role === 'farmer' ? {
            farmName: partner.farmName!,
            location: partner.location!
          } : undefined,
          unreadCount: 0,
          messageCount: 1,
          lastMessage: {
            content: newMessage.content,
            createdAt: newMessage.createdAt,
            fromMe: true
          }
        };

        return {
          conversations: [newConversation, ...state.conversations]
        };
      }
    });
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
