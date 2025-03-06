
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export type ModelType = {
  id: string;
  name: string;
  description: string;
};

// Available models
const AVAILABLE_MODELS: ModelType[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    description: 'Fast and efficient model for general queries'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    description: 'More powerful model with advanced reasoning capabilities'
  }
];
const model = "mistralai/mistral-small-24b-instruct-2501:free"
interface ChatContextType {
  messages: MessageType[];
  addMessage: (content: string, sender: 'user' | 'ai') => void;
  isLoading: boolean;
  resetChat: () => void;
  selectedModel: ModelType;
  setSelectedModel: (model: ModelType) => void;
  availableModels: ModelType[];
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
  const [selectedModel, setSelectedModel] = useState<ModelType>(AVAILABLE_MODELS[0]);
  
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
        const responseText = await  fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer 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",
 // Optional. Site title for rankings on openrouter.ai.
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": model,
    "messages": [
      {
        "role": "user",
        "content":    content }
    ]
  })
});
        
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
    selectedModel,
    setSelectedModel,
    availableModels: AVAILABLE_MODELS,
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
