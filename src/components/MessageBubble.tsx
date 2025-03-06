
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { MessageType } from '@/context/ChatContext';

interface MessageBubbleProps {
  message: MessageType;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { content, sender, timestamp } = message;
  const isUser = sender === 'user';
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div
      ref={bubbleRef}
      className={cn(
        'flex w-full my-4 transition-all duration-300 ease-out max-w-3xl',
        isUser ? 'justify-end ml-auto' : 'justify-start mr-auto',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div
        className={cn(
          'flex flex-col relative rounded-2xl px-4 py-3 shadow-sm transition-all',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'glass-panel rounded-tl-sm'
        )}
      >
        <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </div>
        <span className={cn(
          'text-[10px] opacity-70 mt-1 self-end',
          isUser ? 'text-primary-foreground/70' : 'text-foreground/70'
        )}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
