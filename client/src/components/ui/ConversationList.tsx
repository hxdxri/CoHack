import React from 'react';
import { MessageCircle, User, MapPin } from 'lucide-react';
import { Conversation } from '@/types';
import { Badge } from './Badge';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  onSelectConversation: (partnerId: string) => void;
  isLoading?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  isLoading = false
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 60) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-sm text-center">
          Start a conversation by browsing farmers or customers and sending them a message.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conversation) => (
        <div
          key={conversation.partnerId}
          onClick={() => onSelectConversation(conversation.partnerId)}
          className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
            activeConversation === conversation.partnerId ? 'bg-green-50 border-r-2 border-green-500' : ''
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {conversation.partnerName}
                </h3>
                {conversation.lastMessage && (
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatTime(conversation.lastMessage.createdAt)}
                  </span>
                )}
              </div>
              
              {conversation.partnerRole === 'farmer' && conversation.farmerProfile && (
                <div className="flex items-center text-xs text-gray-500 mb-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate">
                    {conversation.farmerProfile.farmName} • {conversation.farmerProfile.location}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  {conversation.lastMessage ? (
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.fromMe ? 'You: ' : ''}
                      {truncateMessage(conversation.lastMessage.content)}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No messages yet</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-2">
                  {conversation.unreadCount > 0 && (
                    <Badge variant="primary" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {conversation.partnerRole}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
