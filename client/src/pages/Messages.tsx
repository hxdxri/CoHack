import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { useMessagesStore } from '@/store/messages';
import { useAuthStore } from '@/store/auth';
import { ConversationList } from '@/components/ui/ConversationList';
import { MessageThread } from '@/components/ui/MessageThread';
import { MessageInput } from '@/components/ui/MessageInput';
import { Button } from '@/components/ui/Button';

export const Messages: React.FC = () => {
  const { user } = useAuthStore();
  const {
    conversations,
    messages,
    isLoading,
    activeConversation,
    loadConversations,
    loadMessages,
    sendMessage,
    setActiveConversation,
    markAsRead
  } = useMessagesStore();

  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectConversation = async (partnerId: string) => {
    setActiveConversation(partnerId);
    await loadMessages(partnerId);
    markAsRead(partnerId);
  };

  const handleSendMessage = async (content: string) => {
    if (activeConversation) {
      await sendMessage(activeConversation, { content });
    }
  };

  const handleBackToList = () => {
    setActiveConversation(null);
  };

  const activeConversationData = conversations.find(
    conv => conv.partnerId === activeConversation
  );

  const activeMessages = activeConversation ? messages[activeConversation] || [] : [];

  // Mobile view: show either conversation list or active conversation
  if (isMobileView) {
    if (activeConversation && activeConversationData) {
      return (
        <div className="h-full flex flex-col bg-white">
          {/* Mobile Header */}
          <div className="flex items-center p-4 border-b bg-white">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToList}
              className="mr-3 p-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">
                {activeConversationData.partnerName}
              </h2>
              {activeConversationData.partnerRole === 'farmer' && activeConversationData.farmerProfile && (
                <p className="text-sm text-gray-500">
                  {activeConversationData.farmerProfile.farmName}
                </p>
              )}
            </div>
          </div>

          {/* Messages */}
          <MessageThread
            messages={activeMessages}
            partnerName={activeConversationData.partnerName}
            isLoading={isLoading}
          />

          {/* Message Input */}
          <MessageInput
            onSendMessage={handleSendMessage}
            placeholder={`Message ${activeConversationData.partnerName}...`}
          />
        </div>
      );
    }

    // Mobile: Show conversation list
    return (
      <div className="h-full bg-white">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-green-600" />
            Messages
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {user?.role === 'farmer' 
              ? 'Connect with your customers'
              : 'Connect with local farmers'
            }
          </p>
        </div>
        
        <ConversationList
          conversations={conversations}
          activeConversation={activeConversation}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoading}
        />
      </div>
    );
  }

  // Desktop view: show both panels
  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageCircle className="h-8 w-8 mr-3 text-green-600" />
          Messages
        </h1>
        <p className="text-gray-600 mt-2">
          {user?.role === 'farmer' 
            ? 'Connect with your customers and manage inquiries about your products.'
            : 'Connect with local farmers and inquire about their fresh produce.'
          }
        </p>
      </div>

      <div className="flex h-full">
        {/* Conversations Panel */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
            <p className="text-sm text-gray-500 mt-1">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Messages Panel */}
        <div className="flex-1 flex flex-col">
          {activeConversation && activeConversationData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <h2 className="font-semibold text-gray-900">
                  {activeConversationData.partnerName}
                </h2>
                {activeConversationData.partnerRole === 'farmer' && activeConversationData.farmerProfile && (
                  <p className="text-sm text-gray-500">
                    {activeConversationData.farmerProfile.farmName} • {activeConversationData.farmerProfile.location}
                  </p>
                )}
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-500 capitalize">
                    {activeConversationData.partnerRole}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <MessageThread
                messages={activeMessages}
                partnerName={activeConversationData.partnerName}
                isLoading={isLoading}
              />

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder={`Message ${activeConversationData.partnerName}...`}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                <p className="text-sm">
                  Choose a conversation from the list to start messaging.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
