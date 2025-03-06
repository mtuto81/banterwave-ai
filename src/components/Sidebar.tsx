
import React from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageSquare, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { messages, addMessage } = useChat();
  
  // Extract unique conversations (group by first user message)
  const conversations = messages.reduce((acc, message) => {
    if (message.sender === 'user') {
      // Create a new conversation for each user message
      acc.push({
        id: message.id,
        title: message.content.slice(0, 30) + (message.content.length > 30 ? '...' : ''),
        timestamp: message.timestamp
      });
    }
    return acc;
  }, [] as { id: string; title: string; timestamp: Date }[]);

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-border shadow-lg transition-transform duration-300 z-20",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-medium">Chat History</h2>
        <button 
          onClick={onClose}
          className="p-2 rounded-full hover:bg-secondary/80 transition-colors md:hidden"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="p-2 overflow-y-auto h-[calc(100%-4rem)]">
        {conversations.length === 0 ? (
          <div className="text-center text-muted-foreground p-4">
            No conversations yet
          </div>
        ) : (
          conversations.map((convo) => (
            <button
              key={convo.id}
              className="w-full text-left p-3 rounded-lg hover:bg-secondary/50 transition-colors mb-2 flex items-start"
              onClick={() => {
                // In a real app, this would load the conversation
                console.log('Load conversation:', convo.id);
              }}
            >
              <MessageSquare size={16} className="mr-2 mt-1 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium line-clamp-1">{convo.title}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {convo.timestamp.toLocaleDateString()}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
