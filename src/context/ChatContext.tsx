
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

interface ChatContextType {
  messages: MessageType[];
  addMessage: (content: string, sender: 'user' | 'ai') => void;
  isLoading: boolean;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Generate a response based on the user's message
const generateResponse = async (userMessage: string): Promise<string> => {
  // Simulate AI thinking time
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // Simple responses for demo purposes
  const responses = [
    "I understand what you're saying. Can you tell me more?",
    "That's interesting. Let me think about that for a moment.",
    "I appreciate your input. Here's what I think about that...",
    "Thanks for sharing. From my perspective, I see it differently because...",
    "I've processed your message and have some thoughts to share.",
    "That's a fascinating point. Let me respond with some relevant information.",
    "I see what you mean. Let me offer a different perspective.",
    "Based on what you've told me, I would suggest considering the following...",
    "I've analyzed your message and here's my response.",
    "That's a great question. Let me provide you with a detailed answer."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addMessage = useCallback(async (content: string, sender: 'user' | 'ai') => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // If this is a user message, generate a response
    if (sender === 'user') {
      setIsLoading(true);
      try {
        const responseText = await generateResponse(content);
        
        setTimeout(() => {
          const aiResponse: MessageType = {
            id: (Date.now() + 1).toString(),
            content: responseText,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiResponse]);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error generating response:', error);
        setIsLoading(false);
      }
    }
  }, []);
  
  const resetChat = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  }, []);
  
  const value = {
    messages,
    addMessage,
    isLoading,
    resetChat,
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
