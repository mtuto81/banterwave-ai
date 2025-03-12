
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

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
    id: 'mistralai/mistral-small-latest',
    name: 'Mistral Small',
    description: 'Fast and efficient model for general queries'
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: 'More powerful model with advanced reasoning capabilities'
  }
];

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
        // API key for OpenRouter - Note: This is safe as it's a public API key intended for frontend use
        const apiKey = "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";
        
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin, // Required by OpenRouter
            "X-Title": "AI Chat Assistant"
          },
          body: JSON.stringify({
            "model": selectedModel.id,
            "messages": [
              {
                "role": "user",
                "content": content
              }
            ]
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData);
          throw new Error(`API error: ${errorData.error?.message || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (!data.choices || !data.choices.length) {
          throw new Error('Invalid response from AI service');
        }
        
        const responseText = data.choices[0].message.content || "Sorry, I couldn't process that request.";
        
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
        toast.error("Failed to get a response from the AI service. Please try again later.");
        
        const errorMessage: MessageType = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, there was an error processing your request. Please try again later.",
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setIsLoading(false);
      }
    }
  }, [selectedModel]);
  
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
