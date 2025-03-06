
import React, { useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import MessageBubble from './MessageBubble';
import LoadingDots from './LoadingDots';
import Header from './Header';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  const { messages, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <Header />
      
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
