
import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, PanelRight } from 'lucide-react';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';
import Header from './Header';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
import ContextWindow from './ContextWindow';

const ChatInterface: React.FC = () => {
  const { messages, isLoading } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextWindowOpen, setContextWindowOpen] = useState(false);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header />
      
      {/* Sidebar and Context Window toggles */}
      <div className="fixed left-6 bottom-24 z-30 flex flex-col space-y-2">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>
      
      <div className="fixed right-6 bottom-24 z-30">
        <button
          onClick={() => setContextWindowOpen(!contextWindowOpen)}
          className="p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          aria-label="Toggle context window"
        >
          <PanelRight size={18} />
        </button>
      </div>
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Context Window */}
      <ContextWindow isOpen={contextWindowOpen} onClose={() => setContextWindowOpen(false)} />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="chat-container">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingDots />}
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <ChatInput />
    </div>
  );
};

export default ChatInterface;
