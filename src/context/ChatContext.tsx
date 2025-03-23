
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
    id: 'mistral-small-24b-2501:free',
    name: 'mistral-small',
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
        const response = await fetch("http://localhost:11434/api/chat" || "http://192.168.1.4:11434/api/chat", {
          method: "POST",
          headers: {
            // Optional. Site title for rankings on openrouter.ai.
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "llama3.2:1b",
            "messages": [
              {"role": "user", "content": content}
            ],
            "stream": false
          })
        });
        
        const data = await response.json();
        const responseText = data.message.content || "Sorry, I couldn't process that request.";
        
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
        const errorMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, there was an error processing your request..",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }
    }
  }, []);
  
  const resetChat = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: "Hello! I'm your AI assistant. ",
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
