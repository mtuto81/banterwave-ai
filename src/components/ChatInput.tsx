
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { cn } from '@/lib/utils';
import { Send } from 'lucide-react';
import ModelSelector from './ModelSelector';

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const { addMessage, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  
  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || isLoading) return;
    
    addMessage(message.trim(), 'user');
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  // Handle Enter key to submit (with shift+enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendButtonRef.current?.click();
    }
  };
  
  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative mx-auto w-full max-w-4xl px-4 pb-6"
    >
      <div className="glass-panel flex items-end rounded-xl overflow-hidden shadow-lg transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 max-h-[150px] py-3 px-4 bg-transparent border-0 outline-none resize-none text-foreground placeholder:text-muted-foreground focus:ring-0"
          disabled={isLoading}
          rows={1}
        />
        <div className="flex items-center mr-1">
          <ModelSelector />
          <button
            ref={sendButtonRef}
            type="submit"
            disabled={message.trim() === '' || isLoading}
            className={cn(
              "p-3 rounded-full m-1.5 transition-all duration-200 ease-out",
              message.trim() !== '' && !isLoading
                ? "bg-primary/90 hover:bg-primary text-primary-foreground opacity-100"
                : "bg-secondary/50 text-secondary-foreground/50 cursor-not-allowed opacity-70"
            )}
            aria-label="Send message"
          >
            <Send size={18} className="transition-transform duration-200" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
